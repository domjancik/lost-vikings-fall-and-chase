"""Normalize retained generated whole actors once; no nominal-cell clipping or fits."""
from pathlib import Path
import json,argparse,numpy as np
from PIL import Image
from scipy.ndimage import label,distance_transform_edt
root=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());folder=root/'assets/vikings88'
def steel_anchor(image,mask,bounds,guide_frame=None):
 a=np.array(image);r,g,b=[a[:,:,j].astype(float)for j in range(3)]
 upper=bounds[1]+(bounds[3]-bounds[1])*.34
 metal=mask&(g>=r*.98)&(b>=r*.9)&(np.maximum.reduce([r,g,b])>32)&(np.arange(a.shape[0])[:,None]<upper)
 if guide_frame is not None:
  # The authored dome occupies neck-relative x+-6.5/y-8.3..-2;
  # exclude the connected pauldron and collar, not merely the upper actor.
  nx,ny=guide_frame['head']['neckPivot'][:2]
  left=32+(nx-6.5-32)*.925;right=32+(nx+6.5-32)*.925
  top=62+(ny-8.3-62)*.925;bottom=62+(ny-2-62)*.925
  yy,xx=np.indices(mask.shape)
  metal&=(xx>=left)&(xx<right)&(yy>=top)&(yy<bottom)
 parts,n=label(metal);sizes=np.bincount(parts.ravel());sizes[0]=0
 if not sizes.any():raise RuntimeError('Rear helmet/core landmark missing')
 ys,xs=np.nonzero(parts==sizes.argmax());bb=[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]
 return [(bb[0]+bb[2])/2,(bb[1]+bb[3])/2],bb
parser=argparse.ArgumentParser();parser.add_argument('--hero',choices=['erik','baleog','olaf'],nargs='+',default=['erik','baleog','olaf']);args=parser.parse_args()
for name in args.hero:
 count={'erik':32,'baleog':38,'olaf':60}[name];target={'erik':36,'baleog':38,'olaf':36}[name]
 source=sorted(folder.glob(name+'-full-raw-v*.png'))[-1]
 raw=Image.open(source).convert('RGBA');a=np.array(raw);ids,n=label(a[:,:,3]>=128)
 cellw=raw.width/8;cellh=raw.height/((count+7)//8)
 actors={}
 for i in range(1,n+1):
  ys,xs=np.nonzero(ids==i)
  if len(xs)<100:continue
  col=min(7,int(xs.mean()/cellw));row=int(ys.mean()/cellh);index=row*8+col
  if index>=count:continue
  actors.setdefault(index,[]).append(i)
 if set(actors)!=set(range(count)):raise RuntimeError(f'{name}: missing actor indices {set(range(count))-set(actors)}')
 bounds=[]
 for index in range(count):
  m=np.isin(ids,actors[index]);ys,xs=np.nonzero(m);bounds.append([int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)])
 guide=json.loads((root/f'assets/vikings86-native/{name}-frames.json').read_text())
 guideImage=Image.open(root/f'assets/vikings86-native/{name}-native.png').convert('RGBA')
 # Horn-inclusive standing silhouette budget, shared across the ENTIRE kit.
 scale=float(np.median([b[3]-b[1]for b in bounds[8:12]]))/target
 xoffset=float(np.median([(b[0]+b[2])/2-(i%8)*cellw for i,b in enumerate(bounds)if 8<=i<12]))
 guidecenter=float(np.median([(f['opaqueBoundsNative'][0]+f['opaqueBoundsNative'][2])/2 for f in guide['frames'][8:12]]))
 out=Image.new('RGBA',(640,((count+7)//8)*80));records=[]
 r,g,b=[a[:,:,i].astype(float)for i in range(3)]
 matte=((r>75)&(r>g*4)&(r>b*3))|((g>80)&(g>r*2)&(g>b*2))|((r>235)&(g>235)&(b<20))
 for index,bb in enumerate(bounds):
  mask=np.isin(ids,actors[index]);mask&=~(matte&(distance_transform_edt(mask)<scale))
  cleaned=a.copy();cleaned[:,:,3]=np.where(mask,255,0).astype(np.uint8);cleaned[~mask,:3]=0
  guidefloor=guide['frames'][index]['opaqueBoundsNative'][3]
  tx=(index%8)*cellw+xoffset-guidecenter*scale;ty=bb[3]-guidefloor*scale
  # Equal eight-native transparent padding preserves oversized sword extremes
  # WITHOUT moving any one body relative to the reviewed motion anchor.
  tx-=8*scale;ty-=8*scale
  landmark=None
  if 14<=index<=17:
   sourceAnchor,sourceLandmarkBounds=steel_anchor(raw,mask,bb)
   gc=guideImage.crop((index%8*64,index//8*64,index%8*64+64,index//8*64+64));ga=np.array(gc)
   guideAnchor,guideLandmarkBounds=steel_anchor(gc,ga[:,:,3]>0,gc.getbbox(),guide['frames'][index])
   targetAnchor=[guideAnchor[0]+8,guideAnchor[1]+8]
   tx=sourceAnchor[0]-targetAnchor[0]*scale;ty=sourceAnchor[1]-targetAnchor[1]*scale
   landmark={'kind':'stable rear steel helmet/core, not moving boot','sourceAnchor':sourceAnchor,'sourceLandmarkBounds':sourceLandmarkBounds,'guideAnchor':guideAnchor,'guideLandmarkBounds':guideLandmarkBounds,'targetAnchor':targetAnchor}
  if name=='olaf' and 52<=index<=59:
   # Entire original actor follows its raised support anchor while its authored
   # legs move freely. The first8native-high band is the painted raised disc.
   disc=mask&(np.arange(a.shape[0])[:,None]<bb[1]+8*scale)
   ys,xs=np.nonzero(disc);sourceDisc=[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]
   sourceAnchor=[(sourceDisc[0]+sourceDisc[2])/2,bb[1]+4*scale]
   tx=sourceAnchor[0]-40*scale;ty=sourceAnchor[1]-30*scale
   landmark={'kind':'painted raised disc/palm support for nongrounded actor','sourceAnchor':sourceAnchor,'sourceLandmarkBounds':sourceDisc,'targetAnchor':[40,30]}
  cell=Image.fromarray(cleaned).transform((80,80),Image.Transform.AFFINE,(scale,0,tx,0,scale,ty),Image.Resampling.NEAREST)
  out.alpha_composite(cell,((index%8)*80,(index//8)*80))
  records.append({'cell':index,'components':actors[index],'originalBounds':bb,'sourceAffine':[scale,0,tx,0,scale,ty],'guideFloorAnchor':guidefloor,'registrationLandmark':landmark,'nativeBounds':cell.getbbox()})
 out.save(folder/f'{name}-native.png')
 (folder/f'{name}-registration.json').write_text(json.dumps({'source':source.name,'originalSize':list(raw.size),'cell':[80,80],'paddingNative':8,'cols':8,'origin':[40,48],'standingHeightIncludesHorns':target,'originalPixelsPerNativePixel':scale,'xAnchorMethod':'shared idle silhouette center; nongrounded overrides are recorded per frame','yAnchorMethod':'grounded: whole actor boot baseline to guide floor plus8padding; rear climb14..17: steel dome landmark excluding collar/pauldrons; Olaf52..59: painted disc/palm midpoint40,30; uniform scale throughout','records':records},indent=2)+'\n')
 print(name,source.name,'common scale',scale,'native',out.size)
