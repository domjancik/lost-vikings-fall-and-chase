from pathlib import Path
s=Path('browser-portal30-space.js').read_text(encoding='utf-8').replace('width:1440,height:900','width:390,height:844').replace('portal30-tunnel.png','portal30-mobile-tunnel.png');Path('browser-portal30-mobile.js').write_text(s,encoding='utf-8')
