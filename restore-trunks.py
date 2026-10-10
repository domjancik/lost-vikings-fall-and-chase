from pathlib import Path
p=Path('parallax-render.js');s=p.read_text(encoding='utf-8-sig').replace('?r<150&&g>b*1.05&&r>b*.9', '?(r+g+b)/3<105&&r<140');p.write_text(s,encoding='utf-8')
