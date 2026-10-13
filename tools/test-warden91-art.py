import unittest
from PIL import Image

class WardenArtContacts(unittest.TestCase):
    def test_fixed_base_and_rightward_cap(self):
        image = Image.open('assets/warden91/plunger-native.png').convert('RGBA')
        starts = []
        for index in range(4):
            cell = image.crop((index * 80, 0, (index + 1) * 80, 64))
            base = [x for x in range(80) if cell.getpixel((x, 50))[3]]
            self.assertEqual(max(base), 76)
            cap = [x for x in range(25, 48)
                   if (lambda p: p[3] and p[0] > p[1] * 1.3
                       and p[0] > p[2] * 1.7)(cell.getpixel((x, 35)))]
            starts.append(min(cap))
        self.assertEqual(starts, [29, 33, 35, 37])

    def test_emitter_mount_and_transparency(self):
        image = Image.open('assets/warden91/emitter-native.png').convert('RGBA')
        self.assertEqual(image.size, (32, 32))
        self.assertGreater(image.getpixel((17, 29))[3], 0)
        self.assertEqual(image.getpixel((17, 30))[3], 0)
        self.assertTrue(all(p[3] in (0, 255) for p in image.getdata()))

if __name__ == '__main__':
    unittest.main()
