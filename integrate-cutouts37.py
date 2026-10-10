from pathlib import Path
p=Path('publish-update.mjs');s=p.read_text(encoding='utf-8-sig').replace("'assets/pixel/depth-far-0.png'",','.join("'assets/pixel/depth-near-%d.png'"%i for i in range(9))+",'assets/pixel/depth-far-0.png'");p.write_text(s,encoding='utf-8')
for p in list(Path('.').glob('*.js'))+[Path('index.html')]:
 s=p.read_text(encoding='utf-8-sig');p.write_text(s.replace('baghud36','cutouts37'),encoding='utf-8')
