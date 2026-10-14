async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3017/?campaign=cycle&puzzle=refraction');await page.locator('#play-refraction').click();if((await page.locator('#zoom').textContent()).startsWith('1'))await page.locator('#zoom').click();
 try{await page.exposeBinding('vikingsFlight70d',async(_,name)=>{await page.screenshot({path:'output/playwright/vikings70-flight-'+name+'.png'});if(['draft','brake'].includes(name)){await page.locator('#pause').click();await page.locator('#zoom').click();await page.waitForTimeout(300);await page.screenshot({path:'output/playwright/vikings70-flight-'+name+'-1x.png'});await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);await page.screenshot({path:'output/playwright/vikings70-flight-'+name+'-mobile.png'});await page.locator('#zoom').click();await page.waitForTimeout(300);await page.screenshot({path:'output/playwright/vikings70-flight-'+name+'-mobile-2x.png'});await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(300);await page.locator('#pause').click();}});}catch(e){if(!String(e).includes('already registered'))throw e;}
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 const result=await page.evaluate(async()=>{
  const read=()=>{const e=document.querySelector('#game');return{heroes:JSON.parse(e.dataset.heroes),machine:JSON.parse(e.dataset.puzzle).machine,art:JSON.parse(e.dataset.cycleArt),won:e.dataset.won==='true',failed:e.dataset.failed==='true',time:Number(e.dataset.simTime)};};
  const held=new Set();let active=0;
  const pulse=key=>{for(const type of ['keydown','keyup'])window.dispatchEvent(new KeyboardEvent(type,{key,code:key===' '?'Space':key,bubbles:true}));};
  const select=id=>{if(id!==active){pulse(String(id+1));active=id;}};
  const input=v=>{for(const [key,on]of [['ArrowLeft',!!v.left],['ArrowRight',!!v.right]]){if(on&&!held.has(key)){held.add(key);window.dispatchEvent(new KeyboardEvent('keydown',{key,code:key,bubbles:true}));}else if(!on&&held.has(key)){held.delete(key);window.dispatchEvent(new KeyboardEvent('keyup',{key,code:key,bubbles:true}));}}if(v.jump||v.sword)pulse(' ');if(v.action)pulse('d');if(v.interact)pulse('e');};
  const frame=()=>new Promise(r=>requestAnimationFrame(r));
  const tick=async(v={},seconds=.03)=>{input(v);const t=read().time;while(read().time-t<seconds&&!read().won){await frame();if(read().failed)throw Error('Died '+JSON.stringify(read()));}input({});};
  const until=async(condition,controls=()=>({}),limit=40)=>{const start=performance.now();while(performance.now()-start<limit*1000){if(condition()){input({});return;}input(controls());await frame();if(read().failed)throw Error('Died '+JSON.stringify(read()));}throw Error('Timeout '+JSON.stringify(read()));};
  const move=async(id,x)=>{select(id);await until(()=>read().won||Math.abs(read().heroes[id].x-x)<3&&Math.abs(read().heroes[id].vx)<12,()=>{const h=read().heroes[id],brake=h.ground?[2600,2300,2100][id]:[1250,950,750][id]*1.5,d=x-h.x-h.vx*Math.abs(h.vx)/(2*brake);return Math.abs(d)<2?{}:d>0?{right:true}:{left:true};});await tick({},.12);};
  const capture=async name=>{input({});await window.vikingsFlight70d(name);};
  await capture('start');await move(1,420);await tick({action:true});await until(()=>read().machine.catchBroken);await capture('catch-moving');await until(()=>read().machine.draft);await capture('catch-settled');
  await move(2,640);await tick({jump:true});await until(()=>read().heroes[2].y+44<330);await capture('draft');await move(2,750);await until(()=>read().heroes[2].vy>0);await capture('brake');return {health:read().heroes.map(h=>h.hp),time:read().time,olaf:read().heroes[2]};
 });return{result,errors};
}
