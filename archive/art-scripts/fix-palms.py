from pathlib import Path
p=Path('background-depth.js');s=p.read_text(encoding='utf-8-sig').replace('rect(294,110,8,112),rect(322,101,8,122),rect(608,117,7,107)', 'rect(260,133,23,92),rect(297,125,25,100),rect(599,129,30,96)').replace('gold:[rect(565,123,78,70)],','');p.write_text(s,encoding='utf-8')
p=Path('parallax-render.js');s=p.read_text(encoding='utf-8-sig').replace("(scene.restoreFoliage||[]).includes(points)?(r+g+b)/3<105&&r<110", "(scene.restoreFoliage||[]).includes(points)?r<150&&g>b*1.05&&r>b*.9");p.write_text(s,encoding='utf-8')
