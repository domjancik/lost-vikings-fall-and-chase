from pathlib import Path
q=Path('browser-portal30-interior.js');s=q.read_text(encoding='utf-8').replace('http://127.0.0.1:3000/?portal=30','https://united-marsh-6ppd.here.now/?portal=30');Path('browser-portal30-live.js').write_text(s,encoding='utf-8')
Path('verify-portal-live.mjs').write_text('''import fs from 'node:fs/promises';for(const f of ['game.js','portal-effects.js','world-render.js','style.css']){const r=await fetch('https://united-marsh-6ppd.here.now/'+f+'?portal=30');if(!r.ok||!Buffer.from(await r.arrayBuffer()).equals(await fs.readFile('dist/'+f)))throw Error('Live mismatch '+f);console.log('Verified '+f);}''',encoding='utf-8')
Path('output/playwright/portal30-verification.md').write_text('''# Portal build 30

99 automated tests pass; build passes.
Portal interior animation is clipped within fixed sprite frames and updates at 12 fps on the world pixel raster. Browser pixel samples differ across frames.
Normal-control pub route completed, then Enter continued to Cargo.
Normal-control heist route completed, expanding vortex/tunnel rendered before win UI, premature Enter ignored, Space continued to pub without leaking jump input.
Same transition verified at 390x844; holding Space and keyboard repeat did not trigger a next-level jump.
Screenshots: portal30-tunnel.png, portal30-mobile-tunnel.png, portal30-interior.png.
Deployed: https://united-marsh-6ppd.here.now/?portal=30
''',encoding='utf-8')
