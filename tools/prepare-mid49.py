"""Pack fixed-aspect opaque architecture from versioned generated sheets."""
from pathlib import Path
import sys, shutil
import numpy as np
from PIL import Image
sys.path.insert(0,str(Path(__file__).parent/'pixel-art-fixer/python'))
from pixelfixer.reconstruct import two_stage_pack
root=Path('assets/mid49'); root.mkdir(parents=True,exist_ok=True)
generated=Path.home()/'.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7'
for sheet,name in enumerate(['exec-9b8f29fa-ac2c-43a0-b406-9769cd0d6782.png','exec-c85ab734-4ef6-49b4-ae83-a379a27268c0.png']):
 source=root/f'source-{sheet}.png'
 if not source.exists():shutil.copyfile(generated/name,source)
 image=Image.open(source).convert('RGBA');assert image.size==(1536,1024)
 for cell in range(4):
  chapter=sheet*4+cell;x=cell%2*768;y=cell//2*512
  pixels=np.array(image.crop((x,y,x+768,y+512)))
  pixels[:,:,3]=np.where(pixels[:,:,3]>=128,255,0)
  occupied=np.where(pixels[:,:,3]>0)[0]
  shift=-int(occupied.min()) if chapter==5 else 511-int(occupied.max())
  aligned=np.zeros_like(pixels)
  if shift>=0:aligned[shift:]=pixels[:512-shift]
  else:aligned[:512+shift]=pixels[-shift:]
  fixed=two_stage_pack(aligned,384,256)
  fixed[:,:,3]=np.where(fixed[:,:,3]>=128,255,0)
  fixed[fixed[:,:,3]==0,:3]=0
  assert set(np.unique(fixed[:,:,3]))=={0,255}
  assert np.any(fixed[0 if chapter==5 else -1,:,3]==255)
  Image.fromarray(fixed).save(root/f'scene-{chapter}.png')
  print(chapter,'opaque pixels',int(np.count_nonzero(fixed[:,:,3])),'support shift',shift)
