import importlib.util,unittest
from pathlib import Path
from PIL import Image,ImageDraw
import json
spec=importlib.util.spec_from_file_location('pack90',Path(__file__).with_name('pack-vikings90.py'))
P=importlib.util.module_from_spec(spec);spec.loader.exec_module(P)

class ShieldSupportTests(unittest.TestCase):
 def test_ordinary_planted_boot_contacts_survive_whole_pose_registration(self):
  folder=Path(__file__).resolve().parents[1]/'assets/vikings90'
  authored=json.loads((folder/'olaf-ground-contacts.json').read_text())
  records=json.loads((folder/'olaf-registration.json').read_text())['replacementRecords']
  for record,contact in zip(records[:8],authored['phases']):
   with self.subTest(phase=record['phase']):
    raw=Image.open(folder/record['source']).convert('RGBA').resize((64,64),Image.Resampling.NEAREST)
    self.assertGreaterEqual(raw.getpixel(tuple(contact['plantedPixel']))[3],128)
    actualSole=8+contact['sourceSoleExclusive']+record['translation'][1]
    self.assertEqual(actualSole,8+authored['nativeGroundSoleExclusive'])
 def test_support_plane_ignores_helmet_and_dangling_feet(self):
  im=Image.new('RGBA',(64,64));d=ImageDraw.Draw(im)
  d.ellipse((20,19,43,24),fill='#b99252');d.rectangle((27,30,37,36),fill='#88999c')
  d.rectangle((24,25,26,44),fill='#d5a26a');d.rectangle((37,25,39,44),fill='#d5a26a');d.rectangle((25,58,31,62),fill='#795832')
  anchor,bounds=P.shield_support(im)
  self.assertEqual(anchor,[32.,22.]);self.assertEqual(bounds[2]-bounds[0],24)
 def test_missing_broad_disc_is_not_a_helmet_fallback(self):
  im=Image.new('RGBA',(64,64));ImageDraw.Draw(im).rectangle((27,30,37,36),fill='#88999c')
  with self.assertRaises(ValueError):P.shield_support(im)

if __name__=='__main__':unittest.main()
