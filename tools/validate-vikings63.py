from pathlib import Path
import json,sys
import numpy as np
from PIL import Image
root=Path(sys.argv[1] if len(sys.argv)>1 else 'assets/vikings63');meta=json.loads((root/'registration.json').read_text())
for name in ['erik','baleog','olaf']:
 im=Image.open(root/(name+'.png'));assert im.size==(512,256)
 a=np.array(im);assert set(np.unique(a[:,:,3]))=={0,255}
 assert not a[a[:,:,3]==0,:3].any()
 for record in meta[name]['frames']:
  n=record['cell'];cell=a[n//8*64:(n//8+1)*64,n%8*64:(n%8+1)*64]
  y,x=np.where(cell[:,:,3]>0);assert len(x)
  assert x.min()>0 and x.max()<63 and y.min()>0 and y.max()<63,(name,n)
  if record['grounded']:assert y.max()==62,(name,n,'floating sole')
 for group in [range(8),range(24,30) if name=='erik' else range(24,28) if name=='baleog' else range(24,32)]:
  poses=[a[n//8*64:(n//8+1)*64,n%8*64:(n%8+1)*64].tobytes() for n in group]
  assert len(set(poses))==len(poses),(name,'duplicate animation frame')
shield=np.array(Image.open(root/'shield.png'));assert shield.shape==(24,14,4)
assert set(np.unique(shield[:,:,3]))=={0,255}
assert meta['shield']['worldSize']==[28,48]
print('96 nonempty, unclipped native poses; grounded soles62; unique run/ability frames; binary alpha; fixed shield.')

# Authored overhead palms must reach the underside of the unchanged shield.
# At origin40, shield bottom is y-22 (native29); palms begin no lower than25.
olaf=np.array(Image.open(root/'olaf.png'))
for n in range(28,32):
 cell=olaf[n//8*64:n//8*64+64,n%8*64:n%8*64+64]
 skin=(cell[:,:,0]>150)&(cell[:,:,1]>80)&(cell[:,:,1]<200)&(cell[:,:,2]<170)&(cell[:,:,3]>0)
 ys,xs=np.where(skin);assert len(ys) and ys.min()<=25,(n,'overhead hands miss shield',int(ys.min()))
print('Overhead palms reach the fixed shield underside in all four brace frames.')
