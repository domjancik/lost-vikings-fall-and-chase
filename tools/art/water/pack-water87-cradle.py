"""Assemble accepted generated frame modules on their native grid.

Original128logical basis once; translate/repeat generated shaft bands only.
No per-part scaling, stretched painting or procedural material replacement.
"""
from pathlib import Path
import json,numpy as np
from PIL import Image
from scipy.ndimage import label,distance_transform_edt
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());OUT=ROOT/'assets/water87'
raw=Image.open(OUT/'cradle-raw-v1.png').convert('RGBA');a=np.array(raw);ids,n=label(a[:,:,3]>=128)
sizes=np.bincount(ids.ravel());sizes[0]=0;mask=ids==sizes.argmax()
r,g,b=[a[:,:,i].astype(float)for i in range(3)]
matte=((r>75)&(r>g*4)&(r>b*3))|((g>80)&(g>r*1.35)&(g>b*1.45))|((r>220)&(g>220)&(b<30))
mask&=~(matte&(distance_transform_edt(mask)<10));a[:,:,3]=np.where(mask,255,0).astype(np.uint8);a[~mask,:3]=0
ys,xs=np.nonzero(mask);bounds=[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]
scale=raw.width/128;cx=raw.width/2;bottom=bounds[3];tx=cx-64*scale;ty=bottom-112*scale
base=Image.fromarray(a).transform((128,128),Image.Transform.AFFINE,(scale,0,tx,0,scale,ty),Image.Resampling.NEAREST)
base.save(OUT/'cradle-original-native.png')
# The generated upper assembly remains intact, shifted14native pixels upward.
# The leg extension is an authored copy of its own straight generated shaft.
delta=14;split=58;im=Image.new('RGBA',(128,128))
im.alpha_composite(base.crop((0,0,128,split)),(0,-delta))
im.alpha_composite(base.crop((0,split,128,split+delta)),(0,split-delta))
im.alpha_composite(base.crop((0,split,128,128)),(0,split))
# A generated metal shaft collar seats the repeated module's lower seam.
im.alpha_composite(base.crop((0,72,128,76)),(0,56))
im.save(OUT/'cradle-native.png');im.resize((768,768),Image.Resampling.NEAREST).save(OUT/'cradle-native-6x.png')
alpha=np.array(im)[:,:,3];beamTop=int(np.flatnonzero(alpha[:,64])[0]);floor=112
(OUT/'cradle-registration.json').write_text(json.dumps({'original':'cradle-raw-v1.png','originalLogicalCanvas':[128,128],'rawPixelsPerNative':scale,'originalAlphaBounds':bounds,'nativeOriginalAffine':[scale,0,tx,0,scale,ty],'nativeCell':[128,128],'baselineExclusive':floor,'beamSeatY':beamTop,'beamDepthNative':12,'legsExtendedNative':delta,'modules':[{'source':[0,0,128,58],'dest':[0,-14]},{'source':[0,58,128,72],'dest':[0,44]},{'source':[0,58,128,128],'dest':[0,58]},{'source':[0,72,128,76],'dest':[0,56]}],'nativeBounds':im.getbbox()},indent=2)+'\n')
print({'bounds':im.getbbox(),'beamTop':beamTop,'floor':floor})
