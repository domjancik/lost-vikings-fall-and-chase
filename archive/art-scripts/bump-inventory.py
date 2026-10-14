from pathlib import Path
for q in list(Path('.').glob('*.js'))+[Path('index.html')]:
 s=q.read_text(encoding='utf-8-sig');q.write_text(s.replace('shield28','inventory29'),encoding='utf-8')
