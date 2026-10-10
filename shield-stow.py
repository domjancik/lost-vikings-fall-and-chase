from pathlib import Path
p=Path('hero-geometry.js');s=p.read_text(encoding='utf-8');s=s.replace(" const t=transition?", " if(!h.shield&&!h.shieldUp){const u=transition?Math.max(0,Math.min(1,frame/6/.4)):0;return {width:SHIELD.width,height:SHIELD.height,x:snapPixel(-24+52*u),y:20,angle:snapAngle(Math.PI/12*(1-u))};}\n const t=transition?");p.write_text(s,encoding='utf-8')
