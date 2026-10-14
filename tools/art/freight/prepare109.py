"""Normalize ONLY reviewer-accepted native-density sources once.

Rejected v1 and rejected v2 machine cells remain untouched and never ship.
No grid detector, palette quantizer, material painting, or frame stretching.
"""
from pathlib import Path
from PIL import Image,ImageFilter
import numpy as np
import json

out=Path('assets/freight109')
def normalize(name,size,matte=False):
    source=Image.open(out/(name+'-raw-v2.png')).convert('RGBA')
    image=source.resize(size,Image.Resampling.NEAREST)
    a=np.array(image)
    if matte:
        key=(a[:,:,0]>12)&(a[:,:,2]>16)&(a[:,:,0]>a[:,:,1].astype(float)*1.4)&(a[:,:,2]>a[:,:,1].astype(float)*1.4)
        a[key]=0
        # Some provider edge blends are violet rather than saturated magenta.
        # Remove only violet pixels touching the already-exterior matte, not
        # legitimate dark interior colors. No material RGB is changed.
        outside=Image.fromarray(np.uint8(a[:,:,3]==0)*255)
        edge=np.array(outside.filter(ImageFilter.MaxFilter(5)))>0
        violet=(a[:,:,0]>=a[:,:,1])&(a[:,:,2]>a[:,:,0].astype(float)*1.25)&(a[:,:,2]>24)
        a[edge&violet]=0
    else:
        a[a[:,:,3]<200]=0
    a[a[:,:,3]>=200,3]=255
    return Image.fromarray(a)

machines=normalize('machines',(256,256))
accepted=[3,4,5,6,7,12,13,14]
atlas=Image.new('RGBA',machines.size)
for n in accepted:
    x,y=n%4*64,n//4*64
    atlas.paste(machines.crop((x,y,x+64,y+64)),(x,y))
atlas.save(out/'machines-native.png')
inspector=normalize('inspector',(192,128));inspector.save(out/'inspector-native.png')
cart=normalize('cart',(192,128),True);cart.save(out/'cart-native.png')
far=normalize('far',(768,512));far.save(out/'far-native.png')
# A human-scale full depot wall, NOT the rejected384x256 small-gallery placement.
middle=normalize('middle',(768,512),True);middle.save(out/'middle-native.png')
for name,image in [('machines',atlas),('inspector',inspector),('cart',cart)]:
    image.resize((image.width*2,image.height*2),Image.Resampling.NEAREST).save(out/(name+'-native-2x.png'))

def bounds(image):
    alpha=np.array(image)[:,:,3]>=200
    ys,xs=np.where(alpha)
    return [int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]

machine_bounds={str(n):bounds(atlas.crop((n%4*64,n//4*64,n%4*64+64,n//4*64+64))) for n in accepted}
feet=[]
for n in range(8):
    cell=inspector.crop((n%4*48,n//4*64,n%4*48+48,n//4*64+64))
    feet.append(bounds(cell)[3])
a=np.array(cart)[:,:,3]>=200
deck=next(y for y in range(40,80) if np.count_nonzero(a[y])>100)
xs=np.flatnonzero(a[deck]);left,right=int(xs[0]),int(xs[-1]+1)
sole=int(np.flatnonzero(np.count_nonzero(a,axis=1)>4)[-1]+1)
# The receiver's authored copper body is the item and icon. No invented substitute.
atlas.crop((28,64+34,36,64+46)).save(out/'cell-native.png')
registration={'worldPixel':2,'acceptedMachineCells':accepted,'machineBounds':machine_bounds,
 'inspector':{'nativeSize':[192,128],'cell':[48,64],'soleExclusive':feet,'pivotX':24},
 'cart':{'nativeSize':[192,128],'deck':[left,deck,right-left],'wheelSoleExclusive':sole,
 'wheelCenters':[[47,85],[145,85]],'wheelRadius':10,'hub':[96,72]},
 'normalization':'single nearest presentation normalization from accepted native-density source; alpha200 or magenta exterior key with adjacency-constrained violet fringe cleanup; no material RGB changed; no resampled rejected cells'}
registration['backgrounds']={'far':{'native':[768,512],'world':[1536,1024],'factorX':.82,'factorY':.62},
 'middle':{'native':[768,512],'world':[1536,1024],'factorX':.35,'factorY':.04,'foundationTop':374,'foundationBottom':512,'serviceDoorHeight':68,
 'role':'human-scale complete depot wall; lowerfoundation buried behind recovery floor; no individual furniture enlargement'}}
(out/'registration.json').write_text(json.dumps(registration,indent=2))
print(json.dumps(registration,indent=2))
