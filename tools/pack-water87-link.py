"""Register accepted generated tiny link; no per-object fitting."""
from pathlib import Path
import json,numpy as np
from PIL import Image
from scipy.ndimage import label,distance_transform_edt
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/water87'
raw=Image.open(OUT/'link-raw-v2.png').convert('RGBA');a=np.array(raw);ids,n=label(a[:,:,3]>=128)
sizes=np.bincount(ids.ravel());sizes[0]=0;mask=ids==sizes.argmax()
r,g,b=[a[:,:,i].astype(float)for i in range(3)]
matte=((r>75)&(r>g*4)&(r>b*3))|((g>80)&(g>r*1.35)&(g>b*1.45))|((r>220)&(g>220)&(b<30))
mask&=~(matte&(distance_transform_edt(mask)<10));a[:,:,3]=np.where(mask,255,0).astype(np.uint8);a[~mask,:3]=0
scale=raw.width/128;cx=627;cy=631;tx=cx-48*scale;ty=cy-48*scale
im=Image.fromarray(a).transform((96,96),Image.Transform.AFFINE,(scale,0,tx,0,scale,ty),Image.Resampling.NEAREST)
im.save(OUT/'link-native.png');im.resize((768,768),Image.Resampling.NEAREST).save(OUT/'link-native-8x.png')
(OUT/'link-registration.json').write_text(json.dumps({'original':'link-raw-v2.png','originalLogicalCanvas':[128,128],'rawPixelsPerNative':scale,'alphaThresholdOnce':128,'affine':[scale,0,tx,0,scale,ty],'nativeBounds':im.getbbox(),'nativePivot':[48,48],'chainPlacementPivot':[48,33],'nativeCell':[96,96]},indent=2)+'\n')
print(im.getbbox())
