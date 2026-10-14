from pathlib import Path
from PIL import Image,ImageDraw
import subprocess
for n in [0,5,6]:
 im=Image.open(f'assets/campaign46/scene-{n}.png').convert('RGBA');Path(f'output/scene67-source-{n}.rgba').write_bytes(im.tobytes())
subprocess.run(['node','tools/art/scene/compare-scene67.mjs'],check=True)
for n in [0,5,6]:
 a=Image.frombytes('RGBA',(375,250),Path(f'output/scene67-before-{n}.rgba').read_bytes());b=Image.frombytes('RGBA',(375,250),Path(f'output/scene67-after-{n}.rgba').read_bytes());c=Image.new('RGB',(1500,550),'#17212b');g=ImageDraw.Draw(c);g.text((10,8),'BEFORE: unguarded center-weighted average',(240,230,210));g.text((760,8),'AFTER: center-color contrast guard48',(240,230,210));c.paste(a.resize((750,500),Image.Resampling.NEAREST),(0,30));c.paste(b.resize((750,500),Image.Resampling.NEAREST),(750,30));c.save(f'output/playwright/scene67-compare-{n}.png')
