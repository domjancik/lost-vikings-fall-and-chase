"""Extract matched top/side/infill sprites from generated material art."""
from pathlib import Path
import sys,runpy,shutil
import numpy as np
from PIL import Image
sys.path.insert(0,str(next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())/'tools/pixel-art-fixer/python'))
from pixelfixer.reconstruct import two_stage_pack
out_of_range=runpy.run_path('tools/art/pixel/rebuild-pixel-assets.py')['out_of_range']
root=Path('assets/terrain48');root.mkdir(parents=True,exist_ok=True)
source=root/'source.png'
if not source.exists():shutil.copyfile(Path.home()/'.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7/exec-6f2ec15a-90a9-437f-ab6f-6a98af9b832e.png',source)
image=Image.open(source).convert('RGBA')
# The generated sheet has ten columns and unequal final-row height.
# Explicit measured cell bounds exclude separator pixels and preserve material.
xs=[0,110,235,365,496,628,735,864,994,1128,1254]
ys=[0,130,264,400,534,674,808,970,1254]
result=Image.new('RGBA',(256,256));checks=0
for row in range(8):
 for col,original in enumerate([0,1,5,0,6,7,5,9]):
  margin=8 if col in [4,5] else 4
  crop=(xs[original]+margin,ys[row]+(22 if col in [3,4,5,6] else 4),xs[original+1]-margin,ys[row+1]-4)
  cell=np.array(image.crop(crop));fixed=two_stage_pack(cell,32,32)
  assert out_of_range(cell,fixed)==0
  assert np.all(fixed[:,:,3]==255)
  result.paste(Image.fromarray(fixed),(col*32,row*32));checks+=1
result.convert('RGB').save(root/'terrain.png')
print(f'{checks} material pieces prepared with valid source-cell colors;32px native tiles draw at64 world units.')
