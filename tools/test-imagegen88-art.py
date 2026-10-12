"""Technical source packaging checks; independent pose/contact review still required."""
from pathlib import Path
import unittest,json,numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1]
class Guided88Packaging(unittest.TestCase):
 def test_nongrounded_landmarks_do_not_follow_boots(self):
  for name in ('erik','baleog','olaf'):
   registration=json.loads((root/f'assets/vikings88/{name}-registration.json').read_text())
   centers=[]
   for record in registration['records'][14:18]:
    mark=record['registrationLandmark'];self.assertIn('steel helmet',mark['kind'])
    bounds=mark['guideLandmarkBounds'];self.assertLessEqual(bounds[2]-bounds[0],13,'Pauldron included in dome landmark')
    centers.append(mark['targetAnchor'])
    affine=record['sourceAffine'];self.assertAlmostEqual((mark['sourceAnchor'][0]-affine[2])/affine[0],mark['targetAnchor'][0])
    self.assertAlmostEqual((mark['sourceAnchor'][1]-affine[5])/affine[0],mark['targetAnchor'][1])
   self.assertLessEqual(max(c[0]for c in centers)-min(c[0]for c in centers),1)
   self.assertLessEqual(max(c[1]for c in centers)-min(c[1]for c in centers),1)
   if name=='olaf':
    for record in registration['records'][52:60]:
     mark=record['registrationLandmark'];self.assertEqual(mark['targetAnchor'],[40,30])
     affine=record['sourceAffine']
     self.assertAlmostEqual((mark['sourceAnchor'][0]-affine[2])/affine[0],40)
     self.assertAlmostEqual((mark['sourceAnchor'][1]-affine[5])/affine[0],30)
 def test_complete_kits_without_cell_boundary_clipping(self):
  for name,count in [('erik',32),('baleog',38),('olaf',60)]:
   im=Image.open(root/f'assets/vikings88/{name}-native.png').convert('RGBA')
   self.assertEqual(im.size,(640,((count+7)//8)*80))
   a=np.array(im);self.assertEqual(set(np.unique(a[:,:,3])),{0,255})
   self.assertTrue((a[a[:,:,3]==0,:3]==0).all())
   gait=[]
   for i in range(count):
    cell=a[i//8*80:i//8*80+80,i%8*80:i%8*80+80]
    self.assertGreater(np.count_nonzero(cell[:,:,3]),100,f'{name}:{i} missing pose')
    self.assertFalse((cell[[0,-1],:,3]>0).any(),f'{name}:{i} vertical cell clipping')
    self.assertFalse((cell[:,[0,-1],3]>0).any(),f'{name}:{i} horizontal cell clipping')
    if i<8:gait.append(cell.tobytes())
   self.assertEqual(len(set(gait)),8,f'{name} repeated generated gait cells')
if __name__=='__main__':unittest.main()
