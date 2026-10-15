"""Native contact/alpha contracts; visual gates remain independent of these checks."""
from pathlib import Path
import json
from PIL import Image

p = Path(__file__).resolve().parents[3] / 'assets/orbit121'
r = json.loads((p / 'registration.json').read_text(encoding='utf8'))
images = {n: Image.open(p / (n + '-native.png')).convert('RGBA') for n in ['plate', 'gear', 'hardware']}
assert images['plate'].size == (192, 96)
assert images['gear'].size == (256, 256)
assert images['hardware'].size == (256, 128)
for name, image in images.items():
    assert all(a in (0, 255) for *_, a in image.getdata()), name
    assert all(a or (red == green == blue == 0) for red, green, blue, a in image.getdata()), name
assert images['plate'].getbbox() == (10, 36, 182, 61)
assert r['plate']['physicalWorldBody'] == [344, 48]
assert r['plate']['visualWorldBody'] == [344, 50]
assert r['plate']['pivot'] == [96, 48]
# The entire physical flat deck and underside remain material, with a single bevel overhang.
for x in range(18, 174):
    assert images['plate'].getpixel((x, 36))[3] == 255
    assert images['plate'].getpixel((x, 59))[3] == 255
assert images['plate'].getchannel('A').crop((0, 61, 192, 96)).getbbox() is None
l, t, right, b = images['gear'].getbbox()
assert min(l, t, 256-right, 256-b) >= 8, 'Complete gear must retain transparent margins'
column = images['hardware'].crop((192, 0, 256, 64))
assert column.crop((20, 0, 45, 11)).tobytes() == column.crop((20, 44, 45, 55)).tobytes()
assert all(column.getchannel('A').crop((0, y, 64, y+1)).getbbox() for y in range(55)), 'Connected shaft/caps'
print('Orbit121 native alpha, uniform registration, deck/underside, full gear margins and connected caps pass.')
