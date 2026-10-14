from pathlib import Path
import re
for name in ['src/core/engine.js','src/campaigns/machines/cycle-campaign.js','src/campaigns/machines/cycle-render.js','src/app/game.js','index.html']:
 p=Path(name);s=p.read_text(encoding='utf-8');s=re.sub(r'((?:clockwork-campaign|clockwork-render|clockwork-view|cycle-campaign|cycle-render|engine|game)\.js\?v=)[\w-]+',r'\g<1>clockwork71',s);p.write_text(s,encoding='utf-8')
