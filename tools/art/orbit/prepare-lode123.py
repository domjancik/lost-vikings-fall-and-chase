"""One uniform normalization from independently reviewed native-density sources."""
from pathlib import Path
import json
from PIL import Image
p=Path('assets/lode123')
def clean(im):
 im=im.convert('RGBA');px=im.load()
 for y in range(im.height):
  for x in range(im.width):
   r,g,b,a=px[x,y];px[x,y]=(r,g,b,255) if a>=200 else (0,0,0,0)
 return im
raw=Image.open(p/'stator-raw-v1.png').convert('RGBA')
box=raw.getchannel('A').point(lambda a:255 if a>=220 else 0).getbbox()
scale=280/(box[2]-box[0]);size=(280,round((box[3]-box[1])*scale));assert size==(280,278),size
stator=Image.new('RGBA',(300,300));stator.alpha_composite(clean(raw.crop(box).resize(size,Image.Resampling.NEAREST)),(10,11))
sheet=clean(Image.open(p/'kit-raw-v2.png').resize((256,192),Image.Resampling.NEAREST))
kit=Image.new('RGBA',sheet.size);frames=[]
# Recover complete subjects across nominal row boundaries, exclude neighboring
# subjects by connected material, then register by translation only.
for n in range(12):
 x=n%4*64;y=n//4*64;top=max(0,y-8);bottom=min(192,y+72)
 src=sheet.crop((x,top,x+64,bottom));mask=src.getchannel('A');seen=set();groups=[]
 for yy in range(src.height):
  for xx in range(64):
   if (xx,yy) in seen or not mask.getpixel((xx,yy)):continue
   group=[];todo=[(xx,yy)];seen.add((xx,yy))
   while todo:
    a,b=todo.pop();group.append((a,b))
    for aa,bb in [(a-1,b),(a+1,b),(a,b-1),(a,b+1)]:
     if 0<=aa<64 and 0<=bb<src.height and (aa,bb) not in seen and mask.getpixel((aa,bb)):
      seen.add((aa,bb));todo.append((aa,bb))
   groups.append(group)
 main=max(groups,key=lambda g:sum(y+8<=top+b<y+64 for a,b in g))
 lo=min(b for a,b in main);hi=max(b for a,b in main)+1
 # Include detached pieces only inside this object's vertical extent.
 keep=[g for g in groups if (n==11 or any(lo<=b<hi for a,b in g)) and len(g)>=3]
 material=Image.new('RGBA',src.size)
 for group in keep:
  for a,b in group:material.putpixel((a,b),src.getpixel((a,b)))
 box=material.getbbox();dx=0;dy=y-top
 if n in [1,2,3,4]:dy=box[3]-60
 if n in [5,6,7]:dy=box[3]-54
 # dy is extraction-local amount to subtract; original row otherwise unchanged.
 cell=Image.new('RGBA',(64,64));cell.alpha_composite(material,(dx,-dy))
 assert cell.getbbox() is not None
 kit.alpha_composite(cell,(x,y));frames.append({'cell':n,'sourceBox':[x+box[0],top+box[1],x+box[2],top+box[3]],'translation':[dx,y-top-dy],'nativeBox':list(cell.getbbox())})
far=Image.open(p/'far-raw-v1.png').convert('RGBA').resize((768,640),Image.Resampling.NEAREST)
middle=clean(Image.open(p/'middle-raw-v2.png').resize((768,640),Image.Resampling.NEAREST))
# Midground's authored relief stays intact; a uniform depth palette recedes behind live machinery.
px=middle.load()
for y in range(middle.height):
 for x in range(middle.width):
  r,g,b,a=px[x,y]
  if a:px[x,y]=(round(r*.8),round(g*.8),round(b*.8),a)
for name,im in [('stator',stator),('kit',kit),('far',far),('middle',middle)]:
 im.save(p/(name+'-native.png'))
 if name in ['stator','kit']:im.resize((im.width*4,im.height*4),Image.Resampling.NEAREST).save(p/(name+'-native-4x.png'))
r={'method':'Retained source once; uniform nearest normalization, binary material alpha, zero hidden RGB. No palette quantization/grid rescue.',
 'stator':{'source':'stator-raw-v1.png','sourceBox':raw.getchannel('A').point(lambda a:255 if a>=220 else 0).getbbox(),'scale':scale,'nativeCanvas':[300,300],'body':list(size),'paste':[10,11],'pivot':[150,150],'worldBody':[560,556],'center':[1000,978],'top':700,'bottom':1256},
 'kit':{'source':'kit-raw-v2.png','nativeCanvas':[256,192],'cell':[64,64],'frames':frames,'boxes':[kit.crop((n%4*64,n//4*64,n%4*64+64,n//4*64+64)).getbbox() for n in range(12)],
        'brake':{'ropeTargetNative':[32,29],'drawOrigin':[1932,618],'worldTarget':[1996,676],'upperMountY':622,'hingeConnectionY':724},'sentry':{'sole':54,'muzzle':[62,32],'worldMuzzleOffset':[60,-44]},'cart':{'wheelOuterTop':12,'axle':19,'bodyBottom':59,'sourceHeightWorld':94,'flangeSeatingWorld':2,'hangingDepthWorld':92,'ropePort':[32,19],'railBottom':600,'floor':700,'note':'Outer tread seats2world into the rail flange. Full silhouette retained; 100world gap leaves8world body clearance. Rope connects actual axle crossbar native32,19.'}},
 'far':{'source':'far-raw-v1.png','native':[768,640],'world':[1536,1280]},
 'middle':{'source':'middle-raw-v2.png','native':[768,640],'world':[1536,1280],'foundation':1260,'drawY':'-20+snap(camera.y*.025)','depthBrightness':.8,'note':'Baked counterweights removed with imagegen; runtime native loads animate in clear shafts.'}}
(p/'registration.json').write_text(json.dumps(r,indent=2)+'\n',encoding='utf8')
print(json.dumps(r['kit'],indent=2))
