"""Physical art contracts; these supplement the independent visual gates."""
from pathlib import Path
import json,unittest
import numpy as np
from PIL import Image
from scipy.ndimage import label
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())/'assets/water92'

class Water92ArtTests(unittest.TestCase):
 def test_uniform_machine_source_sampling_and_sole_registration(self):
  reg=json.loads((ROOT/'registration.json').read_text())
  self.assertEqual(len(reg['records']),12)
  for r in reg['records']:
   self.assertEqual(r['sourceTransform'][0],reg['scaleUniform'])
   self.assertEqual(r['sourceTransform'][4],reg['scaleUniform'])
   self.assertEqual(r['nativeBounds'][3],92)
   self.assertGreaterEqual(r['nativeBounds'][0],0)
   self.assertLessEqual(r['nativeBounds'][2],96)

 def test_air_rectangles_never_include_housing_pixels(self):
  for name,x,width in [('mobile-bell',37,22),('fixed-bell',36,26)]:
   a=np.array(Image.open(ROOT/(name+'-native.png')))
   self.assertTrue((a[44:80,x:x+width,3]==0).all())

 def test_cradle_has_real_seat_and_floor_and_a_clear_center(self):
  a=np.array(Image.open(ROOT/'cradle-native.png'))
  self.assertTrue((a[12,7:121,3]==255).all())
  self.assertTrue((a[25:88,36:92,3]==0).all())
  self.assertEqual(Image.open(ROOT/'cradle-native.png').getbbox()[3],112)

 def test_pressure_nozzle_ports_and_chain_closure(self):
  im=Image.open(ROOT/'nozzle-native.png')
  self.assertEqual(im.size,(96,96));self.assertEqual(im.getpixel((48,24))[3],255)
  self.assertLess(max(im.getpixel((48,85))[:3]),100)
  chain=Image.open(ROOT/'retaining-chain-native.png')
  self.assertEqual(label(np.array(chain)[:,:,3]>0)[1],2)
  chain.alpha_composite(Image.open(ROOT.parent/'water87/link-native.png'),(0,-18))
  self.assertEqual(label(np.array(chain)[:,:,3]>0)[1],1)

 def test_plants_keep_roots_and_stone_keeps_walking_surface(self):
  a=np.array(Image.open(ROOT/'flora-native.png'))
  for cell in range(8):
   plant=a[cell//4*48:cell//4*48+48,cell%4*32:cell%4*32+32]
   self.assertTrue((plant[46,12:20,3]>0).any())
   self.assertFalse((plant[47,:,3]>0).any())
  a=np.array(Image.open(ROOT/'terrain-native.png'))
  self.assertTrue((a[128:160,:,3]==255).all())

 def test_alpha_does_not_leave_color_halos(self):
  for name in ['machines-native.png','cradle-native.png','nozzle-native.png','flora-native.png']:
   a=np.array(Image.open(ROOT/name))
   self.assertEqual(set(np.unique(a[:,:,3])),{0,255})
   self.assertTrue((a[a[:,:,3]==0,:3]==0).all())

if __name__=='__main__':unittest.main()
