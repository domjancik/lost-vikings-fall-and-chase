from pathlib import Path
p=Path('engine.js');s=p.read_text(encoding='utf-8-sig').replace('hp:3,shield:false','hp:3,shield:true,shieldUp:false,shieldPose:.4');p.write_text(s,encoding='utf-8')
p=Path('projectile-collision.js');s=p.read_text(encoding='utf-8').replace('if(input.overhead||input.jump){o.shieldUp=!o.shieldUp;o.shield=true;}\n else if(input.action){o.shield=o.shieldUp||!o.shield;o.shieldUp=false;}', 'o.shield=true;\n if(input.overhead||input.jump)o.shieldUp=true;\n else if(input.action)o.shieldUp=false;');p.write_text(s,encoding='utf-8')
p=Path('hero-geometry.js');s=p.read_text(encoding='utf-8');s='\n'.join(line for line in s.split('\n') if 'if(!h.shield&&!h.shieldUp)' not in line);p.write_text(s,encoding='utf-8')
p=Path('game.js');s=p.read_text(encoding='utf-8').replace('shield:false,ground:true','shield:i===2,shieldUp:false,ground:true');p.write_text(s,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8').replace('Olaf</b> uses D for his forward shield and Space / Shield ↑ for his overhead shield.', 'Olaf</b> always holds his shield. D / Alt puts it in front; Space / Action raises it overhead. Repeated presses keep that pose.');p.write_text(s,encoding='utf-8')
for p in Path('.').glob('*'):
 if p.suffix in ['.js','.html','.css']:
  s=p.read_text(encoding='utf-8-sig').replace('feel27','shield28');p.write_text(s,encoding='utf-8')
