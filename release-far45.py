from pathlib import Path
import re
files=re.findall(r"'([^']+\.js)'",Path('build.mjs').read_text())+['index.html']
for name in files:
 p=Path(name);s=p.read_text(encoding='utf-8-sig').replace('.js?v=pipeline44','.js?v=far45');p.write_text(s,encoding='utf-8')
