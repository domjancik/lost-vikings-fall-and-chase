"""Normalize accepted generated nozzle once; rejected coupling is not packed."""
from pathlib import Path
import json,numpy as np
from PIL import Image
from scipy.ndimage import label,distance_transform_edt
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());OUT=ROOT/'assets/water87'
raw=Image.open(OUT/'extra-raw-v1.png').convert('RGBA');a=np.array(raw);ids,n=label(a[:,:,3]>=128)
mask=ids==1
# Reject chroma-matte residue only near the ORIGINAL exterior. Legitimate
# interior brass/copper/verdigris planes are never recolored or processed again.
r,g,b=[a[:,:,i].astype(float)for i in range(3)]
matte=((r>75)&(r>g*4)&(r>b*3))|((g>80)&(g>r*1.35)&(g>b*1.45))|((r>220)&(g>220)&(b<30))
fringe=mask&matte&(distance_transform_edt(mask)<10)
mask=mask&~fringe;a[:,:,3]=np.where(mask,255,0).astype(np.uint8)
a[~mask,:3]=0
scale=raw.width/192;cx=1276;bottom=766;tx=cx-48*scale;ty=bottom-92*scale
im=Image.fromarray(a).transform((96,96),Image.Transform.AFFINE,(scale,0,tx,0,scale,ty),Image.Resampling.NEAREST)
im.save(OUT/'nozzle-native.png');im.resize((576,576),Image.Resampling.NEAREST).save(OUT/'nozzle-native-6x.png')
(OUT/'nozzle-registration.json').write_text(json.dumps({'raw':'extra-raw-v1.png','originalBounds':[1012,122,1540,766],'rawPixelsPerNative':scale,'alphaThresholdOnce':128,'originalExteriorMattePixelsRejected':int(fringe.sum()),'originalAffine':[scale,0,tx,0,scale,ty],'nativeBounds':im.getbbox(),'inlet':[48,23],'mouth':[48,85],'streamMouthWidthWorld':56,'nativeCell':[96,96]},indent=2)+'\n')
print(im.getbbox())
