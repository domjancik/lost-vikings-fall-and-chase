"""Pixel-preserving inspection evidence; never rewrites production sources."""
from pathlib import Path
import json
from html import escape
from PIL import Image,ImageDraw
root=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());out=root/'output/imagegen88';out.mkdir(parents=True,exist_ok=True)
board=Image.new('RGBA',(80*16,80*3),(30,36,47,255));gallery=[]
for id,name in enumerate(['erik','baleog','olaf']):
 sheet=Image.open(root/f'assets/vikings88/{name}-native.png').convert('RGBA')
 guide=Image.open(root/f'assets/vikings86-native/{name}-native.png').convert('RGBA')
 data=json.loads((root/f'assets/vikings86-native/{name}-frames.json').read_text())
 assert sheet.size==(640,((len(data['frames'])+7)//8)*80)
 groups={}
 for i,frame in enumerate(data['frames']):
  cell=sheet.crop((i%8*80,i//8*80,i%8*80+80,i//8*80+80))
  groups.setdefault(frame['action'],[]).append(cell)
  if i<8:
   board.alpha_composite(guide.crop((i*64,0,i*64+64,64)),(i*80+8,id*80+8))
   board.alpha_composite(cell,((8+i)*80,id*80))
 for action,cells in groups.items():
  # Coarse NN enlargement allows explicit inspection of all authored clusters.
  frames=[]
  for cell in cells:
   bg=Image.new('RGBA',cell.size,(30,36,47,255));bg.alpha_composite(cell)
   frames.append(bg.resize((480,480),Image.Resampling.NEAREST).convert('RGB'))
  stride={'erik':128,'baleog':112,'olaf':104}[name]
  duration=round(stride/8/{'erik':210,'baleog':164,'olaf':132}[name]*1000) if 'walk' in action else 200
  frames[0].save(out/f'{name}-{action}-6x.gif',save_all=True,append_images=frames[1:],duration=duration,loop=0)
  gallery.append(f'<figure><img src="{name}-{action}-6x.gif"><figcaption>{escape(name)} · {escape(action)}</figcaption></figure>')
 labeled=sheet.copy();draw=ImageDraw.Draw(labeled)
 for i,frame in enumerate(data['frames']):draw.text((i%8*80+1,i//8*80+1),str(i),fill=(255,255,255,255))
 labeled.resize((sheet.width*4,sheet.height*4),Image.Resampling.NEAREST).save(out/f'{name}-full-frame-key.png')
board.save(out/'guide-render-gait-native.png')
board.resize((2560,480),Image.Resampling.NEAREST).save(out/'guide-render-gait-2x.png')
(out/'index.html').write_text('<!doctype html><meta charset="utf-8"><title>Guided Imagegen88 action review</title><style>body{background:#1e242f;color:#ddd;font:16px system-ui;margin:24px}main{display:flex;flex-wrap:wrap;gap:16px}figure{margin:0;width:192px}img{image-rendering:pixelated;width:128px;height:128px}figcaption{font-size:13px}</style><h1>Guided Imagegen88 · full action kit</h1><p>Preview only. Native64cell displayed128pixels; source and real gameplay gates are recorded separately.</p><main>'+''.join(gallery)+'</main>')
print('Full guided88 action GIFs and guide-to-normalized native comparison saved; raw source gate remains separate.')
