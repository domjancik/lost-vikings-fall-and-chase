async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.setViewportSize({width:1440,height:900});
 await page.goto('http://127.0.0.1:3002/?campaign=cycle&support=57');await page.locator('#play-cycle').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 try{await page.exposeBinding('support57Capture',async(_,name)=>page.screenshot({path:'output/playwright/support57-'+name+'.png'}));}
 catch(e){if(!String(e).includes('already registered'))throw e;}
 const result=await page.evaluate(async()=>{
  const read=()=>{const e=document.querySelector('#game'),m=JSON.parse(e.dataset.puzzle).machine;return {heroes:JSON.parse(e.dataset.heroes),carrier:m.carrier,released:m.released,time:Number(e.dataset.simTime),failed:e.dataset.failed==='true'};};
  const frame=()=>new Promise(r=>requestAnimationFrame(r));let held='';
  const pulse=key=>{for(const type of ['keydown','keyup'])window.dispatchEvent(new KeyboardEvent(type,{key,bubbles:true}));};
  const input=key=>{if(key===held)return;if(held)window.dispatchEvent(new KeyboardEvent('keyup',{key:held,bubbles:true}));held=key;if(key)window.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));};
  const until=async(fn,controls=()=>'',limit=12000)=>{const t=performance.now();try{while(!fn(read())){if(performance.now()-t>limit)throw Error('Timeout:'+JSON.stringify(read()));input(controls(read()));await frame();if(read().failed)throw Error('Death');}}finally{input('');}};
  const move=async(id,x)=>{pulse(String(id+1));await until(s=>Math.abs(s.heroes[id].x-x)<2&&Math.abs(s.heroes[id].vx)<10,s=>{const h=s.heroes[id],brake=[2600,2300,2100][id],d=x-h.x-h.vx*Math.abs(h.vx)/(2*brake);return Math.abs(d)<2?'':d>0?'ArrowRight':'ArrowLeft';},16000);};
  await move(2,920);pulse(' ');await until(s=>s.heroes[2].shieldUp);
  await move(0,920);pulse(' ');
  await until(s=>s.heroes[0].support===2);await window.support57Capture('boarded');
  await move(1,400);pulse(' ');await until(s=>s.released);pulse('3');
  const start=read(),offset=start.heroes[0].x-start.heroes[2].x;let maxDrift=0,horizontalFrames=0;
  await until(s=>{
   const e=s.heroes[0],o=s.heroes[2];
   if(e.support!==2||o.support!=='cycle-carrier')throw Error('Lost stacked support:'+JSON.stringify(s));
   maxDrift=Math.max(maxDrift,Math.abs(e.x-o.x-offset));
   if(s.carrier.segment===1)horizontalFrames++;
   return s.carrier.segment===1&&s.carrier.x>1250;
  },()=>'',30000);
  await window.support57Capture('horizontal');const end=read();
  if(maxDrift>.01||horizontalFrames<30)throw Error('Drift:'+maxDrift);
  return {maxDrift,horizontalFrames,offset,heroes:end.heroes.map(h=>({id:h.id,x:h.x,y:h.y,hp:h.hp,support:h.support})),carrier:end.carrier};
 });
 if(errors.length)throw Error(errors.join(';'));return {...result,errors};
}
