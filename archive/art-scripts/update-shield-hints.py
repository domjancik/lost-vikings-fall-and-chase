from pathlib import Path
p=Path('levels.js');s=p.read_text(encoding='utf-8').replace('under CHARGE','in the falling spark stream').replace('on MIRROR','in Baleog’s arrow path').replace('LEFT at MIRROR','LEFT in the ghost’s path').replace('on DEFLECT','in the dragon’s firing lane');p.write_text(s,encoding='utf-8')
for p in Path('.').glob('*'):
 if p.suffix in ['.js','.html','.css']:
  s=p.read_text(encoding='utf-8-sig').replace('collision23','collision24');p.write_text(s,encoding='utf-8')
