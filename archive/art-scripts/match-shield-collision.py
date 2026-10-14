from pathlib import Path
p=Path('projectile-collision.js');s=p.read_text(encoding='utf-8').replace('{x:o.face===1?13:-19,y:-4,w:6,h:52}','{x:o.face===1?14:-42,y:-4,w:SHIELD.width,h:SHIELD.height}');p.write_text(s,encoding='utf-8')
p=Path('world-render.js');s=p.read_text(encoding='utf-8').replace('s.heroes[2].x-15','s.heroes[2].x-42');p.write_text(s,encoding='utf-8')
