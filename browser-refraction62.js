async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3007/?campaign=cycle&puzzle=refraction');await page.locator('#play-refraction').click();
 try{await page.exposeBinding('refractionCapture62',async(_,name)=>page.screenshot({path:'output/playwright/refraction62-'+name+'.png'}));}catch(e){if(!String(e).includes('already registered'))throw e;}
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
  const capture=async name=>{input({});await window.refractionCapture62(name);};
  await capture('start');await move(1,420);await tick({action:true});await until(()=>read().machine.catchBroken);await capture('catch-moving');await until(()=>read().machine.draft);await capture('catch-settled');
  await move(2,640);await tick({jump:true});await until(()=>read().heroes[2].y+44<330);await capture('draft');await move(2,850);await until(()=>read().heroes[2].ground&&read().heroes[2].y+44===390);await capture('upper-before');await tick({interact:true},.3);await capture('upper-moving');await until(()=>read().machine.poses[1]===1);await capture('upper-settled');
  await tick({action:true});await move(2,1100);await until(()=>read().heroes[2].ground&&read().heroes[2].y+44===900);await move(2,1280);await tick({jump:true});
  await move(0,1244);await tick({jump:true,right:true});await until(()=>read().heroes[0].support===2,()=>({right:read().heroes[0].x<1280}),3);await move(0,1280);await capture('shield-step');await tick({jump:true});await until(()=>read().heroes[0].ground&&read().heroes[0].y+44===700,()=>({right:read().heroes[0].x<1320}),3);await move(0,1360);await capture('lower-before');await tick({interact:true},.3);await capture('lower-moving');await until(()=>read().machine.charge>0&&read().machine.charge<.7);await capture('receiver-charging');await until(()=>read().machine.charge===1);await capture('receiver-powered');
  await move(0,1540);await until(()=>read().heroes[0].ground&&read().heroes[0].y+44===900);select(2);await tick({action:true});
  for(const id of [0,1,2]){await move(id,2040);await until(()=>read().machine.carrier.y===900&&read().machine.carrier.pause>2);await move(id,2110);await capture('lift-'+id);await until(()=>read().machine.carrier.y===460&&read().machine.carrier.pause>2&&read().heroes[id].y+44===460);await move(id,2600);}
  await capture('clear');const end=read();if(!end.won)throw Error('Incomplete');return{won:end.won,health:end.heroes.map(h=>h.hp),time:end.time,art:end.art};
 });
 await page.waitForFunction(()=>!document.querySelector('#win').hidden);await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('#game').dataset.won==='false');
 if(errors.length)throw Error(errors.join(';'));return{result,enterContinues:true,errors};
}
