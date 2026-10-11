"""Register authored bodies without changing scale between animation frames."""
from pathlib import Path
import sys,json
import numpy as np
from PIL import Image
from scipy import ndimage
root=Path('assets/vikings63');metadata={}
def occupied(a):
 y,x=np.where(a[:,:,3]>=128)
 assert len(x),'empty authored pose'
 return int(x.min()),int(y.min()),int(x.max()),int(y.max())
for name,height in [('erik',36),('baleog',38),('olaf',36)]:
 if not (root/(name+'-source.png')).exists():continue
 im=Image.open(root/(name+'-source.png')).convert('RGBA')
 source=[]
 for n in range(32):
  x0=round(n%8*im.width/8);x1=round((n%8+1)*im.width/8)
  y0=round(n//8*im.height/4);y1=round((n//8+1)*im.height/4)
  a=np.array(im.crop((x0,y0,x1,y1)))
  # A neighboring weapon can stray across an imagegen cell edge. Keep only
  # the connected authored figure; never retain unrelated floating fragments.
  labels,count=ndimage.label(a[:,:,3]>=128,structure=np.ones((3,3)))
  sizes=np.bincount(labels.ravel());sizes[0]=0;keep=labels==int(sizes.argmax())
  a[~keep]=0;source.append(a)
 bounds=[occupied(a) for a in source]
 scale=height/float(np.median([bounds[n][3]-bounds[n][1]+1 for n in range(8,12)]))
 # Sole-center reference, not equipment/alpha-box center; constant for all cells.
 soles=[]
 for n in range(8,12):
  a=source[n];b=bounds[n];y,x=np.where((a[:,:,3]>=128)&(np.indices(a.shape[:2])[0]>=b[3]-12))
  soles.append(float(np.mean(x)))
 sole_x=float(np.median(soles));sole_y=float(np.median([bounds[n][3] for n in range(8,12)]))
 atlas=Image.new('RGBA',(512,256));records=[]
 for n,a in enumerate(source):
  w,h=round(a.shape[1]*scale),round(a.shape[0]*scale)
  packed=np.array(Image.fromarray(a).resize((w,h),Image.Resampling.NEAREST));packed[:,:,3]=np.where(packed[:,:,3]>=128,255,0);packed[packed[:,:,3]==0,:3]=0
  p=Image.fromarray(packed);x=32-round(sole_x*scale);y=62-round(sole_y*scale)
  # Correct generated registration jitter by translating grounded poses only.
  # Never refit/rescale the body; airborne and climbing limb motion is retained.
  grounded=n<12 or n>=16
  if grounded:y=62-occupied(packed)[3]
  else:y=min(y,62-occupied(packed)[3])
  canvas=Image.new('RGBA',(64,64));canvas.paste(p,(x,y));out=np.array(canvas)
  b=occupied(out);assert b[0]>0 and b[2]<63 and b[1]>0 and b[3]<63,(name,n,b)
  if grounded:assert b[3]==62,(name,n,'sole',b)
  atlas.paste(canvas,(n%8*64,n//8*64));records.append({'cell':n,'bounds':b,'offset':[x,y],'grounded':grounded})
 atlas.save(root/(name+'.png'))
 assert len({np.array(atlas.crop((n*64,0,n*64+64,64))).tobytes() for n in range(8)})==8
 metadata[name]={'sourceSize':im.size,'scale':scale,'nativeStandingHeight':height,'soleCenterSource':[sole_x,sole_y],'frames':records}
if (root/'shield-source.png').exists():
 shield=Image.open(root/'shield-source.png').convert('RGBA');a=np.array(shield);b=occupied(a)
 a=np.array(shield.crop((b[0],b[1],b[2]+1,b[3]+1)))
 a=np.array(Image.fromarray(a).resize((14,24),Image.Resampling.NEAREST));a[:,:,3]=np.where(a[:,:,3]>=128,255,0);a[a[:,:,3]==0,:3]=0
 Image.fromarray(a).save(root/'shield.png')
 metadata['shield']={'nativeSize':[14,24],'worldSize':[28,48]}
(root/'registration.json').write_text(json.dumps(metadata,indent=2)+'\n')
print('Native-density bodies packed; uniform per-character scales, sole registration62, binary alpha.')

