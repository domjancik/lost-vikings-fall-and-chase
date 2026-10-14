from pathlib import Path
p=Path('audio-events.js');s=p.read_text(encoding='utf-8-sig');s=s.replace("if(g[key]!==p.g[key]&&g[key]!==undefined)add", "if(g[key]!==p.g[key]&&g[key]!==undefined&&(key!=='air'||g[key]>p.g[key]))add")
s=s.replace("Math.abs(old.ref.y-o.y)<65)add", "Math.abs(old.ref.y-o.y)<65&&!heroes.some(h=>h.hp<p.heroes[h.id].hp))add")
p.write_text(s,encoding='utf-8')
