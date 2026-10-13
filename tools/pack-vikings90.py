"""Once-only native sampling of approved exact-cell sources; anatomical registration.

Never fit actor alpha boxes. Every source describes a64native cell. Integer
whole-actor translation aligns its steel dome to the authored moving head,
retaining the head/core bob and the original shape/material pixels.
"""
from pathlib import Path
from PIL import Image,ImageDraw
from scipy.ndimage import label
import numpy as np,json,argparse,math
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/vikings90'

def helmet(image):
 a=np.array(image);r,g,b=[a[:,:,i].astype(float)for i in range(3)];yy,xx=np.indices(a.shape[:2]);opaque=a[:,:,3]>=128
 # Upper helmet only: exclude face, clothes, hands, trousers and pauldrons.
 bound=np.nonzero(opaque);top=int(bound[0].min());steel=opaque&(yy<top+12)&(g>=r*.96)&(b>=r*.9)&(np.maximum.reduce([r,g,b])>32)
 ids,n=label(steel);sizes=np.bincount(ids.ravel());sizes[0]=0
 if not sizes.any():raise ValueError('Missing helmet/core anchor')
 ys,xs=np.nonzero(ids==sizes.argmax());bb=[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]
 return [(bb[0]+bb[2])/2,(bb[1]+bb[3])/2],bb

def main():
 p=argparse.ArgumentParser();p.add_argument('--hero',choices=['erik','baleog','olaf'],default='erik');p.add_argument('--evidence-only',action='store_true');p.add_argument('--ordinary',action='store_true');args=p.parse_args();hero=args.hero
 if args.ordinary and not args.evidence_only:raise ValueError('Partial ordinary evidence cannot replace a complete atlas')
 data=json.loads((OUT/f'{hero}-guide.json').read_text());guide=Image.open(OUT/f'{hero}-guide-native.png');old=Image.open(ROOT/f'assets/vikings88/{hero}-native.png');atlas=old.copy();processed=[];sources=[];records=[]
 manifestPath=OUT/f'{hero}-source-selection.json';selection=json.loads(manifestPath.read_text())if manifestPath.exists()else{}
 for i,f in enumerate(data['frames']):
  if args.ordinary and f['action'].startswith('overhead'):continue
  key=f"{hero}-{f['action']}-{f['phase']}";path=OUT/selection.get(key,f'{key}-raw-v4.png')
  if not path.exists():raise FileNotFoundError(path)
  raw=Image.open(path).convert('RGBA');native=raw.resize((64,64),Image.Resampling.NEAREST)
  sourceAnchor,sourceBounds=helmet(native);g=guide.crop((i%8*64,i//8*64,i%8*64+64,i//8*64+64));targetAnchor,targetBounds=helmet(g)
  shift=[round(t-s)for t,s in zip(targetAnchor,sourceAnchor)];clean=np.array(native);clean[:,:,3]=np.where(clean[:,:,3]>=128,255,0);clean[clean[:,:,3]==0,:3]=0;nativeClean=Image.fromarray(clean)
  cell=Image.new('RGBA',(80,80));cell.alpha_composite(nativeClean,(8+shift[0],8+shift[1]));processed.append(cell);sources.append(native)
  atlas.paste(cell,(f['cell']%8*80,f['cell']//8*80))
  records.append({'cell':f['cell'],'action':f['action'],'phase':f['phase'],'source':path.name,'sourceSize':list(raw.size),'nativeCell':[64,64],'scale':[raw.width/64,raw.height/64],'registration':'wholeactor integer steel-dome/core translation, not alpha/boot fitting','sourceHelmet':sourceAnchor,'sourceHelmetBounds':sourceBounds,'targetHelmet':targetAnchor,'targetHelmetBounds':targetBounds,'translation':shift,'nativeBounds':cell.getbbox()})
 cols=8;rows=math.ceil(len(processed)/8);sheet=Image.new('RGBA',(cols*80,rows*80),'#263746');comparison=Image.new('RGBA',(cols*80,rows*160),'#263746')
 for i,(source,cell)in enumerate(zip(sources,processed)):
  sheet.alpha_composite(cell,(i%8*80,i//8*80));comparison.alpha_composite(source,(i%8*80+8,i//8*160+8));comparison.alpha_composite(cell,(i%8*80,i//8*160+80))
 sheet.resize((sheet.width*4,sheet.height*4),Image.Resampling.NEAREST).save(OUT/f'{hero}-replacement-4x.png');comparison.resize((comparison.width*2,comparison.height*2),Image.Resampling.NEAREST).save(OUT/f'{hero}-source-native-comparison.png')
 for action in sorted(set(r['action']for r in records)):
  seq=[]
  for f,cell in zip([f for f in data['frames']if not args.ordinary or not f['action'].startswith('overhead')],processed):
   if f['action']!=action:continue
   frame=Image.new('RGBA',(80,80),'#263746');frame.alpha_composite(cell);d=ImageDraw.Draw(frame);d.line((40,0,40,79),fill='#536576');d.line((0,70,79,70),fill='#536576');seq.append(frame.resize((480,480),Image.Resampling.NEAREST))
  seq[0].save(OUT/f'{hero}-registered-{action}.gif',save_all=True,append_images=(seq*3)[1:],duration=110 if 'walk'in action else 240,loop=0,disposal=2)
 if not args.evidence_only:atlas.save(OUT/f'{hero}-native.png')
 (OUT/f'{hero}-registration.json').write_text(json.dumps({'originalWholePoseSource':'assets/vikings88/'+hero+'-native.png (unchanged cells)','replacementRecords':records,'sourceGate':'pending fullcycle review','runtimeGate':'pending'},indent=2)+'\n')
 print(hero,len(records),'whole-pose native replacements registered; gates remain pending')
if __name__=='__main__':main()
