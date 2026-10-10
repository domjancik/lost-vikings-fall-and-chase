from pathlib import Path
for stem in ['bankshot','survey']:
 s=Path('browser-ground32-'+stem+'.js').read_text(encoding='utf-8').replace('http://127.0.0.1:3000/?ground=32','https://united-marsh-6ppd.here.now/?ground=32');Path('browser-ground32-live-'+stem+'.js').write_text(s,encoding='utf-8')
Path('output/playwright/ground32-verification.md').write_text('''# Grounded parallax and plunger — build 32

106 tests pass; static build passes.
Background atlas alpha bottoms are [211,211,211,210,211,211] within 240px cells. Transparent bottom padding is cropped; structural parallax layers end at world floor 610 and move vertically with the floor, while horizontal depth remains independent.
Browser survey checked six themed atlas scenes at both zoom modes, jump camera movement, and portrait 390x844. Every structural base remained at 610.
Normal-control pinball route captured compressed and releasing plunger, then completed all three bank shots and cleared with health [3,3,3]. Compression interpolates, launch extends the spring, recoil settles in quantized animation frames. Only grounded contact triggers boost.
Published: https://united-marsh-6ppd.here.now/?ground=32
''',encoding='utf-8')
