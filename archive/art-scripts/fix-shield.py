from pathlib import Path
p=Path('engine.js');s=p.read_text(encoding='utf-8')
s="import {shieldControls,shieldHit,segmentHit} from './projectile-collision.js?v=explore21';\n"+s
s=s.replace('if(s.active===2&&(input.overhead||input.jump)){overhead.shieldUp=!overhead.shieldUp;overhead.shield=true;}','if(s.active===2)shieldControls(overhead,input);')
s=s.replace("if(input.action&&s.cooldown===0){s.cooldown=.35;if(a.id===2){a.shield=!a.shield;a.shieldUp=false;}if(a.id===1)","if(input.action&&a.id===1&&s.cooldown===0){s.cooldown=.35;if(a.id===1)")
s=s.replace('o.shield&&o.face===1&&o.x>1090&&o.x<1180&&o.y>530','o.shield&&!o.shieldUp&&o.face===1&&o.x<1180&&Math.abs(o.y+20-586)<26')
s=s.replace('olaf.x>1090&&olaf.x<1180&&olaf.y>530&&olaf.y<580','olaf.x<1180&&Math.abs(olaf.y+20-586)<26')
a=s.index(' for(const p of s.shots)');b=s.index('\n s.won=',a)
s=s[:a]+''' for(const p of s.shots){
  const px=p.x,py=p.y;p.x+=p.v*dt;p.y+=(p.vy||0)*dt;
  const solids=[...(s.crate?[{x:440,y:510,w:34,h:100}]:[]),...(!s.power?[{x:650,y:510,w:22,h:100}]:[])];
  const solid=solids.map(box=>segmentHit(px,py,p.x,p.y,box)).filter(Boolean).sort((a,b)=>a.t-b.t)[0];
  const shield=['bolt','drop','arrow'].includes(p.kind)?shieldHit(olaf,p,px,py):null;
  if(solid&&(!shield||solid.t<=shield.t)){p.dead=true;continue;}
  if(shield){p.dead=true;continue;}
  if(p.kind==='arrow'&&s.turret&&segmentHit(px,py,p.x,p.y,{x:1180,y:550,w:40,h:60})){if(s.grounded)s.turret=false;p.dead=true;}
  if(p.kind==='bolt'){
   const hits=s.heroes.map(h=>({h,hit:segmentHit(px,py,p.x,p.y,{x:h.x-23,y:h.y,w:46,h:46})})).filter(e=>e.hit).sort((a,b)=>a.hit.t-b.hit.t);
   if(hits.length){const h=hits[0].h;p.dead=true;if(s.hurt===0){h.hp=Math.max(1,h.hp-1);h.x=Math.max(20,h.x-35);s.hurt=.9;}}
  }
 }
 s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<W&&p.y<655);''' +s[b:]
p.write_text(s,encoding='utf-8')
p=Path('campaign.js');s=p.read_text(encoding='utf-8');s="import {shieldHit} from './projectile-collision.js?v=explore21';\n"+s
s=s.replace(' if(input.action&&a.id===2&&s.cooldown===0){s.cooldown=.25;a.shield=!a.shield;a.shieldUp=false;}\n','')
s=s.replace('  if(o.shield&&!o.shieldUp&&o.face===-1&&on(o,720))g.mirrorTime+=dt;else g.mirrorTime=0;','')
s=s.replace("  if(m==='cargo'&&p.kind==='arrow'", "  const shield=shieldHit(o,p,px,py);\n  if(m==='cargo'&&p.kind==='arrow'")
s=s.replace("p.kind==='arrow'&&p.v>0&&px<o.x-15&&p.x>=o.x-15&&o.shield&&!o.shieldUp&&o.face===-1&&on(o,650)&&Math.abs(p.y-586)<28", "p.kind==='arrow'&&shield&&!o.shieldUp&&o.face===-1&&o.x<870")
s=s.replace("g.lastReflection={x:o.x-15,y:p.y,time:s.time};p.kind='bank';p.lane=g.lane;p.x=o.x-15;", "g.lastReflection={x:shield.x,y:shield.y,time:s.time};p.kind='bank';p.lane=g.lane;p.x=shield.x;p.y=shield.y;")
s=s.replace("if(p.kind==='spark'&&o.shieldUp&&Math.abs(p.x-o.x)<40&&py<o.y&&p.y>=o.y-10)p.dead=true;", "if(p.kind==='spark'&&shield)p.dead=true;")
s=s.replace("!p.dead&&p.kind==='ghost'&&o.shield&&!o.shieldUp&&o.face===-1&&Math.abs(p.x-o.x)<35&&Math.abs(p.y-o.y-20)<30", "!p.dead&&p.kind==='ghost'&&shield&&!o.shieldUp")
s=s.replace("if(p.kind==='fire'&&o.shield&&!o.shieldUp&&o.face===1&&Math.abs(p.x-o.x)<35&&on(o,780,566,44)){p.kind='forge-fire';p.v=360;p.vy=(490-p.y)*360/(1000-p.x);}", "if(p.kind==='fire'&&shield&&!o.shieldUp&&o.face===1&&o.x<980){p.kind='forge-fire';p.x=shield.x;p.y=shield.y;p.v=360;p.vy=(490-p.y)*360/(1000-p.x);}\n  if(shield&&['arrow','ghost','fire'].includes(p.kind))p.dead=true;")
p.write_text(s,encoding='utf-8')
for name in ['build.mjs','publish-update.mjs']:
 p=Path(name);s=p.read_text(encoding='utf-8').replace("'engine.js',","'engine.js','projectile-collision.js',");p.write_text(s,encoding='utf-8')
