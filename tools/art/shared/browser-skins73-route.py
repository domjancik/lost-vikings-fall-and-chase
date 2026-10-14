from pathlib import Path
p=Path('archive/browser/browser-clockwork71.js').read_text(encoding='utf-8').replace('3018','3020').replace('clockwork71-','skins73-route-')
Path('archive/browser/browser-skins73-route.js').write_text(p,encoding='utf-8')
