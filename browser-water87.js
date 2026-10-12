async page=>{
 const errors=[],evidence={};page.on('pageerror',e=>errors.push(String(e)));await page.setViewportSize({width:1440,height:900});
 await page.locator('#play-water').click();if((await page.locator('#zoom').textContent()).startsWith('1'))await page.locator('#zoom').click();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 const state=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,won:c.dataset.won==='true',failed:c.dataset.failed==='true',art:JSON.parse(c.dataset.cycleArt),time:+c.dataset.simTime}));
 const held=new Set();const keys=async names=>{for(const key of [...held])if(!names.includes(key)){await page.keyboard.up(key);held.delete(key);}for(const key of names)if(!held.has(key)){await page.keyboard.down(key);held.add(key);}};
 const tap=async key=>{await keys([]);await page.keyboard.press(key);await page.waitForTimeout(50);};
 const wait=async(ms)=>{await keys([]);await page.waitForTimeout(ms);};
 const shot=async name=>{await page.screenshot({path:'output/playwright/water87-'+name+'.png'});evidence[name]=await state();};
 const until=async(cond,input=()=>[],timeout=40000)=>{const start=Date.now();while(Date.now()-start<timeout){const s=await state();if(s.failed)throw Error('Drowned '+JSON.stringify(s));if(cond(s)){await keys([]);return;}await keys(input(s));await page.waitForTimeout(25);}throw Error('Timeout '+JSON.stringify(await state()));};
 const move=async(id,x)=>{await tap(String(id+1));await until(s=>s.won||Math.abs(s.heroes[id].x-x)<5&&Math.abs(s.heroes[id].vx)<16,s=>{const h=s.heroes[id],d=x-h.x-h.vx*Math.abs(h.vx)/3000;return Math.abs(d)<3?[]:[d>0?'ArrowRight':'ArrowLeft'];});await wait(150);};
 const swim=async(x,y)=>{await tap('1');await until(s=>Math.abs(s.heroes[0].x-x)<5&&Math.abs(s.heroes[0].y-y)<5&&Math.abs(s.heroes[0].vx)<18&&Math.abs(s.heroes[0].vy)<30,s=>{const h=s.heroes[0],dx=x-h.x-h.vx*Math.abs(h.vx)/1300,v=h.vy,dy=y-h.y-v*Math.abs(v)/1200;return [dx<-3?'ArrowLeft':dx>3?'ArrowRight':null,dy<-3?'ArrowUp':dy>3?'ArrowDown':null].filter(Boolean);});};
 const climb=async(id,x,feet)=>{await move(id,x);await until(s=>Math.abs(s.heroes[id].y+44-feet)<2,s=>[feet<s.heroes[id].y+44?'ArrowUp':'ArrowDown']);await wait(50);};
 await shot('initial-2x');await page.locator('#zoom').click();await shot('initial-1x');await page.locator('#zoom').click();
 await tap('3');await tap('Space');await move(2,710);await shot('shield-intake');
 await swim(640,880);await swim(820,880);await swim(940,856);await swim(1100,856);await shot('valve-before');await page.locator('#zoom').click();await wait(150);await shot('gate-before-visible');await tap('e');await wait(450);await shot('gate-middle-visible');await until(s=>s.machine.valvePose===1);await shot('gate-open-visible');await page.locator('#zoom').click();await shot('valve-after');await swim(940,856);
 await tap('3');await move(2,2080);await climb(2,2080,900);await shot('olaf-deep-before-release');const buoyancy=[];await keys(['ArrowLeft']);for(let k=0;k<30;k++){await page.waitForTimeout(50);const b=await state();buoyancy.push({time:b.time,y:b.heroes[2].y,vy:b.heroes[2].vy});if(k===2||k===14||k===29)await shot('olaf-rise-'+k);}await keys([]);await move(2,880);await tap('d');await move(2,1522);await until(s=>Math.abs(s.machine.float.vx)<1);await shot('air-towed');
 await move(1,950);await climb(1,950,900);await wait(2000);await shot('fixed-air');await climb(1,950,1000);await move(1,1660);await shot('chain-before');await tap('Space');await wait(350);await shot('chain-cut');await tap('e');await until(s=>s.machine.wound>=.5,()=>['ArrowRight'],7000);await tap('e');await wait(300);await shot('crank-half');await page.locator('#zoom').click();await wait(100);await shot('crank-half-1x');await page.locator('#zoom').click();await page.setViewportSize({width:844,height:390});await wait(100);await shot('crank-half-mobile');await page.setViewportSize({width:1440,height:900});await wait(100);await tap('e');await until(s=>s.machine.wound===1,()=>['ArrowRight'],7000);await tap('e');await shot('crank-complete');await until(s=>s.machine.waterY>=730,()=>[],15000);await shot('berth-approach');await until(s=>s.machine.waterY>=770,()=>[],4000);await shot('berth-contact');await until(s=>s.machine.waterY>=820,()=>[],4000);await shot('drain-middle');await until(s=>s.machine.waterY===950,()=>[],15000);await shot('drained');
 await tap('3');await tap('Space');await move(2,2080);await climb(2,2080,540);await move(2,2300);
 await move(1,2080);await climb(1,2080,540);await move(1,2300);
 await climb(0,950,1000);await move(0,2080);await climb(0,2080,540);await shot('right-dock-before-exit');await move(0,2300);await until(s=>s.won);await shot('all-exit');
 const result=await state();await wait(2200);await tap('Enter');if((await state()).won)throw Error('Continue failed');
 await page.locator('#restart').click();await page.setViewportSize({width:844,height:390});await page.locator('#rounds').click();await page.locator('.round-option[data-round="4"]').click();await wait(500);if((await page.locator('#zoom').textContent()).startsWith('1'))await page.locator('#zoom').click();await shot('mobile-2x');await page.locator('#zoom').click();await shot('mobile-1x');
 if(errors.length)throw Error(errors.join(';'));return {won:result.won,hp:result.heroes.map(h=>h.hp),time:result.time,grounding:result.art.placements,buoyancy,evidence,errors};
}







