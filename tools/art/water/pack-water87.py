"""One original-scale registration of independently accepted generated source.

No per-object fitting or painted-source rescue. Raw v2 material gate passed;
this output still needs separate native/runtime inspection.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy.ndimage import label,find_objects

ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());OUT=ROOT/'assets/water87'
SOURCE=OUT/'machines-raw-v2.png'
SCALE=4.25;CELL=96;BASELINE=92
# Main connected original-source shapes, measured before any normalization.
# Chain consists of the two authored separated halves.
IDS=[(3,),(1,),(2,),(4,),(7,),(5,),(6,),(8,),(13,),(12,),(9,),(10,11)]
NAMES=['pontoon','mobile-bell','fixed-bell','crank-housing','crank-wheel','threaded-rod','valve-housing','valve-wheel','sluice-rim','sluice-cover','service-gate','retaining-chain']

raw=Image.open(SOURCE).convert('RGBA');arr=np.array(raw);components,n=label(arr[:,:,3]>=128);slices=find_objects(components)
atlas=Image.new('RGBA',(CELL*4,CELL*3));records=[]
for i,ids in enumerate(IDS):
 mask=np.isin(components,ids);ys,xs=np.nonzero(mask);box=(int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1))
 source=arr.copy();source[:,:,3]=np.where(mask,255,0).astype(np.uint8)
 source[~mask,:3]=0
 cx=(box[0]+box[2])/2;bottom=box[3]
 # Whole original source is sampled exactly once at the shared uniform scale.
 # Only source translation varies; alpha boxes do not determine scale.
 tx=cx-48*SCALE;ty=bottom-BASELINE*SCALE
 cell=Image.fromarray(source).transform((CELL,CELL),Image.Transform.AFFINE,(SCALE,0,tx,0,SCALE,ty),Image.Resampling.NEAREST)
 atlas.alpha_composite(cell,(i%4*CELL,i//4*CELL));cell.save(OUT/(NAMES[i]+'-native.png'))
 record={'cell':i,'name':NAMES[i],'originalComponents':ids,'originalBounds':box,'originalPixelsPerNativePixel':SCALE,'sourceTransform':[SCALE,0,tx,0,SCALE,ty],'nativeBounds':cell.getbbox(),'floorBaselineExclusive':BASELINE,'nativeCell':[CELL,CELL],'worldSize':[192,192]}
 records.append(record)
atlas.save(OUT/'machines-native-v2.png');atlas.resize((CELL*16,CELL*12),Image.Resampling.NEAREST).save(OUT/'machines-native-v2-4x.png')
(OUT/'registration-v2.json').write_text(json.dumps({'original':SOURCE.name,'alphaThresholdOnce':128,'scaleUniform':SCALE,'cell':[96,96],'baselineExclusive':BASELINE,'records':records},indent=2)+'\n')
print([(r['name'],r['nativeBounds'])for r in records])
