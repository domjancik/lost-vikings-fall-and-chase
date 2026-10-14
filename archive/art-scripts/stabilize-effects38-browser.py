from pathlib import Path
for f in ['browser-effects38.js','browser-effects38-live.js']:
 p=Path(f);s=p.read_text(encoding='utf-8-sig');s=s.replace("await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.backgroundEffects||'{}').ready);", "await page.waitForFunction(round=>{const el=document.querySelector('#game'),fx=JSON.parse(el.dataset.backgroundEffects||'{}'),bg=JSON.parse(el.dataset.background||'{}'),layers=JSON.parse(el.dataset.parallax||'[]');return bg.round===round&&fx.ready&&fx.poses?.length&&layers[0]?.ready;},round);")
 s=s.replace("await page.waitForTimeout(250);const b=await read();if(!a.poses.length||!a.poses.some((p,i)=>p.frame!==b.poses[i].frame))throw Error('Frozen effects '+round);", "await page.waitForFunction(frames=>{const p=JSON.parse(document.querySelector('#game').dataset.backgroundEffects).poses;return p.some((v,i)=>v.frame!==frames[i]);},a.poses.map(p=>p.frame),{timeout:3000});const b=await read();")
 p.write_text(s,encoding='utf-8')
