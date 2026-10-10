from pathlib import Path
s=Path('browser-hud25.js').read_text(encoding='utf-8').replace('https://united-marsh-6ppd.here.now/?hud=25','http://127.0.0.1:3000/?hud=25')
Path('browser-hud25-local.js').write_text(s,encoding='utf-8')
