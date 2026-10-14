"""Normalize the retained native-density source once; translate fixed bases."""
from PIL import Image
from pathlib import Path
import json

folder = Path('assets/warden91')
source = Image.open(folder / 'plunger-raw-v1.png').convert('RGBA')
# The approved source uses approximately eight-file-pixel native clusters.
# Preserve uniform scale, including blank canvas; never fit each alpha box.
scaled = source.resize((248, 99), Image.Resampling.NEAREST)
sheet = Image.new('RGBA', (320, 64))
records = []
for index in range(4):
    cell = scaled.crop((index * 62, 0, (index + 1) * 62, 99))
    pixels = cell.load()
    for y in range(99):
        for x in range(62):
            r, g, b, alpha = pixels[x, y]
            pixels[x, y] = (r, g, b, 255) if alpha >= 128 else (0, 0, 0, 0)
    rows = []
    for y in range(99):
        xs = [x for x in range(62) if pixels[x, y][3]
              and pixels[x, y][1] > pixels[x, y][0] * 1.15]
        if len(xs) > 20:
            rows.append((y, min(xs), max(xs)))
    if not rows:
        raise ValueError('No broad steel foundation in frame ' + str(index))
    bottom = max(y for y, left, right in rows)
    base = [row for row in rows if row[0] >= bottom - 3]
    right = max(row[2] for row in base)
    dx, dy = 76 - right, 50 - bottom
    sheet.alpha_composite(cell, (index * 80 + dx, dy))
    records.append(dict(cell=index, baseRight=right, baseBottom=bottom,
                        translation=[dx, dy]))
sheet.save(folder / 'plunger-native.png')
sheet.resize((1280, 256), Image.Resampling.NEAREST).save(folder / 'plunger-native-4x.png')
(folder / 'registration.json').write_text(json.dumps(dict(
    nativeCell=[80, 64], worldPixel=2, sourceScale=8, base=[76, 50],
    frames=records, sourceGate='pending', runtimeGate='pending'), indent=2))

# Separate small emitter: the native-density guide is32square, not a large head.
emitter = Image.open(folder / 'emitter-raw-v2.png').convert('RGBA')
emitter = emitter.resize((32, 32), Image.Resampling.NEAREST)
pixels = emitter.load()
for y in range(32):
    for x in range(32):
        r, g, b, alpha = pixels[x, y]
        pixels[x, y] = (r, g, b, 255) if alpha >= 128 else (0, 0, 0, 0)
registered = Image.new('RGBA', (32, 32))
registered.alpha_composite(emitter, (0, 1))
registered.save(folder / 'emitter-native.png')
registered.resize((512, 512), Image.Resampling.NEAREST).save(folder / 'emitter-native-16x.png')
