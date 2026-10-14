"""Sample retained native-density sources once, register measured physical anchors."""
from PIL import Image
from scipy.ndimage import label,distance_transform_edt,binary_fill_holes
import numpy as np,json
from pathlib import Path
out=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())/'assets/level96';raw=Image.open(out/'parts-raw-v1.png').convert('RGBA');a=np.array(raw);scale=raw.width/480
assert abs(raw.height/288-scale)<.01
mask=a[:,:,3]>=128;r,g,b=[a[:,:,i].astype(float)for i in range(3)]
matte=((r>110)&(r>g*1.7)&(r>b*1.5))|((b>110)&(b>r*1.8)&(b>g*1.6))|((g>100)&(g>r*1.45)&(g>b*1.6))|((r>120)&(g>110)&(b<60)&(g>r*.85))
fringe=mask&matte&(distance_transform_edt(mask)<scale*.7);mask&=~fringe
source=a.copy();source[:,:,3]=np.where(mask,255,0);source[~mask,:3]=0
ids,count=label(mask)
sizes=np.bincount(ids.ravel());sizes[0]=0
sourceIds=ids.copy();sourceSizes=sizes.copy()
atlas=Image.new('RGBA',(480,288));records=[]
for n in range(15):
 x=n%5*96;y=n//5*96
 candidates=[]
 for component in np.flatnonzero(sourceSizes>500):
  ys,xs=np.nonzero(sourceIds==component);cx=(xs.min()+xs.max()+1)/2/scale;cy=(ys.min()+ys.max()+1)/2/scale
  if x<=cx<x+96 and y<=cy<y+96:candidates.append(component)
 assert candidates,(n,x,y)
 component=max(candidates,key=lambda i:sourceSizes[i]);ys,xs=np.nonzero(sourceIds==component)
 isolated=source.copy();isolated[sourceIds!=component]=0
 # Measure a translated diagnostic; final pixels are sampled from the original once.
 baseY=min(y,int(ys.min()/scale));original=Image.fromarray(isolated)
 cell=original.transform((96,96),Image.Transform.AFFINE,(scale,0,x*scale,0,scale,baseY*scale),Image.Resampling.NEAREST)
 data=np.array(cell);opaque=data[:,:,3]>=128
 # Keep the true source scale; register only the appropriate physical anchor.
 tx=ty=0;bounds=cell.getbbox();cx=(bounds[0]+bounds[2])/2;tx=round(48-cx)
 if n in [0,11,14]:ty=94-bounds[3]
 if n in [4,5]:
  counts=opaque.sum(axis=1);rim=int(np.flatnonzero(counts>=60)[0]);ty=40-rim
 if n==6:
  holes=binary_fill_holes(opaque)&~opaque;ids,count=label(holes);sizes=np.bincount(ids.ravel());sizes[0]=0;ys,xs=np.nonzero(ids==sizes.argmax());tx=round(48-(xs.min()+xs.max()+1)/2);ty=round(32-(ys.min()+ys.max()+1)/2)
 registered=original.transform((96,96),Image.Transform.AFFINE,(scale,0,(x-tx)*scale,0,scale,(baseY-ty)*scale),Image.Resampling.NEAREST)
 atlas.alpha_composite(registered,(x,y));p=np.array(registered);op=p[:,:,3]>0
 record={'n':n,'source':'parts-raw-v1.png','component':int(component),'uniformScale':scale,'translation':[tx,ty+y-baseY],'bounds':registered.getbbox()}
 if n in [4,5]:
  yy=40;xs=np.flatnonzero(op[yy]);record['deck']={'left':int(xs.min()),'right':int(xs.max()+1),'top':yy}
 if n==6:
  holes=binary_fill_holes(op)&~op;ids,count=label(holes);sizes=np.bincount(ids.ravel());sizes[0]=0;ys,xs=np.nonzero(ids==sizes.argmax());record['aperture']={'cx':float((xs.min()+xs.max()+1)/2),'cy':float((ys.min()+ys.max()+1)/2),'width':int(xs.max()-xs.min()+1),'height':int(ys.max()-ys.min()+1)}
 if n==12:
  rows=np.flatnonzero(op.sum(axis=1)>=35);record['head']={'top':int(rows.min()),'bottom':int(rows.max()+1),'left':int(np.flatnonzero(op[rows.max()]).min()),'right':int(np.flatnonzero(op[rows.max()]).max()+1)}
 records.append(record)
