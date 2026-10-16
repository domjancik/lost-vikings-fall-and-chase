"""Separate retained native machinery; no resizing, interpolation or palette changes."""
from pathlib import Path
from PIL import Image
import json

out = Path('assets/sewer141')
out.mkdir(exist_ok=True)
source = Image.open('assets/sewer125/props-native.png').convert('RGBA')
records = {}
def segment_distance(x,y,a,b):
    dx,dy=b[0]-a[0],b[1]-a[1]
    t=max(0,min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)))
    return ((x-a[0]-t*dx)**2+(y-a[1]-t*dy)**2)**.5

def components(im, predicate):
    remaining={(x,y) for y in range(im.height) for x in range(im.width) if predicate(x,y,im.getpixel((x,y)))}
    while remaining:
        start=remaining.pop(); group={start}; queue=[start]
        while queue:
            x,y=queue.pop()
            for dx in [-1,0,1]:
                for dy in [-1,0,1]:
                    p=(x+dx,y+dy)
                    if p in remaining: remaining.remove(p);group.add(p);queue.append(p)
        yield group
for kind, box, pivot, radii in [
    ('valve', (0,64,64,128), (32,34), (18,18)),
    ('winch', (64,128,144,192), (22,30), (15,18)),
]:
    fixed = source.crop(box)
    rotor = Image.new('RGBA', fixed.size)
    cap = Image.new('RGBA', fixed.size)
    for y in range(fixed.height):
        for x in range(fixed.width):
            r,g,b,a = fixed.getpixel((x,y))
            if (x-pivot[0])**2+(y-pivot[1])**2<=36:
                cap.putpixel((x,y),(r,g,b,a))
            inside = ((x-pivot[0])/radii[0])**2 + ((y-pivot[1])/radii[1])**2 < 1
            gold = r > g*1.25 and g > b*1.35
            moving = inside and a and ((gold or (x-pivot[0])**2+(y-pivot[1])**2<36) if kind=='valve' else (not gold or (x-pivot[0])**2+(y-pivot[1])**2<36))
            if moving:
                # The winch's perspective rim is stationary. Only its hub and
                # authored straight spokes belong in the rotating layer.
                spoke=kind=='valve' or any(segment_distance(x,y,pivot,end)<=3 for end in [(26,16),(13,23),(13,38),(25,41),(35,30)])
                if spoke and (kind=='valve' or not gold or (x-22)**2+(y-30)**2<36):
                    rotor.putpixel((x,y),(r,g,b,a))
                fixed.putpixel((x,y),(0,0,0,0))
            # Atlas spill above the valve belongs to the previous cell.
            if kind=='valve' and y<8:
                fixed.putpixel((x,y),(0,0,0,0))
    # Isolated extraction flecks must not become stationary ghost spokes or
    # orbiting sparks. Keep genuine connected material and the fixed rim.
    for group in components(rotor,lambda x,y,p:p[3]>0):
        if len(group)<5:
            for xy in group:rotor.putpixel(xy,(0,0,0,0))
    if kind=='valve':
        for group in components(fixed,lambda x,y,p:p[3]>0 and p[0]>p[1]*1.25 and p[1]>p[2]*1.35):
            if len(group)<8:
                for xy in group:fixed.putpixel(xy,(0,0,0,0))
    fixed.save(out/(kind+'-fixed.png'))
    rotor.save(out/(kind+'-rotor.png'))
    cap.save(out/(kind+'-axle.png'))
    records[kind] = {'source':'assets/sewer125/props-native.png','crop':box,'nativeSize':fixed.size,'pivot':pivot,'worldPerPixel':2,'sourceSole':64,'moving':'spokes rotate underneath the stationary axle cap; rim, bearings, drum and base remain stationary'}
    preview=Image.new('RGBA',(fixed.width*3,fixed.height),(12,15,16,255))
    for i,im in enumerate([source.crop(box),fixed,rotor]): preview.alpha_composite(im,(i*fixed.width,0))
    preview.resize((preview.width*4,preview.height*4),Image.Resampling.NEAREST).save(out/(kind+'-separation.png'))
(out/'registration.json').write_text(json.dumps(records,indent=2)+'\n')
