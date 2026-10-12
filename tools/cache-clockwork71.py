from pathlib import Path
import re
for name in ['engine.js','cycle-campaign.js','cycle-render.js','game.js','index.html']:
 p=Path(name);s=p.read_text(encoding='utf-8');s=re.sub(r'((?:clockwork-campaign|clockwork-render|clockwork-view|cycle-campaign|cycle-render|engine|game)\.js\?v=)[\w-]+',r'\g<1>clockwork71',s);p.write_text(s,encoding='utf-8')