atlas.save(out/'parts-native.png');atlas.resize((1440,864),Image.Resampling.NEAREST).save(out/'parts-native-3x.png')
(out/'parts-registration.json').write_text(json.dumps({'source':'parts-raw-v1.png','native':[480,288],'pixelWorld':2,'fringePixelsRemoved':int(fringe.sum()),'records':records},indent=2))
for name,size,version in [('terrain',(96,96),1),('far',(960,640),2),('middle',(384,256),3)]:
 p=out/f'{name}-raw-v{version}.png'
 if not p.exists():continue
 im=Image.open(p);im=im.resize(size,Image.Resampling.NEAREST)
 if name=='middle':
  data=np.array(im);solid=data[:,:,3]>=128;data[:,:,3]=np.where(solid,255,0);data[~solid,:3]=0;im=Image.fromarray(data)
 im.save(out/f'{name}-native.png');im.resize((size[0]*2,size[1]*2),Image.Resampling.NEAREST).save(out/f'{name}-native-2x.png')
print(json.dumps([r for r in records if 'deck'in r or'aperture'in r or'head'in r]))
layout={'shuttle':records[4]['deck'],'lift':records[5]['deck'],'aperture':records[6]['aperture'],'head':records[12]['head']}
middleAlpha=np.array(Image.open(out/'middle-native.png'))[:,:,3]>=128
layout['middle']={'foundationBottom':int(np.flatnonzero(middleAlpha.sum(axis=1)>=384*.8)[-1]+1)}
if (out/'bobbin-raw-v2.png').exists():
 im=Image.open(out/'bobbin-raw-v2.png').convert('RGBA').resize((20,20),Image.Resampling.NEAREST);data=np.array(im);solid=data[:,:,3]>=128;data[:,:,3]=np.where(solid,255,0);data[~solid,:3]=0;im=Image.fromarray(data)
 assert im.getbbox()==(4,4,16,16),'Bobbin must fit guide and match physical24x24 body'
 im.save(out/'bobbin-native.png');im.resize((160,160),Image.Resampling.NEAREST).save(out/'bobbin-native-8x.png')
 layout['bobbin']={'cx':10,'cy':10,'halfWidth':12,'halfHeight':12,'native':[20,20],'bounds':[4,4,16,16]}
if (out/'cloth-raw-v2.png').exists():
 raw=Image.open(out/'cloth-raw-v2.png').convert('RGBA');scale=raw.height/80;offset=(raw.width-48*scale)/2
 proof=raw.transform((48,80),Image.Transform.AFFINE,(scale,0,offset,0,scale,0),Image.Resampling.NEAREST);bounds=proof.getbbox();shift=80-bounds[3]
 im=raw.transform((48,80),Image.Transform.AFFINE,(scale,0,offset,0,scale,-shift*scale),Image.Resampling.NEAREST);data=np.array(im);solid=data[:,:,3]>=128;data[:,:,3]=np.where(solid,255,0);data[~solid,:3]=0;im=Image.fromarray(data)
 im.save(out/'cloth-native.png');im.resize((192,320),Image.Resampling.NEAREST).save(out/'cloth-native-4x.png')
 layout['cloth']={'native':[48,80],'bounds':list(im.getbbox()),'world':[96,160]}
 (out/'cloth-registration.json').write_text(json.dumps({'source':'cloth-raw-v2.png','uniformScale':scale,'sourceCropX':offset,'translation':[0,shift],'native':[48,80],'bounds':list(im.getbbox()),'notes':'One original-source affine sample; transparent horizontal margins cropped, no aspect stretch or palette quantization.'},indent=2))
(out.parents[1]/'src/levels/loom/art-layout.js').write_text('export const LOOM_ART='+json.dumps(layout)+';\n')
