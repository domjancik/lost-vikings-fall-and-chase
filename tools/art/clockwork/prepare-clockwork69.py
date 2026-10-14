from PIL import Image
from pathlib import Path
import json
r=Path('assets/clockwork69')
def sheet(source,cell,out,cell_h=None):
    src=Image.open(r/source).convert('RGBA');h=round(src.height*cell*4/src.width)
    im=src.resize((cell*4,h),Image.Resampling.NEAREST)
    if cell_h:
        packed=Image.new('RGBA',(cell*4,cell_h*2))
        for row in range(2):packed.paste(im.crop((0,row*h//2,cell*4,(row+1)*h//2)),(0,row*cell_h))
        im=packed
    im.putalpha(im.getchannel('A').point(lambda a:255 if a>=160 else 0))
    im.save(r/out)
    ch=cell_h or cell;print(out,im.size,[im.crop((i%4*cell,i//4*ch,i%4*cell+cell,i//4*ch+ch)).getbbox() for i in range(8)])
    return im
p=sheet('source-parts.png',96,'parts.png')
m=sheet('source-machine.png',96,'machine.png',104)
for y in range(90,104):
    for x in range(288,384):m.putpixel((x,y),(0,0,0,0))
m.save(r/'machine.png')
for n,dy in [(0,-4),(1,-6),(2,-4),(4,13),(5,13),(6,13),(7,13)]:
    x=n%4*96;y=n//4*96;cell=p.crop((x,y,x+96,y+96));p.paste((0,0,0,0),(x,y,x+96,y+96));p.paste(cell,(x,y+dy))
p.save(r/'parts.png')
d=Image.open(r/'source-dock.png').convert('RGBA').resize((640,320),Image.Resampling.NEAREST)
d.putalpha(d.getchannel('A').point(lambda a:255 if a>=160 else 0));d=d.crop((0,48,640,272));d.save(r/'dock.png')
print('dock bounds',[d.crop((i*160,0,(i+1)*160,224)).getbbox() for i in range(4)])
src=Image.open(r/'source-pin.png').convert('RGBA');native=src.resize((128,round(src.height*128/src.width)),Image.Resampling.NEAREST);native.putalpha(native.getchannel('A').point(lambda a:255 if a>=160 else 0))
pin=Image.new('RGBA',(128,56))
for n in range(4):
    cell=native.crop((n*32,0,n*32+32,native.height));box=cell.getbbox();pin.paste(cell,(n*32,56-box[3]))
pin.save(r/'pin.png')
src=Image.open(r/'source-catch.png').convert('RGBA');native=src.resize((192,round(src.height*192/src.width)),Image.Resampling.NEAREST);native.putalpha(native.getchannel('A').point(lambda a:255 if a>=160 else 0))
catch=Image.new('RGBA',(192,80))
for n in range(4):
    cell=native.crop((n*48,0,n*48+48,native.height));box=cell.getbbox();catch.paste(cell,(n*48,80-box[3]))
catch.save(r/'catch.png')
for n in range(3):
    c=catch.crop((n*48,0,n*48+48,80));rows=[y for y in range(65) if sum(c.getpixel((x,y))[3]>0 and c.getpixel((x,y))[0]>100 and c.getpixel((x,y))[1]>70 for x in range(25,35))>=6];print('catch ledge',n,rows[:4])
Image.open(r/'source-scene.png').resize((768,512),Image.Resampling.NEAREST).save(r/'scene.png')
review=Image.new('RGBA',(768,384),(28,36,42,255));review.alpha_composite(p.resize((768,384),Image.Resampling.NEAREST));review.save(r/'parts-review.png')
review=Image.new('RGBA',(768,416),(28,36,42,255));review.alpha_composite(m.resize((768,416),Image.Resampling.NEAREST));review.save(r/'machine-review.png')
(r/'registration.json').write_text(json.dumps({'worldPixel':2,'partsCell':[96,96],'wheelCenter':[48,48],'wheelRadius':80,'upperBottom':53,'lowerInsideFoot':76,'springBase':96,'springCompressedRim':54,'dockCell':[160,224],'dockMouth':[80,112],'dockBase':193,'pinCell':[32,56],'pinBase':56,'catchCell':[48,80],'catchBase':80,'catchHookRow':16,'catchStroke':25,'catchComponentFrame':2,'catchReleasedHeadFrame':3,'sources':['source-parts.png','source-machine.png','source-dock.png','source-pin.png','source-catch.png','source-scene.png'],'scene':[768,512]},indent=2)+'\n')
