"""Intended-size diagnostic evidence only; never a production conversion."""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path('assets/vikings81')
for hero, name in [('erik', 'erik-imagegen'), ('erik', 'erik-beard-correction'), ('olaf', 'olaf-imagegen')]:
    raw = Image.open(root / (name + '-raw.png')).convert('RGBA')
    guide = Image.open(root / (hero + '-walk-input-native.png')).convert('RGBA')
    diagnostic = raw.resize(guide.size, Image.Resampling.NEAREST)
    diagnostic.save(root / (name + '-native-diagnostic.png'))
    board = Image.new('RGB', (1048, 600), '#343840')
    draw = ImageDraw.Draw(board)
    draw.text((12, 8), 'Native guide 2x / generated intended-size diagnostic 2x', fill='white')
    for x, im in [(12, guide), (536, diagnostic)]:
        large = im.resize((512, 256), Image.Resampling.NEAREST)
        board.paste(large, (x, 30), large)
    draw.text((12, 300), 'Retained raw source preview. Diagnostic resize is NOT approved runtime art.', fill='white')
    raw.thumbnail((1024, 256), Image.Resampling.NEAREST)
    board.paste(raw, (12, 326), raw)
    board.save(root / (name + '-source-review.png'))
    print(name, 'source vs native review created')
