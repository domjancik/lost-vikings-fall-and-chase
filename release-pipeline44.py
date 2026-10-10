from pathlib import Path
import re
files=re.findall(r"'([^']+\.js)'",Path('build.mjs').read_text())+['index.html','style.css']
for name in files:
 p=Path(name);s=p.read_text(encoding='utf-8-sig').replace('v=grid43','v=pipeline44')
 if name.endswith('.js') and name!='background-depth.js':s=re.sub(r'\.png(?=[\'"`])','.png?v=pipeline44',s)
 if name=='parallax-render.js':s=s.replace('far.src=scene.farSource;near.src=scene.nearSource;',"far.src=scene.farSource+'?v=pipeline44';near.src=scene.nearSource+'?v=pipeline44';")
 p.write_text(s,encoding='utf-8')
p=Path('browser-observatory-artifact.js');s=p.read_text(encoding='utf-8-sig').replace('observatory-artifact-zoom-','observatory-fixed44-zoom-');Path('browser-observatory-fixed44.js').write_text(s,encoding='utf-8')
