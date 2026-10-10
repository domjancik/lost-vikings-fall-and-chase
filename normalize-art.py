from pathlib import Path
import sys,json,time,subprocess
import numpy as np
from PIL import Image
sys.path.insert(0,str(Path('tools/pixel-art-fixer/python').resolve()))
from pixelfixer.api import process
from pixelfixer.reconstruct import two_stage_pack
root=Path('assets');out=root/'pixel';out.mkdir(exist_ok=True)
layouts={'foreground-tiles.png':(8,6),'world-objects.png':(4,6),'puzzle-machines.png':(5,2)}
report={'tool':'Retro-Diffusion/pixel-art-fixer','commit':subprocess.check_output(['git','-C','tools/pixel-art-fixer','rev-parse','HEAD'],text=True).strip(),'worldPixel':2,'assets':[]}
for p in sorted(root.glob('*.png')):
 start=time.time();im=Image.open(p).convert('RGBA');arr=np.array(im);w,h=im.size
 if p.name in layouts:
  nx,ny=layouts[p.name];cols=round(w/4/nx)*nx;rows=round(h/4/ny)*ny
  fixed=two_stage_pack(arr,cols,rows)
  Image.fromarray(fixed).save(out/p.name)
  mode='two_stage_pack; preserve sheet cells'
 else:
  step=w/720;r=process(arr,force_step=step);(out/p.name).write_bytes(r['png']);cols,rows=r['cols'],r['rows'];mode='process(force_step); common background density'
 info={'file':p.name,'source':[w,h],'native':[cols,rows],'method':mode,'seconds':round(time.time()-start,2)};report['assets'].append(info);print(json.dumps(info),flush=True)
Path('output/pixel-preview/manifest.json').write_text(json.dumps(report,indent=2))
