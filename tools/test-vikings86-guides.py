"""Geometry/registration checks; independent visual review is still required."""
import json, math, unittest
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/vikings86-native'

class AnatomyGuideTests(unittest.TestCase):
 def test_native_cells_and_neutral_budget(self):
  for hero,count,height in [('erik',32,36),('baleog',38,38),('olaf',60,36)]:
   data=json.loads((OUT/f'{hero}-frames.json').read_text());frames=data['frames']
   self.assertEqual(data['cell'],[64,64]);self.assertEqual(data['origin'],[32,40])
   self.assertEqual(len(frames),count)
   atlas=Image.open(OUT/f'{hero}-native.png')
   self.assertEqual(atlas.size,(512,math.ceil(count/8)*64))
   self.assertEqual(set(atlas.getchannel('A').get_flattened_data()),{0,255})
   self.assertEqual(frames[8]['opaqueBoundsNative'][3],62)
   self.assertEqual(62-frames[8]['opaqueBoundsNative'][1],height)

 def test_all_joint_chains_retain_authored_lengths(self):
  for hero in ['erik','baleog','olaf']:
   for f in json.loads((OUT/f'{hero}-frames.json').read_text())['frames']:
    for name,chain in f['limbs'].items():
     for i,(a,b) in enumerate([('start','joint'),('joint','end')]):
      with self.subTest(hero=hero,cell=f['cell'],limb=name,segment=i):
       self.assertAlmostEqual(math.dist(chain[a],chain[b]),chain['lengths'][i],places=9)

 def test_eight_full_body_phase_sources(self):
  for hero in ['erik','baleog','olaf']:
   atlas=Image.open(OUT/f'{hero}-native.png')
   # Pixel uniqueness only catches accidental duplicates. Reviewer must judge
   # opposing limb identity and meaningful contact/passing/compression families.
   phases=[atlas.crop((i*64,0,(i+1)*64,64)).tobytes()for i in range(8)]
   self.assertEqual(len(set(phases)),8)
   fs=json.loads((OUT/f'{hero}-frames.json').read_text())['frames'][:8]
   for f in fs:self.assertEqual(f['viewArt'],'three-quarter-right')

 def test_accepted85_support_contact_heights_preserved(self):
  for hero in ['erik','baleog','olaf']:
   baseline=json.loads((ROOT/f'assets/vikings85-native/{hero}-frames.json').read_text())['frames']
   revised=json.loads((OUT/f'{hero}-frames.json').read_text())['frames']
   self.assertEqual(len(baseline),len(revised))
   for before,after in zip(baseline,revised):
    for side in ['near','far']:
     self.assertEqual(before['feet'][side]['ankle'][1],after['feet'][side]['ankle'][1])
     self.assertEqual([p[1]for p in before['feet'][side]['polygon']],[p[1]for p in after['feet'][side]['polygon']])

 def test_isolated_enlargement_contains_no_new_pixels(self):
  native=Image.open(OUT/'olaf-idle-guide-native.png')
  enlarged=Image.open(OUT/'olaf-idle-guide-8x.png')
  self.assertEqual(native.size,(64,64));self.assertEqual(enlarged.size,(512,512))
  self.assertEqual(native.resize((512,512),Image.Resampling.NEAREST).tobytes(),enlarged.tobytes())

if __name__=='__main__':unittest.main()
