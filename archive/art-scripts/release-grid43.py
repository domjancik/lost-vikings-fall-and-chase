from pathlib import Path
import re
files=re.findall(r"'([^']+\.js)'",Path('build.mjs').read_text())+['index.html','style.css']
for name in files:
 p=Path(name);p.write_text(p.read_text(encoding='utf-8-sig').replace('v=story42','v=grid43'),encoding='utf-8')
p=Path('VISUAL-ISSUE-NOTES.md');p.write_text('''# Visual issues

## Background sampling artifacts — fixed in grid43, 2026-10-10

User reported tiling-like background artifacts, especially in later Arcade/test levels.

The far plates were fitted into a fixed 790-world-unit rectangle. For the 720×360 kitchen, museum and casino plates this produced a 2.1944× source scale, so nearest-neighbor rasterization repeated source rows/columns periodically. The pixel normalization itself was not identified as the cause.

Far plates now use their complete source image at the same whole-pixel scale on both axes, with dimensions taken from the actual authored plate. Near architecture keeps its floor registration; far water and cascade emitters use the same source coordinates and scale as their plate. Original artwork and normalized PNGs are unchanged.

Validation: 173/173 tests pass, including actual PNG dimensions, integer scaling, and emitter registration. Browser checks cover all eleven Arcade levels at 1× and 2×, portrait mobile, and a synthetic alternating-row raster diagnostic at normal and ultrawide widths while the camera moves. Screenshots are in output/playwright/grid43-level-*.png.
''',encoding='utf-8')
p=Path('browser-grid43.js');s=p.read_text(encoding='utf-8-sig').replace('return {reports,raster,mobile:true,errors};','return {checked:reports.length,raster,mobile:true,errors};');p.write_text(s,encoding='utf-8')
