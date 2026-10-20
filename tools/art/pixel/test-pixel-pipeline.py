import os,sys,unittest
from pathlib import Path
from unittest.mock import patch
import numpy as np
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(Path(os.environ.get('PIXEL_FIXER_ROOT',ROOT/'tools/pixel-art-fixer')).resolve()/'python'))
from pixelfixer.reconstruct import two_stage_pack

class PackingColorTests(unittest.TestCase):
 def test_noninteger_grid_cannot_invent_colors(self):
  h,w=19,31;rows,cols=11,18
  y,x=np.mgrid[:h,:w];rgb=np.stack([55+x*2,43+y*2,38+x+y],-1).astype(np.uint8);rgba=np.dstack([rgb,np.full((h,w),255,np.uint8)])
  with patch('pixelfixer.quantize.kmeans_quantize',return_value=(rgba,np.zeros((h,w),np.int32),np.zeros((1,3)))):
   fixed=two_stage_pack(rgba,cols,rows)
  ix=np.arange(w)*cols//w;iy=np.arange(h)*rows//h
  for cy in range(rows):
   for cx in range(cols):
    cell=rgb[np.ix_(np.flatnonzero(iy==cy),np.flatnonzero(ix==cx))];pixel=fixed[cy,cx,:3]
    self.assertTrue(np.all(pixel>=cell.min(axis=(0,1))) and np.all(pixel<=cell.max(axis=(0,1))),f'cell {cx},{cy}: {pixel} outside source colors')
 def test_integer_grid_preserves_solid_colors_and_binary_alpha(self):
  rgba=np.zeros((8,12,4),np.uint8);rgba[:,:,:3]=[62,45,39];rgba[:4,:,3]=255
  with patch('pixelfixer.quantize.kmeans_quantize',return_value=(rgba,np.zeros((8,12),np.int32),np.zeros((1,3)))):
   fixed=two_stage_pack(rgba,6,4)
  self.assertTrue(np.all(fixed[:,:,:3]==[62,45,39]));self.assertEqual(set(np.unique(fixed[:,:,3])),{0,255})
if __name__=='__main__':unittest.main()
