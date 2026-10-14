from pathlib import Path
import sys,numpy as np
from PIL import Image
sys.path.insert(0,str(Path('tools/pixel-art-fixer/python').resolve()))
from pixelfixer.reconstruct import two_stage_pack
im=Image.open('C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7/exec-75818ceb-0d4f-464a-9be5-2ecef814af3f.png').convert('RGBA');print('Near aspect',im.size,flush=True)
pixels=two_stage_pack(np.array(im),720,720);pixels[:,:,3]=np.where(pixels[:,:,3]>=128,255,0);Image.fromarray(pixels).save('assets/pixel/depth-near-9.png')
