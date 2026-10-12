async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.setViewportSize({width:1440,height:900});
 await page.locator('#play-water').click();if((await page.locator('#zoom').textContent()).startsWith('1'))await page.locator('#zoom').click();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 const state=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,won:c.dataset.won==='true',failed:c.dataset.failed==='true',art:JSON.parse(c.dataset.cycleArt),time:+c.dataset.simTime}));
 const held=new Set();const keys=async names=>{for(const key of [...held])if(!names.includes(key)){await page.keyboard.up(key);held.delete(key);}for(const key of names)if(!held.has(key)){await page.keyboard.down(key);held.add(key);}};
 const tap=async key=>{await keys([]);await page.keyboard.press(key);await page.waitForTimeout(50);};
 const wait=async(ms)=>{await keys([]);await page.waitForTimeout(ms);};
 const shot=async name=>{await page.screenshot({path:'output/playwright/water83-'+name+'.png'});};
 const until=async(cond,input=()=>[],timeout=40000)=>{const start=Date.now();while(Date.now()-start<timeout){const s=await state();if(s.failed)throw Error('Drowned '+JSON.stringify(s));if(cond(s)){await keys([]);return;}await keys(input(s));await page.waitForTimeout(25);}throw Error('Timeout '+JSON.stringify(await state()));};
 const move=async(id,x)=>{await tap(String(id+1));await until(s=>s.won||Math.abs(s.heroes[id].x-x)<5&&Math.abs(s.heroes[id].vx)<16,s=>{const h=s.heroes[id],d=x-h.x-h.vx*Math.abs(h.vx)/3000;return Math.abs(d)<3?[]:[d>0?'ArrowRight':'ArrowLeft'];});await wait(150);};
 const swim=async(x,y)=>{await tap('1');await until(s=>Math.abs(s.heroes[0].x-x)<5&&Math.abs(s.heroes[0].y-y)<5&&Math.abs(s.heroes[0].vx)<18&&Math.abs(s.heroes[0].vy)<30,s=>{const h=s.heroes[0],dx=x-h.x-h.vx*Math.abs(h.vx)/1300,v=h.vy,dy=y-h.y-v*Math.abs(v)/1200;return [dx<-3?'ArrowLeft':dx>3?'ArrowRight':null,dy<-3?'ArrowUp':dy>3?'ArrowDown':null].filter(Boolean);});};
 const climb=async(id,x,feet)=>{await move(id,x);await until(s=>Math.abs(s.heroes[id].y+44-feet)<2,s=>[feet<s.heroes[id].y+44?'ArrowUp':'ArrowDown']);await wait(50);};
 await shot('initial-2x');await page.locator('#zoom').click();await shot('initial-1x');await page.locator('#zoom').click();
 await tap('3');await tap('Space');await move(2,710);await shot('shield-intake');
 await swim(640,880);await swim(820,880);await swim(940,856);await page.locator('#zoom').click();await wait(150);await shot('gate-before-visible');await tap('e');await wait(450);await shot('gate-middle-visible');await until(s=>s.machine.valvePose===1);await shot('gate-open-visible');

 return{errors};
}
