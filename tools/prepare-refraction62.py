from pathlib import Path
from PIL import Image
import json, math

root=Path('assets/refraction62')
def binary(im):
    im.putalpha(im.getchannel('A').point(lambda v:255 if v>=160 else 0))
    return im
def connected_sprite(im):
    # Generation drifts a neighboring row into cell margins. Keep the connected
    # physical object, excluding detached extraction fringes, never color details.
    points={(x,y) for y in range(im.height) for x in range(im.width) if im.getpixel((x,y))[3]}
    groups=[]
    while points:
        start=points.pop();group={start};pending=[start]
        while pending:
            x,y=pending.pop()
            for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
                p=(x+dx,y+dy)
                if p in points:points.remove(p);group.add(p);pending.append(p)
        groups.append(group)
    keep=max(groups,key=len)
    for group in groups:
        if group is not keep:
            for p in group:im.putpixel(p,(0,0,0,0))
    return im
def bottom(im):
    return max(y for y in range(im.height) if sum(im.getpixel((x,y))[3]>0 for x in range(im.width))>=6)+1
def translated(im,x=0,y=0):
    out=Image.new('RGBA',im.size);out.paste(im,(x,y));return out

src=Image.open(root/'machines-coarse-source.png').convert('RGBA')
out=Image.new('RGBA',(256,192));bases=[]
for n in range(12):
    x=n%4;y=n//4
    a=connected_sprite(binary(src.crop((x*src.width//4,y*src.height//3,(x+1)*src.width//4,(y+1)*src.height//3)).resize((64,64),Image.Resampling.NEAREST)))
    shift=64-bottom(a);a=translated(a,y=shift);out.paste(a,(x*64,y*64));bases.append(shift)
out.save(root/'machines.png')

src=Image.open(root/'parts-source.png').convert('RGBA')
parts=[]
for n in range(4):
    # Uniform square crop around the authored row; no silhouette-fit scaling.
    x=n*src.width//4;w=src.width//4
    a=binary(src.crop((x,150,x+w,150+w)).resize((64,64),Image.Resampling.NEAREST))
    parts.append(a)
base=parts[1];base=translated(base,y=64-bottom(base));base.save(root/'base.png')
bronze=[(x,y) for y in range(44) for x in range(64) if (lambda p:p[3]>0 and p[0]>p[1]*1.12 and p[0]>p[2]*1.3 and p[0]>100)(base.getpixel((x,y)))]
hub=[round(sum(p[i] for p in bronze)/len(bronze)) for i in range(2)]
# Reflective edge center is the optical pivot; remove the unused duplicate hub.
plate=parts[0];cyan=[(x,y) for y in range(64) for x in range(64) if (lambda p:p[3]>0 and p[1]>120 and p[2]>120 and p[0]<p[1]*.85)(plate.getpixel((x,y)))]
edge=[round(sum(p[i] for p in cyan)/len(cyan)) for i in range(2)]
for y in range(64):
    for x in range(64):
        if y>edge[1]+5:plate.putpixel((x,y),(0,0,0,0))
plate=translated(plate,32-edge[0],32-edge[1]);plate.save(root/'reflector.png')
emitter=translated(parts[2],y=64-bottom(parts[2]));emitter.save(root/'emitter.png')
lift=parts[3];lift.save(root/'lift.png')
# Walking plane: first full-width bright silver front rim, not the rear railing.
rim=max(range(20,40),key=lambda y:sum((lambda p:p[3]>0 and min(p[:3])>145)(lift.getpixel((x,y))) for x in range(64)))
scene=Image.open(root/'scene-source.png').convert('RGB');h=round(scene.height*1400/scene.width)
scene.resize((1400,h),Image.Resampling.NEAREST).save(root/'scene.png')
layout={'basePivot':hub,'emitterLens':[54,37], 'liftRim':rim,'sceneSize':[1400,h],'sceneFloor':round(614*h/scene.height),'cellSize':64,'worldSize':128,'machineBaseShifts':bases}
(root/'registration.json').write_text(json.dumps(layout,indent=2))
Path('refraction-art-layout.js').write_text('export const refractionArt='+json.dumps(layout)+';\n')
print(json.dumps(layout))
