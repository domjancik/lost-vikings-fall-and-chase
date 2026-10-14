"""Check registration against the shipped material pixels, not nominal metadata."""
import json
import unittest
from pathlib import Path
from PIL import Image

class WardenContact(unittest.TestCase):
 def test_both_visible_soles_stop_exactly_at_support(self):
  meta=json.loads(Path('assets/warden102/registration.json').read_text())
  image=Image.open('assets/warden102/parts-native.png').convert('RGBA')
  for name in ['foot-near','foot-far']:
   x,y,w,h=meta['parts'][name]
   sole=meta['anchors']['footSoles'][name]
   occupied=[row for row in range(h) if sum(image.getpixel((x+col,y+row))[3]>=200 for col in range(w))>=max(2,w*.08)]
   self.assertEqual(sole,max(occupied)+1,name)
   # Every material pixel ends at or above the support, even at2x.
   for row in range(h):
    for col in range(w):
     if image.getpixel((x+col,y+row))[3]>=200:
      for scale in [2,4]:self.assertLessEqual((row+1-sole)*scale,0,name)
   self.assertGreater(sum(image.getpixel((x+col,y+sole-1))[3]>=200 for col in range(w)),w/2)

if __name__=='__main__':unittest.main()
