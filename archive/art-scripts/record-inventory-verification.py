from pathlib import Path
q=Path('browser-inventory29-death-mobile.js');s=q.read_text(encoding='utf-8').replace('http://127.0.0.1:3000/?inventory=29','https://united-marsh-6ppd.here.now/?inventory=29').replace("await page.locator('#use-item').click({trial:true}).catch(()=>{});",'');Path('browser-inventory29-live.js').write_text(s,encoding='utf-8')
Path('output/playwright/inventory29-verification.md').write_text('''# Inventory and survival build 29

- 97 automated tests pass; static build passes.
- All nine levels cleared with normal movement/action/use controls in browser, all Vikings alive.
- The six existing routes finish with health [3,3,3] on the new lethal-damage build.
- New kitchen route tested ingredient pickup, nearby transfer, mixing, oven heat, ticket collection/use, and crew exit.
- Museum route tested UV lamp, red lens, high/low angle, blue lens swap with old lens returned, pendulum motor cut, crew exit.
- Heist route tested renewable bombs, live fuse, blast/retreat, gate destruction, upper safe, key pickup, exit unlock, crew exit.
- New routes also clear at 60 and 120 Hz in simulation.
- Lethal bomb death leaves Erik at zero health, ends play, shows retry; retry resets health and puzzle.
- Inventory tested in portrait 390x844, 320x568, landscape 844x390. Four slots, drop, give, item use, close, and fullscreen access.
- Recovery tests cover full recipient bags, wrong oven heat preserving dough, recoverable dropped lenses, dispenser capacity, invulnerability, fatal voids, and real hostile projectile damage.
- Generated three scene backgrounds and sixteen item/object sprites with imagegen, normalized using Retro-Diffusion/pixel-art-fixer.
- Deployed JS and PNG bytes match the tested dist build; hosted HTML has inventory29 revision and nine-level menus.

Published: https://united-marsh-6ppd.here.now/?inventory=29
''',encoding='utf-8')
