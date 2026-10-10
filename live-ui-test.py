from pathlib import Path
p=Path('browser-hud25-interactions.js');s=p.read_text(encoding='utf-8').replace('http://127.0.0.1:3000/?hud=25','https://united-marsh-6ppd.here.now/?hud=25');Path('browser-hud25-live-interactions.js').write_text(s,encoding='utf-8')
