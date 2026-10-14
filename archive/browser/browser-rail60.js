async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3005/?campaign=cycle&rail=60');await page.locator('#play-cycle').click();if(await page.locator('#zoom').textContent()!=='2×')await page.locator('#zoom').click();
 try{await page.exposeBinding('rail60Capture',async(_,name)=>page.screenshot({path:'output/playwright/rail60-'+name+'.png'}));}catch(e){if(!String(e).includes('already registered'))throw e;}
 const result=await page.evaluate(async()=>{
  const read=()=>{const e=document.querySelector('#game');return {heroes:JSON.parse(e.dataset.heroes),machine:JSON.parse(e.dataset.puzzle).machine,won:e.dataset.won==='true',failed:e.dataset.failed==='true',time:Number(e.dataset.simTime)};};
  const held=new Set();let active=0;
  const pulse=key=>{for(const type of ['keydown','keyup'])window.dispatchEvent(new KeyboardEvent(type,{key,code:key===' '?'Space':key,bubbles:true}));};
  const select=id=>{if(id!==active){pulse(String(id+1));active=id;}};
  const input=v=>{for(const [key,on] of [['ArrowLeft',!!v.left],['ArrowRight',!!v.right],['ArrowUp',!!v.up],['ArrowDown',!!v.down]]){if(on&&!held.has(key)){held.add(key);window.dispatchEvent(new KeyboardEvent('keydown',{key,code:key,bubbles:true}));}else if(!on&&held.has(key)){held.delete(key);window.dispatchEvent(new KeyboardEvent('keyup',{key,code:key,bubbles:true}));}}if(v.jump||v.sword)pulse(' ');if(v.action)pulse('d');if(v.interact)pulse('e');};
  const frame=()=>new Promise(r=>requestAnimationFrame(r));
  const tick=async(v={},seconds=.03)=>{input(v);const t=read().time;while(read().time-t<seconds&&!read().won){await frame();if(read().failed)throw Error('Died '+JSON.stringify(read()));}input({});};
  const until=async(condition,controls=()=>({}),limit=100)=>{const start=performance.now();while(performance.now()-start<limit*1000){if(condition()){input({});return;}input(controls());await frame();if(read().failed)throw Error('Died '+JSON.stringify(read()));}throw Error('Timeout '+JSON.stringify(read()));};
  const move=async(id,x)=>{select(id);await until(()=>read().won||Math.abs(read().heroes[id].x-x)<3&&Math.abs(read().heroes[id].vx)<12,()=>{const h=read().heroes[id],brake=h.ground?[2600,2300,2100][id]:[1250,950,750][id],d=x-h.x-h.vx*Math.abs(h.vx)/(2*brake);return Math.abs(d)<2?{}:d>0?{right:true}:{left:true};});await tick({},.15);};
  const climb=async(id,feet)=>{await move(id,650);await until(()=>Math.abs(read().heroes[id].y+44-feet)<2,()=>({up:feet<read().heroes[id].y+44,down:feet>read().heroes[id].y+44}));await tick({},.03);};
  const capture=async name=>{input({});await window.rail60Capture(name);};
  await capture('start');await move(1,400);await tick({sword:true});await capture('restraint-cut');
  await climb(0,500);await move(0,820);await until(()=>{const c=read().machine.carrier;return c.x===850&&c.y===500&&c.pause>.8;});await move(0,895);await capture('rider-deck');await tick({jump:true,right:true});await until(()=>read().heroes[0].ground&&read().heroes[0].y+44===390,()=>({right:true}),3);await move(0,1125);await capture('brake-before');await tick({interact:true},.18);await capture('brake-middle');await tick({},.6);await capture('brake');
  await climb(1,500);await move(1,820);await tick({action:true});await until(()=>read().machine.damper===1);await capture('damper');await move(1,700);
  await move(2,820);await until(()=>{const c=read().machine.carrier;return c.x===850&&c.y===940&&c.pause>.8;});await move(2,880);await until(()=>{const h=read().heroes[2];return h.x>=1300&&h.x<=1410&&h.y+44===500;});await tick({jump:true});await until(()=>read().heroes[2].y+44<380);await capture('draft');await until(()=>read().heroes[2].y+44<240);await move(2,1560);await until(()=>read().heroes[2].ground&&read().heroes[2].y+44===260);await tick({interact:true});await capture('selector');
  const queued=JSON.parse(document.querySelector('#game').dataset.cycleArt).rail;if(queued.active!=='lower'||!queued.queued||queued.requested!=='upper')throw Error('Queued indication');await until(()=>read().machine.carrier.high===260);await capture('upper-active');const upper=JSON.parse(document.querySelector('#game').dataset.cycleArt).rail;if(upper.active!=='upper'||upper.queued)throw Error('Upper route did not activate');return {queued,upper};
 });
 await page.locator('#zoom').click();await page.waitForTimeout(400);await page.screenshot({path:'output/playwright/rail60-overview.png'});await page.setViewportSize({width:844,height:390});await page.waitForTimeout(400);await page.screenshot({path:'output/playwright/rail60-mobile.png'});await page.locator('#zoom').click();await page.waitForTimeout(400);await page.screenshot({path:'output/playwright/rail60-mobile-2x.png'});
 if(errors.length)throw Error(errors.join(';'));return {result,errors};
}
