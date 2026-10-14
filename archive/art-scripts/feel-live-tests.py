from pathlib import Path
for stem in ['browser-feel26','browser-feel26-bash']:
 s=Path(stem+'.js').read_text(encoding='utf-8').replace('http://127.0.0.1:3000/?feel=26','https://united-marsh-6ppd.here.now/?feel=26');Path(stem+'-live.js').write_text(s,encoding='utf-8')
