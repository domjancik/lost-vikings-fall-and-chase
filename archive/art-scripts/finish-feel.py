from pathlib import Path
p=Path('engine.js');s=p.read_text(encoding='utf-8').replace('Math.abs(a.x-455)<80','Math.abs(a.x-455)<50');p.write_text(s,encoding='utf-8')
p=Path('campaign.js');s=p.read_text(encoding='utf-8').replace('Math.abs(a.x-x)<80','Math.abs(a.x-x)<50');p.write_text(s,encoding='utf-8')
p=Path('game.js');s=p.read_text(encoding='utf-8').replace("text('▼',h.x,h.y-14", "text('▼',h.x,h.y-(h.shieldUp?48:14)")
s=s.replace("canvas.dataset.environment=JSON.stringify(environmentPose(s));", "canvas.dataset.environment=JSON.stringify(environmentPose(s));canvas.dataset.animations=JSON.stringify(s.heroes.map(h=>({id:h.id,...animationFor(h)})));canvas.dataset.impact=JSON.stringify(s.impact||null);")
s=s.replace("use.classList.toggle('available',!!nearby);", "use.classList.toggle('available',!!nearby);document.querySelector('[data-key=secondary]').classList.toggle('available',s.active===0&&s.heroes[0].ground&&Math.abs(s.heroes[0].vx)>=130);")
p.write_text(s,encoding='utf-8')
p=Path('style.css');s=p.read_text(encoding='utf-8')+'\n[data-key=secondary].available{border-color:#f2cc75;background:#725039;color:#fff1c4}\n';p.write_text(s,encoding='utf-8')
