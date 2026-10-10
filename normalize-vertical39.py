from pathlib import Path
import sys,numpy as np
from PIL import Image
sys.path.insert(0,str(Path('tools/pixel-art-fixer/python').resolve()))
from pixelfixer.reconstruct import two_stage_pack
base=Path('C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7')
for target,f,w,h in [('depth-near-9','0360abfc-27ec-41fe-bb7b-afa0588e0871',720,720),('depth-far-9','006443f2-b73b-495e-b068-9df71b7ed77d',720,720),('depth-far-10','38e65d68-9e7f-4027-a262-d5fe906e9eac',720,720),('depth-near-10','38973054-74b9-49fc-ab33-876c2ffaa2ae',720,720),('vertical-props','ae6ea3ae-2dce-4238-a984-011dfb295e0c',512,256)]:
 image=Image.open(base/f'exec-{f}.png').convert('RGBA');pixels=two_stage_pack(np.array(image),w,h);pixels[:,:,3]=np.where(pixels[:,:,3]>=128,255,0)
 Image.fromarray(pixels).save(f'assets/pixel/{target}.png');print(target,flush=True)
