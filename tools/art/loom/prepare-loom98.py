from pathlib import Path
from PIL import Image
import numpy as np,json
from scipy.ndimage import binary_fill_holes,label,binary_erosion
folder=Path('assets/loom98')
im=Image.open(folder/'guide-raw-v1.png').convert('RGBA').resize((96,96),Image.Resampling.NEAREST)
a=np.array(im);rgb=a[:,:,:3].astype(float)
bad=((rgb[:,:,1]>rgb[:,:,0]*1.7)&(rgb[:,:,1]>rgb[:,:,2]*1.8))|((rgb[:,:,0]>rgb[:,:,1]*2.5)&(rgb[:,:,0]>rgb[:,:,2]*2.5))
a[(a[:,:,3]<200)|bad]=0;a[a[:,:,3]>=200,3]=255
opaque=a[:,:,3]>0;holes=binary_fill_holes(opaque)&~opaque;ids,count=label(holes);sizes=np.bincount(ids.ravel());sizes[0]=0
hole=ids==sizes.argmax();ys,xs=np.nonzero(hole);cx=(xs.min()+xs.max())/2;cy=(ys.min()+ys.max())/2
dx,dy=round(48-cx),round(32-cy)
registered=Image.new('RGBA',(96,96));registered.alpha_composite(Image.fromarray(a),(dx,dy));registered.save(folder/'guide-native.png');registered.resize((768,768),Image.Resampling.NEAREST).save(folder/'guide-native-8x.png')
mask=np.array(registered)[:,:,3]>0;holes=binary_fill_holes(mask)&~mask
# Full opaque bobbin envelope is12x12native. Conservative13square erosion.
safe=binary_erosion(holes,structure=np.ones((13,13),bool));ys=np.flatnonzero(safe[:,48]);assert len(ys)>12,ys
tolerance=min(32-ys.min(),ys.max()-32)*2
meta=dict(native=[96,96],worldPixel=2,source='guide-raw-v1.png',normalization='uniform nearest sampling once, conservative alpha matte threshold, translation only',translation=[dx,dy],center=[48,32],safeCenterY=[int(ys.min()),int(ys.max())],threadTolerance=int(tolerance),base=int(np.flatnonzero(mask.sum(axis=1)>25)[-1])+1)
(folder/'registration.json').write_text(json.dumps(meta,indent=2));Path('src/levels/loom/guide.js').write_text('export const LOOM_GUIDE='+json.dumps(meta)+';\n')
print(json.dumps(meta))
