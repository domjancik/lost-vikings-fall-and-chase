from pathlib import Path
p=Path('.')
# normalize newly generated art with the requested pixel fixer
import sys,numpy as np
from PIL import Image
sys.path.insert(0,str((p/'tools/pixel-art-fixer/python').resolve()))
from pixelfixer.reconstruct import two_stage_pack
src=Path('C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7')
for source,name in [('exec-8cdb4951-c184-48a8-84b7-6b1cb387cf72.png','inventory-backgrounds.png'),('exec-d0861e8a-a23b-46cc-9223-f80de6be37fa.png','inventory-sprites.png')]:
 (p/'assets'/name).write_bytes((src/source).read_bytes())
bg=Image.open(p/'assets/inventory-backgrounds.png').convert('RGBA')
for i in range(3):
 edges=[0,480,970,bg.height];cell=bg.crop((0,edges[i],bg.width,edges[i+1]))
 Image.fromarray(two_stage_pack(np.array(cell),720,360)).save(p/f'assets/pixel/inventory-background-{i+1}.png')
sprites=Image.open(p/'assets/inventory-sprites.png').convert('RGBA')
atlas=Image.new('RGBA',(320,320));edges=[0,315,620,915,sprites.height]
for n in range(16):
 row=n//4;col=n%4;cell=sprites.crop((round(col*sprites.width/4),edges[row],round((col+1)*sprites.width/4),edges[row+1]));atlas.paste(Image.fromarray(two_stage_pack(np.array(cell),80,80)),(col*80,row*80))
atlas.save(p/'assets/pixel/inventory-sprites.png')
print('Normalized 3 backgrounds and 16 sprite cells')
