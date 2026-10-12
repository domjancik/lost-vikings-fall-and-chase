from pathlib import Path
p=Path('browser-momentum72.js').read_text(encoding='utf-8')
p=p.replace("await capture('safety-before');await tick({interact:true});await capture('safety-after');", "await until(()=>read().machine.fireClock%2.8<.1,()=>({}),3,'live fireball');await capture('safety-before');const before=read().art.fireballs;if(!before.length)throw Error('No launched shot');await tick({interact:true});await capture('safety-after');const after=read().art.fireballs;if(!after.length)throw Error('Safety deleted launched shots');await tick({},.5);await capture('safety-travel');const travel=read().art.fireballs;if(!travel.length)throw Error('Shot did not continue');return{before,after,travel,safety:read().machine.safety};")
p=p.replace("await page.waitForFunction(()=>!document.querySelector('#win').hidden);await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('#game').dataset.won==='false');",'')
p=p[:p.index('  await move(0,2940)')]+p[p.index(' });',p.index('  await move(0,2940)')):]
p=p.replace('result,enterContinues:true,errors','result,errors')
Path('browser-momentum72-safety.js').write_text(p,encoding='utf-8')
