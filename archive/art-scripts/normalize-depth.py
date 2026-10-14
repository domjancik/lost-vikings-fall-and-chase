from pathlib import Path
import sys,numpy as np
from PIL import Image
sys.path.insert(0,str(Path('tools/pixel-art-fixer/python').resolve()))
from pixelfixer.reconstruct import two_stage_pack
src=Path('C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7')
files=['d3a1624e-a40e-471e-bbd0-bab7198c547b','e2cc7e8e-9685-4444-a172-2cef9873eb6d','db8d9923-3886-433d-9ec6-a884892972b0','2dcf3c40-f235-4b90-9143-6ea803a79089','bccbaf11-acd6-472e-985d-c3d012f5990c','639eacd5-bc98-4a09-b341-b16f4af1db87','b37bdc09-5015-43e2-8d2d-5118ad1a9a56','8230c6bb-5250-461a-9721-0f5a3c491dc5','15fa49fc-9fe7-45d4-a5ff-e39b14b82776']
for i,f in enumerate(files):
 im=Image.open(src/f'exec-{f}.png').convert('RGBA')
 Image.fromarray(two_stage_pack(np.array(im),720,round(720*im.height/im.width))).save(f'assets/pixel/depth-far-{i}.png')
 print('Normalized distant plate',i,flush=True)
