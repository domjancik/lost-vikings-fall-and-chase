"""Pack original generated plates once at intended scene and mechanism sizes."""
from pathlib import Path
import sys,shutil
import numpy as np
from PIL import Image
sys.path.insert(0,str(next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())/'tools/pixel-art-fixer/python'))
from pixelfixer.reconstruct import two_stage_pack
root=Path('assets/cycle52');root.mkdir(parents=True,exist_ok=True)
sources=Path.home()/'.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7'
for name,file in [('source-machines','exec-da19f1e7-2030-4400-8855-033a1115b3d6.png'),('source-scene','exec-a905483d-d05e-4512-b82c-807f97f7a834.png')]:
 shutil.copyfile(sources/file,root/(name+'.png'))
sheet=Image.open(root/'source-machines.png').convert('RGBA')
cw,ch=sheet.width//4,sheet.height//4
def cell(n):return sheet.crop((n%4*cw,n//4*ch,(n%4+1)*cw,(n//4+1)*ch))
def pack(im,w,h):
 a=two_stage_pack(np.array(im),w,h);a[:,:,3]=np.where(a[:,:,3]>=128,255,0);a[a[:,:,3]==0,:3]=0
 return Image.fromarray(a)
atlas=Image.new('RGBA',(128,128))
for n in range(16):
 im=pack(cell(n),32,32)
 if n not in [8,9]:
  a=np.array(im);rows=np.where(np.count_nonzero(a[:,:,3],axis=1)>=8)[0]
  if len(rows):
   aligned=Image.new('RGBA',(32,32));aligned.paste(im,(0,31-int(rows[-1])));im=aligned
 atlas.paste(im,(n%4*32,n//4*32))
atlas.save(root/'machines.png')
fan=Image.new('RGBA',(256,64))
for n in range(4):fan.paste(pack(cell(n),64,64),(n*64,0))
fan.save(root/'fan.png')
ladder=cell(9);ladder=ladder.crop(ladder.getbbox());pack(ladder,16,40).save(root/'ladder.png')
carrier=cell(8).crop((0,ch//2,cw,ch));carrier=carrier.crop(carrier.getbbox());pack(carrier,80,32).save(root/'carrier.png')
scene=Image.open(root/'source-scene.png').convert('RGBA')
pack(scene,round(scene.width*600/scene.height),600).convert('RGB').save(root/'scene.png')
print('Prepared fixed cells, 80x32 carrier, 16x40 ladder, and scene at intended 600 native pixels high.')
