"""Generated art registration checks complement, not replace, visual gates."""
from pathlib import Path
import json,unittest
import numpy as np
from PIL import Image
from scipy.ndimage import label
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/water87'

class WaterArtTests(unittest.TestCase):
 def test_uniform_original_scale_and_ground_contact(self):
  records=json.loads((OUT/'registration-v2.json').read_text())['records']
  self.assertEqual(len(records),12)
  for r in records:
   self.assertEqual(r['originalPixelsPerNativePixel'],4.25)
   self.assertEqual(r['sourceTransform'][0],4.25);self.assertEqual(r['sourceTransform'][4],4.25)
   self.assertEqual(r['floorBaselineExclusive'],92)
   self.assertEqual(r['nativeBounds'][3],92)
   self.assertGreaterEqual(r['nativeBounds'][0],0);self.assertLessEqual(r['nativeBounds'][2],96)

 def test_binary_alpha_and_no_hidden_chroma(self):
  for name in ['machines-native-v2.png','link-native.png','nozzle-native.png','cradle-native.png']:
   a=np.array(Image.open(OUT/name));self.assertEqual(set(np.unique(a[:,:,3])),{0,255})
   self.assertTrue((a[a[:,:,3]==0,:3]==0).all())

 def test_closed_chain_joins_both_original_halves(self):
  chain=Image.open(OUT/'retaining-chain-native.png');link=Image.open(OUT/'link-native.png')
  _,before=label(np.array(chain)[:,:,3]>0);self.assertEqual(before,2)
  chain.alpha_composite(link,(0,-15));_,after=label(np.array(chain)[:,:,3]>0);self.assertEqual(after,1)
  # No optical scale rescue: the true generated link stays tiny and hollow.
  self.assertEqual(link.getbbox(),(43,42,53,54));self.assertEqual(link.getpixel((48,45))[3],0)
  self.assertEqual(link.getpixel((48,47))[3],255)

 def test_native_nozzle_mount_and_stream_aperture(self):
  im=Image.open(OUT/'nozzle-native.png');self.assertEqual(im.size,(96,96))
  self.assertNotEqual(im.getpixel((48,23))[3],0)
  r,g,b,a=im.getpixel((48,85));self.assertEqual(a,255)
  self.assertLess(r,100);self.assertLess(g,100);self.assertLess(b,100)

 def test_generated_cradle_has_full_seat_and_empty_bell_cavity(self):
  im=Image.open(OUT/'cradle-native.png');a=np.array(im)
  registration=json.loads((OUT/'cradle-registration.json').read_text())
  self.assertEqual(im.size,(128,128));self.assertEqual(im.getbbox(),(2,7,126,112))
  self.assertEqual(registration['rawPixelsPerNative'],1254/128)
  self.assertEqual(registration['beamSeatY'],12)
  self.assertTrue((a[12,7:121,3]==255).all())
  # Mobile bell and rod remain visible inside the generated supporting legs.
  self.assertTrue((a[25:88,36:92,3]==0).all())
  self.assertTrue((a[110,:,3]>0).any())

if __name__=='__main__':unittest.main()
