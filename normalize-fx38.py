from pathlib import Path
import sys,numpy as np
from PIL import Image
sys.path.insert(0,str(Path('tools/pixel-art-fixer/python').resolve()))
from pixelfixer.reconstruct import two_stage_pack
image=Image.open('C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7/exec-226b3b77-20fd-425a-bf66-fed19c538b4d.png').convert('RGBA')
pixels=two_stage_pack(np.array(image),512,256);pixels[:,:,3]=np.where(pixels[:,:,3]>=128,255,0)
Image.fromarray(pixels).save('assets/pixel/background-fx.png')
