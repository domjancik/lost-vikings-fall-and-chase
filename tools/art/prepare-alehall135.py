from pathlib import Path
from PIL import Image
import json

root = Path('assets/alehall135')
registration = {'pixel': 2, 'atlases': {}}
for name, size, columns, rows in [('architecture', 256, 4, 4), ('props', 256, 4, 4), ('patrons', 224, 4, 4), ('globe', 96, 2, 2)]:
    source = Image.open(root / (name + '-source.png')).convert('RGBA')
    native = source.resize((size, size), Image.Resampling.NEAREST)
    # Generated transparent margins contain nearly invisible coloured matte.
    # Keep opaque authored pixels unchanged; remove the partial-alpha matte.
    native.putalpha(native.getchannel('A').point(lambda a: 255 if a >= 128 else 0))
    # Transparent generated matte can retain saturated RGB. Clear only fully
    # transparent texels so inspection/export cannot mistake it for material.
    native.putdata([pixel if pixel[3] else (0, 0, 0, 0) for pixel in native.getdata()])
    cell = size // columns
    cells = []
    for n in range(columns * rows):
        left, top = n % columns * cell, n // columns * cell
        frame = native.crop((left, top, left + cell, top + cell))
        mask = frame.getchannel('A').point(lambda a: 255 if a >= 128 else 0)
        bounds = mask.getbbox()
        if name == 'patrons' and bounds:
            # Uniform sheet scale, then translation only. Do not stretch frames.
            shift = 50 - bounds[3]
            placed = Image.new('RGBA', (cell, cell))
            placed.alpha_composite(frame, (0, shift))
            native.paste(placed, (left, top))
            bounds = (bounds[0], bounds[1] + shift, bounds[2], bounds[3] + shift)
        cells.append({'bounds': bounds, 'bottom': bounds[3] if bounds else 0})
    native.save(root / (name + '-native.png'))
    native.resize((size * 3, size * 3), Image.Resampling.NEAREST).save(root / (name + '-native-review.png'))
    registration['atlases'][name] = {'source': name + '-source.png', 'native': [size, size], 'cell': cell, 'columns': columns, 'rows': rows, 'cells': cells}
    print(name, 'native cell', cell, 'opaque heights', [b['bounds'][3]-b['bounds'][1] if b['bounds'] else 0 for b in cells])
# An independently authored icon at its real bag resolution, from the retained
# native sheet (no detector, bilinear filtering, dilation or repeated processing).
props = Image.open(root / 'props-native.png')
bounds = registration['atlases']['props']['cells'][9]['bounds']
icon = Image.new('RGBA', (16, 16))
key = props.crop((64+bounds[0],128+bounds[1],64+bounds[2],128+bounds[3]))
if key.width <= 16 and key.height <= 16:
    icon.alpha_composite(key, ((16-key.width)//2, (16-key.height)//2))
else:
    raise ValueError('Hall key source does not fit its native HUD cell')
icon.save(root / 'key-icon.png')
# First complete cup from cell8; keep its actual8px width rather than clipping
# it to the previous6px study. Three cups fit the48-world-unit shield plane.
props.crop((16, 171, 24, 179)).save(root / 'cup-native.png')
# The opaque coast has its own2:1 native footprint; never force it into an atlas.
Image.open(root / 'coast-source.png').convert('RGB').resize((384, 192), Image.Resampling.NEAREST).save(root / 'coast-native.png')
(root / 'registration.json').write_text(json.dumps(registration, indent=2), encoding='utf-8')
