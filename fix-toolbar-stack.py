from pathlib import Path
p=Path('style.css');s=p.read_text(encoding='utf-8')+'\n.game-top{z-index:20}\n';p.write_text(s,encoding='utf-8')
for p in Path('.').glob('*'):
 if p.suffix in ['.js','.html','.css']:
  s=p.read_text(encoding='utf-8-sig').replace('feel26','feel27');p.write_text(s,encoding='utf-8')
