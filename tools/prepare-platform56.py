"""Pack the original coarse ladder once, preserving its square source grid."""
from pathlib import Path
import sys
import numpy as np
from PIL import Image
sys.path.insert(0,str(Path(__file__).parent/'pixel-art-fixer/python'))
from pixelfixer.reconstruct import two_stage_pack
root=Path('assets/platform56')
a=np.array(Image.open(root/'ladder-source.png').convert('RGBA'))
y,x=np.where(a[:,:,3]>=128)
a=a[y.min():y.max()+1,x.min():x.max()+1]
# Source has approximately 26px square blocks: 24 columns by 64 rows.
packed=two_stage_pack(a,24,64)
packed[:,:,3]=np.where(packed[:,:,3]>=128,255,0)
packed[packed[:,:,3]==0,:3]=0
tile=Image.fromarray(packed).crop((0,0,24,13))
tile.save(root/'ladder.png')
preview=Image.new('RGBA',(24,65))
for y in range(0,65,13):preview.paste(tile,(0,y))
preview.resize((192,520),Image.Resampling.NEAREST).save('output/platform56-ladder-native.png')
print('Packed original24x64 grid, extracted24x13 seamless rung tile;48x26 world.')
