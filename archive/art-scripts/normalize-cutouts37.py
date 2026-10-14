from pathlib import Path
import sys,numpy as np
from PIL import Image
sys.path.insert(0,str(Path('tools/pixel-art-fixer/python').resolve()))
from pixelfixer.reconstruct import two_stage_pack
base=Path('C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7')
files=['58a68064-0f10-479f-a8bc-0443da0e0a8c','073fe7f4-346b-4a26-8b63-ff4b58ac4e95','a183ec17-aec0-4812-90e3-b1964ac1d5fc','8962a5d8-1ba3-4f6f-b7c2-5adb4f726bcb','05bdd9d3-8540-474b-9cc0-85d008e70aa9','edba28e3-07aa-4b1c-aca1-3d561364de48','1b7d2733-acc3-42c8-a620-1f75c1788a05','d5917ce1-a83e-41c8-a82c-26acf7e1eedd','bf0f0cf3-ac79-4206-80e0-fcd6ef467940']
for i,f in enumerate(files):
 image=Image.open(base/f'exec-{f}.png').convert('RGBA');pixels=two_stage_pack(np.array(image),720,[480,405,405,405,405,405,360,360,360][i]);pixels[:,:,3]=np.where(pixels[:,:,3]>=128,255,0)
 Image.fromarray(pixels).save(f'assets/pixel/depth-near-{i}.png');print('Normalized object cutout',i,flush=True)
