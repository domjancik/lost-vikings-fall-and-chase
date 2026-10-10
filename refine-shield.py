from pathlib import Path
p=Path('engine.js');s=p.read_text(encoding='utf-8')
a=s.index('  if(solid&&');b=s.index("  if(p.kind==='arrow'",a)
s=s[:a]+'''  const body=p.kind==='bolt'?s.heroes.map(h=>({h,hit:segmentHit(px,py,p.x,p.y,{x:h.x-16,y:h.y,w:32,h:44})})).filter(e=>e.hit).sort((a,b)=>a.hit.t-b.hit.t)[0]:null;
  const obstacleTime=Math.min(solid?.t??Infinity,shield?.t??Infinity);
  if(body&&body.hit.t<obstacleTime){const h=body.h;p.dead=true;if(s.hurt===0){h.hp=Math.max(1,h.hp-1);h.x=Math.max(20,h.x-35);s.hurt=.9;}continue;}
  if(solid||shield){p.dead=true;continue;}
''' +s[b:]
a=s.index("  if(p.kind==='bolt'){");b=s.index('\n }\n s.shots=',a);s=s[:a]+s[b:]
p.write_text(s,encoding='utf-8')
for p in Path('.').glob('*'):
 if p.suffix in ['.js','.html','.css']:
  s=p.read_text(encoding='utf-8-sig').replace('collision22','collision23');p.write_text(s,encoding='utf-8')
