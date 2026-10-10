"""Prepare the new art without recoloring scenery or changing its native density.
Sprites alone use the corrected positive-weight packer; every alpha is binary.
"""
from pathlib import Path
import sys
from PIL import Image
import numpy as np
sys.path.insert(0,str(Path(__file__).parent/'pixel-art-fixer'/'python'))
from pixelfixer.reconstruct import two_stage_pack
root=Path('C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7')
out=Path('assets/campaign46');out.mkdir(parents=True,exist_ok=True)
sources=out/'source';sources.mkdir(exist_ok=True)
names=['exec-5d797b77-507b-4b46-a747-3028aa181eff.png','exec-0a5088aa-3565-4800-82a0-55a35bc707a1.png']
for sheet,name in enumerate(names):
 local=sources/f'scenes-{sheet}.png';im=Image.open(local if local.exists() else root/name).convert('RGB');im.save(local)
 for n in range(4):
  x=n%2*768;y=n//2*512;im.crop((x,y,x+768,y+512)).save(out/f'scene-{sheet*4+n}.png')
local=sources/'machines.png';im=Image.open(local if local.exists() else root/'exec-0b60ebbb-ccae-4b5b-9c5a-75195bfca451.png').convert('RGBA');im.save(local)
data=np.array(im);data[:,:,3]=np.where(data[:,:,3]>=128,255,0)
im=Image.fromarray(data)
# Fixed enemy feet: preserve frame proportions and align each real alpha foot to
# the cell bottom. Never stretch the trimmed frame to a different rectangle.
for n in range(24,32):
 x=n%8*192;y=n//8*256;cell=im.crop((x,y,x+192,y+256));bounds=cell.getbbox()
 if bounds:
  art=cell.crop(bounds);stable=Image.new('RGBA',(192,256));stable.paste(art,((192-art.width)//2,256-art.height));im.paste(stable,(x,y))
im.save(sources/'machines-aligned.png')
result=Image.fromarray(two_stage_pack(np.array(im),768,512))
result.save(out/'machines.png')
print('Prepared eight native 768x512 scenes and new 8x4 sprite atlas; enemy feet aligned.')
