from pathlib import Path
import runpy
import numpy as np
from PIL import Image
root=Path('assets/campaign46');checks=0
for n in range(8):
 scene=Image.open(root/f'scene-{n}.png');sheet=Image.open(root/'source'/f'scenes-{n//4}.png');x=n%2*768;y=(n%4)//2*512
 assert scene.size==(768,512)
 assert np.array_equal(np.array(scene),np.array(sheet.crop((x,y,x+768,y+512)))),'Scenery recolored or resampled'
 checks+=1
im=Image.open(root/'machines.png');arr=np.array(im);assert set(np.unique(arr[:,:,3]))=={0,255}
for n in range(24,32):
 cell=im.crop((n%8*96,n//8*128,n%8*96+96,n//8*128+128));assert cell.getbbox()[3]==128,'Floating enemy frame '+str(n);checks+=1
source=np.array(Image.open(root/'source/machines-aligned.png'))
out_of_range=runpy.run_path('tools/art/pixel/rebuild-pixel-assets.py')['out_of_range'];assert out_of_range(source,arr)==0,'Invented normalization colors'
print(f'{checks} scenery/grid/foot checks passed; binary alpha and zero invented sprite colors.')
