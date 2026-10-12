from PIL import Image
from pathlib import Path
import json
r=Path('assets/momentum68')
def alpha(im):
 im.putalpha(im.getchannel('A').point(lambda a:255 if a>=160 else 0));return im
def cells(name,factor):
 src=Image.open(r/name).convert('RGBA');out=[]
 for n in range(16):
  x=n%4*src.width//4;y=n//4*src.height//4
  im=alpha(src.crop((x,y,x+src.width//4,y+src.height//4)).resize((round(src.width/4/factor),round(src.height/4/factor)),Image.Resampling.NEAREST))
  # Uniform normalization; only register translation, never silhouette-fit scale.
  if name=='source-a.png' and n==8:
   for yy in range(46,im.height):
    for xx in range(im.width):im.putpixel((xx,yy),(0,0,0,0))
  out.append(im)
 return out
a=cells('source-a.png',4);b=cells('source-b.png',5)
print('A bounds',[(i,im.getbbox()) for i,im in enumerate(a)])
print('B bounds',[(i,im.getbbox()) for i,im in enumerate(b)])
def registered(im,anchor='center'):
 box=im.getbbox();out=Image.new('RGBA',(64,64))
 if not box:return out
 dx=32-round((box[0]+box[2])/2);dy=(64-box[3]) if anchor=='base' else 32-round((box[1]+box[3])/2)
 out.paste(im,(dx,dy));return out
out=Image.new('RGBA',(256,256))
for n,im in enumerate(a):out.paste(registered(im,'base' if n>=12 and n!=13 else 'center'),(n%4*64,n//4*64))
out.save(r/'relay.png')
arm=Image.new('RGBA',(96,64));arm.paste(a[13],(0,0));arm.save(r/'arm.png')
tiles=Image.new('RGBA',(160,32))
for n in range(4):
 im=a[8+n];box=im.getbbox();x0=16 if n<3 else 13
 strip=Image.new('RGBA',(40,32));strip.paste(im.crop((x0,20,x0+20,52)),(0,0));strip.paste(im.crop((x0+44,20,x0+64,52)),(20,0));tiles.paste(strip,(n*40,0))
tiles.save(r/'tiles.png')
out=Image.new('RGBA',(256,256))
for n,im in enumerate(b):
 if n<4:reg=im
 elif n<8:reg=Image.new('RGBA',(64,64));reg.paste(im,(0,2))
 elif n<12:reg=im
 else:reg=Image.new('RGBA',(64,64));reg.paste(im,(0,21))
 out.paste(reg,(n%4*64,n//4*64))
out.save(r/'hazards.png')
# Superseded clipped furnace cells must never accidentally ship in this atlas.
out=Image.open(r/'hazards.png');out.paste(Image.new('RGBA',(256,64)),(0,64));out.save(r/'hazards.png')
bumper=Image.new('RGBA',(320,64))
for n,dx in enumerate([0,-1,10,0]):
 reg=Image.new('RGBA',(80,64));reg.paste(b[12+n],(dx,21));bumper.paste(reg,(n*80,0))
bumper.save(r/'bumper.png')
src=Image.open(r/'source-furnace.png').convert('RGBA')
native=alpha(src.resize((round(src.width/8),round(src.height/8)),Image.Resampling.NEAREST))
furnace=Image.new('RGBA',(288,72))
def connected(im):
 points={(x,y) for y in range(im.height) for x in range(im.width) if im.getpixel((x,y))[3]};groups=[]
 while points:
  p=points.pop();group={p};todo=[p]
  while todo:
   x,y=todo.pop()
   for q in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]:
    if q in points:points.remove(q);group.add(q);todo.append(q)
  groups.append(group)
 keep=max(groups,key=len)
 for group in groups:
  if group is not keep:
   for p in group:im.putpixel(p,(0,0,0,0))
 return im
for n in range(4):
 cell=connected(native.crop((n*68-2,0,n*68+70,72)));fixed=Image.new('RGBA',(72,72));fixed.paste(cell,(0,1));furnace.paste(fixed,(n*72,0))
furnace.save(r/'furnace.png')
furnace.resize((1152,288),Image.Resampling.NEAREST).save(r/'furnace-native-review.png')
out=Image.open(r/'hazards.png')
for n in range(8,12):
 cell=connected(b[n]);top=cell.getbbox()[1];fixed=Image.new('RGBA',(64,64));fixed.paste(cell,(0,-top));out.paste(fixed,(n%4*64,128))
out.save(r/'hazards.png')
scene=Image.open(r/'source-scene.png').convert('RGB');scene.resize((768,512),Image.Resampling.NEAREST).save(r/'scene.png')
# Review sheet at deliberate target density, enlarged without interpolation.
comparison=Image.new('RGBA',(1024,768),(21,30,35,255))
for name,x in [('relay.png',0),('hazards.png',512)]:comparison.paste(Image.open(r/name).resize((512,512),Image.Resampling.NEAREST),(x,0))
comparison.paste(Image.open(r/'scene.png').resize((384,256),Image.Resampling.NEAREST),(320,512));comparison.save(r/'native-review.png')
(r/'registration.json').write_text(json.dumps({'nativeCell':64,'worldCell':128,'sourceAFactor':4,'sourceBFactor':5,'sceneNative':[768,512],'sceneWorld':[1536,1024],'sphereRadius':56,'springPivot':[32,13],'armPivot':[80,26],'laserLens':[36,31],'laserOutlet':[36,35],'bumperRestFace':[46,47],'fireballCore':[22,35],'furnaceCell':72,'furnaceWorld':144,'furnaceBase':72,'furnaceMouth':[18,45],'furnaceSourceFactor':8},indent=2))
