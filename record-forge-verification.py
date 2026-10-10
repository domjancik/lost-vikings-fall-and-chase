from pathlib import Path
s=Path('browser-forge31.js').read_text(encoding='utf-8').replace('http://127.0.0.1:3000/?forge=31','https://united-marsh-6ppd.here.now/?forge=31');Path('browser-forge31-live.js').write_text(s,encoding='utf-8')
Path('output/playwright/forge31-verification.md').write_text('''# Dragon Forge material animation — build 31

102 tests pass; static build passes.
Normal-control Dragon Forge browser playthrough captured cut, falling basket, pouring ore, loaded crucible and completed the puzzle with health [3,3,3].
Ore stays visible and responds to forged flame impact. Reflected fire cannot consume pressure before ore arrives. Animation uses 12 fps, 2-unit position grid and 5-degree rotation steps. Repeated sword hits do not reset transfer.
Sprites are sliced from the existing puzzle machines sheet; release chain, basket and ore animate separately.
Live: https://united-marsh-6ppd.here.now/?forge=31
''',encoding='utf-8')
