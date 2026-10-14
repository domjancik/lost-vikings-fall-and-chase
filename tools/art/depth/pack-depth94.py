"""Once-only uniform source sampling and translation registration; no repainting."""
from pathlib import Path
from PIL import Image
from scipy.ndimage import label,distance_transform_edt
import numpy as np,json,sys
root=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());out=root/'assets/depth94'
for name,version in [('a',1),('b',2)]:
 rawpath=out/f'{name}-raw-v{version}.png'
 if not rawpath.exists():continue
 raw=Image.open(rawpath).convert('RGBA');a=np.array(raw);ids,n=label(a[:,:,3]>=128);sizes=np.bincount(ids.ravel());scale=raw.width/256
 atlas=Image.new('RGBA',(256,192));records=[]
 for row in range(3):
  for col in range(4):
   candidates=[]
   for comp in np.flatnonzero(sizes>5000):
    if comp==0:continue
    ys,xs=np.nonzero(ids==comp);cx=(xs.min()+xs.max()+1)/2;cy=(ys.min()+ys.max()+1)/2
    if int(cx/(64*scale))==col and int(cy/(64*scale))==row:candidates.append((int(sizes[comp]),comp))
   if not candidates:raise ValueError(f'Missing source object {name}/{row}/{col}')
   comp=max(candidates)[1];mask=ids==comp
   r,g,b=[a[:,:,i].astype(float)for i in range(3)]
   matte=((g>80)&(g>r*1.35)&(g>b*1.45))|((g>110)&(b>110)&(r<80)&(g>r*1.65))|((b>110)&(b>r*1.6)&(b>g*1.5))|((r>160)&(r>g*2.2)&(r>b*2.2))|((r>160)&(g>150)&(b<70))
   fringe=mask&matte&(distance_transform_edt(mask)<scale*.5);mask&=~fringe
   ys,xs=np.nonzero(mask);box=[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]
   if (box[2]-box[0])/scale>64.5:raise ValueError(f'Cell overflow {name}/{row}/{col}')
   cx=(box[0]+box[2])/2;tx=cx-32*scale;ty=box[3]-62*scale
   source=a.copy();source[:,:,3]=np.where(mask,255,0);source[~mask,:3]=0
   im=Image.fromarray(source).transform((64,64),Image.Transform.AFFINE,(scale,0,tx,0,scale,ty),Image.Resampling.NEAREST)
   atlas.alpha_composite(im,(col*64,row*64));records.append({'row':row,'column':col,'raw':rawpath.name,'sourceBounds':box,'sourceComponent':int(comp),'nativeBounds':im.getbbox(),'uniformSourcePixelsPerNative':scale,'transform':[scale,0,tx,0,scale,ty],'originalExteriorMattePixelsRemoved':int(fringe.sum()),'baselineExclusive':62})
 atlas.save(out/(name+'-native.png'));atlas.resize((1024,768),Image.Resampling.NEAREST).save(out/(name+'-native-4x.png'))
 (out/(name+'-registration.json')).write_text(json.dumps({'raw':rawpath.name,'nativeSize':[256,192],'cell':[64,64],'pixelWorld':2,'records':records},indent=2)+'\n')
 print(name,[(r['row'],r['column'],r['nativeBounds'])for r in records])
