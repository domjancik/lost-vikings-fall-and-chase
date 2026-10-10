from pathlib import Path
import sys,numpy as np
from PIL import Image
sys.path.insert(0,str(Path('tools/pixel-art-fixer/python').resolve()))
from pixelfixer.reconstruct import two_stage_pack
base=Path('C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7')
for i,f in [(3,'f85cfbbb-c6bb-4495-a3d4-07f40f6f028c'),(5,'5a60799c-c42a-4364-948f-ad43283b3183'),(6,'a9becb87-2a9e-4271-8f99-c85874876ab0')]:
 image=Image.open(base/f'exec-{f}.png').convert('RGBA');pixels=two_stage_pack(np.array(image),720,360 if i==6 else 405);pixels[:,:,3]=np.where(pixels[:,:,3]>=128,255,0)
 Image.fromarray(pixels).save(f'assets/pixel/depth-near-{i}.png');print('Clean layer',i,flush=True)
image=Image.open(base/'exec-2621075f-32f8-4972-9026-650a263bde94.png').convert('RGBA');pixels=two_stage_pack(np.array(image),512,256);pixels[:,:,3]=np.where(pixels[:,:,3]>=128,255,0)
Image.fromarray(pixels).save('assets/pixel/background-fx.png');print('Effects atlas normalized',flush=True)
