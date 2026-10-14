"""Prepare generated animation cells at fixed human-scale dimensions and feet."""
from pathlib import Path
import sys,shutil,json
import numpy as np
from PIL import Image
sys.path.insert(0,str(next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())/'tools/pixel-art-fixer/python'))
from pixelfixer.reconstruct import two_stage_pack
root=Path('assets/ground51');root.mkdir(parents=True,exist_ok=True)
source=root/'source.png'
if not source.exists():shutil.copyfile(Path.home()/'.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7/exec-d16383d5-424b-4241-9b1b-ba1dbdb1ee82.png',source)
image=Image.open(source).convert('RGBA');assert image.size==(1536,1024)
atlas=Image.new('RGBA',(192,128));proof=[]
for row in range(4):
 for col in range(8):
  pixels=np.array(image.crop((col*192,row*256,(col+1)*192,(row+1)*256)))
  packed=two_stage_pack(pixels,24,32);packed[:,:,3]=np.where(packed[:,:,3]>=128,255,0)
  packed[packed[:,:,3]==0,:3]=0
  bases=[y for y in range(32) if np.count_nonzero(packed[y,:,3])>=10]
  assert bases;foot=bases[-1];xs=np.where(packed[foot,:,3]>0)[0]
  dx=12-round((int(xs.min())+int(xs.max()))/2);dy=31-foot
  aligned=Image.new('RGBA',(24,32));aligned.paste(Image.fromarray(packed),(dx,dy))
  a=np.array(aligned);assert np.count_nonzero(a[-1,:,3])>=10
  atlas.paste(aligned,(col*24,row*32));proof.append({'row':row,'frame':col,'shift':[dx,dy],'foot':31,'size':[24,32]})
atlas.save(root/'interaction-frames.png');(root/'registration.json').write_text(json.dumps(proof,indent=2)+'\n')
print('32 generated opaque frames; fixed24x32 cells; broad foot at row31; no per-frame resizing.')
