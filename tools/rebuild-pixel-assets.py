"""Rebuild the published pixel assets from originals, rejecting invented colors."""
from pathlib import Path
import argparse,json,re,sys,time,shutil
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'tools/pixel-art-fixer/python'))
from pixelfixer.reconstruct import two_stage_pack

def out_of_range(source,fixed):
 h,w=source.shape[:2];rows,cols=fixed.shape[:2]
 if cols>w or rows>h:raise ValueError('Only downsampling is supported by this asset pipeline')
 xs=np.ceil(np.arange(cols)*w/cols).astype(int);ys=np.ceil(np.arange(rows)*h/rows).astype(int)
 rgb=source[:,:,:3]
 lo=np.minimum.reduceat(np.minimum.reduceat(rgb,xs,axis=1),ys,axis=0)
 hi=np.maximum.reduceat(np.maximum.reduceat(rgb,xs,axis=1),ys,axis=0)
 return int(np.any((fixed[:,:,:3]<lo)|(fixed[:,:,:3]>hi),axis=2).sum())

def normalize(image,size):
 source=np.array(image.convert('RGBA'));fixed=two_stage_pack(source,*size)
 invalid=out_of_range(source,fixed)
 if invalid:raise ValueError(f'Normalization invented colors in {invalid} cells')
 if not set(np.unique(fixed[:,:,3])).issubset({0,255}):raise ValueError('Nonbinary alpha')
 return Image.fromarray(fixed)

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--source-root',type=Path,default=Path.home()/'.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7');parser.add_argument('--only');parser.add_argument('--check',action='store_true');args=parser.parse_args()
 specs=json.loads((ROOT/'tools/pixel-assets.json').read_text())
 published=set(re.findall(r"'(assets/pixel/[^']+)'",(ROOT/'publish-update.mjs').read_text()))
 if {s['target'] for s in specs}!=published:raise ValueError('Asset manifest does not cover every published PNG')
 prepared=[]
 for s in specs:
  if args.only and args.only not in s['target']:continue
  source=args.source_root/s['source'].removeprefix('generated/') if s['source'].startswith('generated/') else ROOT/s['source']
  if not source.exists():raise FileNotFoundError(source)
  prepared.append((s,source))
 if args.check:
  for spec,source in prepared:
   image=Image.open(source).convert('RGBA');fixed=Image.open(ROOT/spec['target']).convert('RGBA')
   if list(fixed.size)!=spec['size']:raise ValueError('Changed atlas dimensions: '+spec['target'])
   if not set(np.unique(np.array(fixed)[:,:,3])).issubset({0,255}):raise ValueError('Nonbinary alpha: '+spec['target'])
   if 'pieces' in spec:
    invalid=0
    for part in spec['pieces']:
     x,y=part['at'];w,h=part['size'];invalid+=out_of_range(np.array(image.crop(tuple(part['crop']))),np.array(fixed.crop((x,y,x+w,y+h))))
   else:
    if 'crop' in spec:image=image.crop(tuple(spec['crop']))
    invalid=out_of_range(np.array(image),np.array(fixed))
   if invalid:raise ValueError(f"{spec['target']}: {invalid} colors outside source cells")
  print(f'Checked {len(prepared)} published assets: zero colors outside source cells; dimensions and alpha valid')
  return
 report=[];staging=ROOT/'output/pixel-pipeline44/staging';staging.mkdir(parents=True,exist_ok=True)
 for s,source in prepared:
  start=time.time();image=Image.open(source).convert('RGBA');target=ROOT/s['target'];old=Image.open(target).convert('RGBA')
  backup=ROOT/'output/pixel-pipeline44/before'/target.name;backup.parent.mkdir(parents=True,exist_ok=True)
  if not backup.exists():shutil.copyfile(target,backup)
  if 'pieces' in s:
   result=Image.new('RGBA',tuple(s['size']));invalid_before=0
   for part in s['pieces']:
    cell=image.crop(tuple(part['crop']));x,y=part['at'];w,h=part['size'];invalid_before+=out_of_range(np.array(cell),np.array(old.crop((x,y,x+w,y+h))));result.paste(normalize(cell,part['size']),(x,y))
  else:
   if 'crop' in s:image=image.crop(tuple(s['crop']))
   invalid_before=out_of_range(np.array(image),np.array(old));result=normalize(image,s['size'])
  if list(result.size)!=s['size']:raise ValueError('Changed atlas dimensions')
  result.save(staging/target.name)
  row={'target':s['target'],'size':s['size'],'invalid_before':invalid_before,'invalid_after':0,'seconds':round(time.time()-start,2)};report.append(row);print(json.dumps(row),flush=True)
 # Install only after every selected asset has passed validation.
 for s,source in prepared:shutil.copyfile(staging/Path(s['target']).name,ROOT/s['target'])
 (ROOT/'output/pixel-pipeline44/report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
 print(f'Installed {len(report)} validated assets; eliminated {sum(r["invalid_before"] for r in report)} out-of-source-range pixels',flush=True)
if __name__=='__main__':main()
