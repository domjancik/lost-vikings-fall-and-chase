from pathlib import Path
import sys,numpy as np
from PIL import Image
sys.path.insert(0,str(Path('tools/pixel-art-fixer/python').resolve()))
from pixelfixer.reconstruct import two_stage_pack
im=Image.open('assets/parallax-scenes.png').convert('RGBA');out=two_stage_pack(np.array(im),720,480);Image.fromarray(out).save('assets/pixel/parallax-scenes.png');print('Parallax atlas fixed to 720x480 with 3x2 cells')
