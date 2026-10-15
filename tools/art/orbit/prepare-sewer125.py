from pathlib import Path
from PIL import Image
import json
p=Path('assets/sewer125')
def clean(im):
 im=im.convert('RGBA');a=im.load()
 for y in range(im.height):
  for x in range(im.width):
   r,g,b,v=a[x,y];a[x,y]=(r,g,b,255) if v>=240 else (0,0,0,0)
 return im
r={'method':'Accepted originals each uniformly normalized once; binaryalpha>=240, zero hiddenRGB. Whole machinery atlas retains common scale; feet registered by translation, no per-frame scale.'}
for name,size in [('environment',(256,256)),('props',(256,256)),('items',(96,32))]:
 raw=Image.open(p/(name+'-raw-v2.png'));im=clean(raw.resize(size,Image.Resampling.NEAREST));r[name]={'source':name+'-raw-v2.png','original':raw.size,'native':size}
 if name=='props':
  # Preserve machinery which extends beyond an authored64-square source cell.
  # Crop before neighboring-frame cleanup; retain scale and complete material.
  grounded=Image.new('RGBA',(192,72));parts=[]
  for index,(kind,n,width,pad) in enumerate([('winch',9,80,8),('oilSupply',11,64,16)]):
   sx=n%4*64;sy=n//4*64;part=im.crop((sx,sy,sx+width,sy+(64 if kind=='winch' else 72)));box=part.getbbox()
   if kind=='winch':
    # The authored inner wheel is a separate rotating layer. Remove it from
    # the stationary housing so old spokes cannot show through its openings.
    for yy in range(part.height):
     for xx in range(part.width):
      if (xx-24)**2+(yy-30)**2<=21**2:part.putpixel((xx,yy),(0,0,0,0))
   grounded.alpha_composite(part,(index*96+pad,0));parts.append({'kind':kind,'cell':index,'sourceBox':box,'padX':pad,'sole':box[3]})
  grounded.save(p/'grounded-native.png');grounded.resize((576,216),Image.Resampling.NEAREST).save(p/'grounded-native-3x.png');r[name]['grounded']={'native':[192,72],'cell':[96,72],'frames':parts}
  # Translate complete enemy feet to the common exclusive sole60. Largest body
  # shares the one uniform atlas scale; raised warning claw changes no body root.
  frames=[]
  for n in range(12,16):
   x=n%4*64;y=n//4*64;cell=im.crop((x,y,x+64,y+64));# Exclude neighboring row's detached foot strips above actual creature.
   if n in [12,15]:
    for yy in range(5):
     for xx in range(64):cell.putpixel((xx,yy),(0,0,0,0))
   box=cell.getbbox();dy=60-box[3];tmp=Image.new('RGBA',(64,64));tmp.alpha_composite(cell,(0,dy));im.paste(tmp,(x,y));frames.append({'cell':n,'sourceBox':box,'dy':dy,'box':tmp.getbbox(),'sole':60})
  r[name]['lurkerFrames']=frames
 if name=='items':
  icons=Image.new('RGBA',(48,16));boxes=[]
  for n in range(3):
   # Independent HUD rendering directly from retained original source once.
   crop=raw.crop((round(n*raw.width/3),0,round((n+1)*raw.width/3),raw.height));mask=crop.convert('RGBA').getchannel('A').point(lambda v:255 if v>=240 else 0);box=mask.getbbox();part=crop.crop(box);scale=min(12/part.width,12/part.height);s=(max(1,round(part.width*scale)),max(1,round(part.height*scale)));icon=clean(part.resize(s,Image.Resampling.NEAREST));icons.alpha_composite(icon,(n*16+(16-s[0])//2,14-s[1]));boxes.append(im.crop((n*32,0,n*32+32,32)).getbbox())
  icons.save(p/'icons-native.png');r[name]['boxes']=boxes
 im.save(p/(name+'-native.png'));im.resize((im.width*3,im.height*3),Image.Resampling.NEAREST).save(p/(name+'-native-3x.png'))
(p/'registration.json').write_text(json.dumps(r,indent=2)+'\n',encoding='utf8');print(json.dumps(r,indent=2))
