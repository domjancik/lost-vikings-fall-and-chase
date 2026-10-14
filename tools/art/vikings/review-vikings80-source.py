"""Produce intended-size review views. Not a production conversion pipeline."""
from pathlib import Path
from PIL import Image, ImageDraw
import json

root = Path('assets/vikings80')
for hero in ('erik', 'baleog', 'olaf'):
    source = root / (hero+'-imagegen-raw.png')
    if not source.exists():
        continue
    guide = Image.open(root/(hero+'-guide-native.png')).convert('RGBA')
    raw = Image.open(source).convert('RGBA')
    native = raw.resize(guide.size, Image.Resampling.NEAREST)
    native.save(root/(hero+'-imagegen-native-diagnostic.png'))
    w, h = guide.size
    board = Image.new('RGB', (w*4+24, h*4+72), '#343840')
    draw = ImageDraw.Draw(board)
    draw.text((12,8), 'PROCEDURAL AUTHORITY / native 2x', fill='white')
    draw.text((w*2+12,8), 'GENERATED / intended-size diagnostic 2x (not runtime)', fill='white')
    for x, im in ((12, guide), (w*2+12, native)):
        enlarged = im.resize((w*2,h*2),Image.Resampling.NEAREST)
        board.paste(enlarged,(x,30),enlarged)
    draw.text((12,h*2+42), 'RAW source / no per-frame fitting or pixel-grid rescue', fill='white')
    raw.thumbnail((w*4,h*2),Image.Resampling.NEAREST)
    board.paste(raw,(12,h*2+60),raw)
    board.save(root/(hero+'-imagegen-review.png'))
    print(hero, 'review only:', guide.size)
