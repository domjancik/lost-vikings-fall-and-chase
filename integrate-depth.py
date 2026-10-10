from pathlib import Path
for f in ['build.mjs','publish-update.mjs']:
 p=Path(f);s=p.read_text(encoding='utf-8-sig').replace("'parallax-render.js'", "'parallax-render.js','background-depth.js'");
 if f=='publish-update.mjs':s=s.replace("'assets/pixel/inventory-sprites.png'",','.join("'assets/pixel/depth-far-%d.png'"%i for i in range(9))+",'assets/pixel/inventory-sprites.png'")
 p.write_text(s,encoding='utf-8')
for p in list(Path('.').glob('*.js'))+[Path('index.html')]:
 s=p.read_text(encoding='utf-8-sig');p.write_text(s.replace('sfx34','depth35'),encoding='utf-8')
