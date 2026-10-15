"""Single uniform normalization of reviewed sources; native parts assembled by translation."""
from pathlib import Path
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'assets/orbit121'

def opaque(image):
    image.putalpha(image.getchannel('A').point(lambda a: 255 if a >= 128 else 0))
    # Some generator previews carry saturated RGB in fully transparent edge pixels.
    # Clear hidden RGB too, so downstream sampling cannot leak the matte color.
    px = image.load()
    for y in range(image.height):
        for x in range(image.width):
            if not px[x, y][3]:
                px[x, y] = (0, 0, 0, 0)
    return image

plate_source = Image.open(OUT / 'plate-raw-v4.png').convert('RGBA')
box = plate_source.getchannel('A').point(lambda a: 255 if a >= 220 else 0).getbbox()
scale = 172 / (box[2] - box[0])
size = (172, round((box[3] - box[1]) * scale))
assert size == (172, 25), size
plate = Image.new('RGBA', (192, 96))
plate.alpha_composite(opaque(plate_source.crop(box).resize(size, Image.Resampling.NEAREST)), (10, 36))

gear = opaque(Image.open(OUT / 'gear-raw-v4.png').convert('RGBA').resize((256, 256), Image.Resampling.NEAREST))
hardware = opaque(Image.open(OUT / 'hardware-raw-v2.png').convert('RGBA').resize((256, 128), Image.Resampling.NEAREST))
# Discard the clipped upper column cap. Both endpoints use the complete lower cap.
# Native source crops are assembled without stretching; shaft and cap remain separate.
column = Image.new('RGBA', (64, 64))
column.alpha_composite(hardware.crop((192 + 24, 11, 192 + 41, 44)), (24, 11))
cap = hardware.crop((192 + 20, 44, 192 + 45, 56))
column.alpha_composite(cap, (20, 0))
column.alpha_composite(cap, (20, 44))
hardware.paste(column, (192, 0))

for name, image in [('plate', plate), ('gear', gear), ('hardware', hardware)]:
    image.save(OUT / (name + '-native.png'))
    image.resize((image.width * 4, image.height * 4), Image.Resampling.NEAREST).save(OUT / (name + '-native-4x.png'))

registration = {
    'method': 'original source once; uniform nearest normalization; binary material alpha; translation-only part assembly',
    'plate': {'source': 'plate-raw-v4.png', 'sourceMaterialBox': box, 'uniformScale': scale,
              'nativeCanvas': [192, 96], 'opaqueBody': list(size), 'paste': [10, 36], 'pivot': [96, 48],
              'alphaBox': plate.getbbox(), 'physicalWorldBody': [344, 48], 'visualWorldBody': [344, 50],
              'note': 'One native row of decorative lower bevel below the unchanged collision underside; no axis stretch.'},
    'gear': {'source': 'gear-raw-v4.png', 'nativeCanvas': [256, 256], 'pivot': [128, 128], 'worldCanvas': [512, 512], 'alphaBox': gear.getbbox()},
    'hardware': {'source': 'hardware-raw-v2.png', 'nativeCanvas': [256, 128], 'cell': [64, 64],
                 'column': 'Clipped upper cap excluded; intact lower cap translated to both ends, shaft retained.',
                 'cellAlphaBoxes': [hardware.crop((n % 4 * 64, n // 4 * 64, n % 4 * 64 + 64, n // 4 * 64 + 64)).getbbox() for n in range(8)]}
}
(OUT / 'registration.json').write_text(json.dumps(registration, indent=2) + '\n', encoding='utf8')
print(json.dumps(registration, indent=2))
