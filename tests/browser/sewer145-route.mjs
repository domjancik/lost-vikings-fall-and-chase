import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),live=!!process.env.SEWER_LIVE,touchSmoke=process.argv.includes('--touch-smoke'),touch=process.argv.includes('--touch')||touchSmoke;
const out=process.env.SEWER_EVIDENCE||'assets/sewer145/'+(touch?'mobile':'desktop');fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=live?(process.env.SEWER_LIVE.startsWith('http')?process.env.SEWER_LIVE:'https://united-marsh-6ppd.here.now'):'http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:touch?{width:844,height:390}:{width:1440,height:900},hasTouch:touch,isMobile:touch}),errors=[],captures=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'&&!m.location().url.endsWith('favicon.ico'))errors.push(m.text());if(m.text().startsWith('SEWER '))console.log(m.text());});
const read=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,art:JSON.parse(c.dataset.cycleArt||'null'),darkness:JSON.parse(c.dataset.sewerDarkness||'null'),camera:JSON.parse(c.dataset.camera),time:+c.dataset.simTime,round:+c.dataset.round,transition:c.dataset.transition,won:c.dataset.won==='true'}));
let mountedFixtures;
async function photo(name,label){const file=out+'/'+name+'-'+label+'.png';await page.screenshot({path:file});const state=await read();if(state.round===10){for(const [kind,axis]of [['valve',[1050,580]],['inspection-winch',[1820,572]]]){const wheel=state.art.contacts.find(a=>a.kind===kind);assert.ok(wheel.ready);assert.deepEqual(wheel.axis,axis,'visible axle must remain registered through every intermediate pose');assert.equal(wheel.origin[1]+wheel.sourceSole*2,wheel.sole);}}if(process.argv.includes('--structure-focus')&&state.round===10){const fixtures=state.art.contacts.filter(a=>a.kind==='rear-fixture');assert.ok(fixtures.length>0);if(mountedFixtures)assert.deepEqual(fixtures,mountedFixtures,'rear fixtures stay registered through camera travel');mountedFixtures=fixtures;}captures.push({file,name,label,...state});}
await page.exposeBinding('sewerPhoto',async(_,name)=>{
 if(process.argv.includes('--outlet-focus')&&!name.startsWith('pipe-'))return;
 if(process.argv.includes('--sewer132-focus')&&!['wall-contact','guarded-shot','lurker-hit','lurker-fall','lurker-dead'].includes(name))return;
 if(process.argv.includes('--structure-focus')&&!['lamphouse','shielded-spray','winch-moving','inspection-open','leaf-clearance','landing-rider-start','outlet-moving','outlet-open'].includes(name))return;
 if(process.argv.includes('--spray-focus')&&!['unshielded-spray','shielded-spray'].includes(name))return;
 if(!['inspection-open','guarded-shot','outlet-open'].includes(name)&&!name.startsWith('pipe-'))return;
 await photo(name,'live');
 await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.paused==='true');
 for(const [size,zoom,label]of [[process.argv.includes('--structure-focus')?{width:1920,height:800}:{width:1440,height:900},2,'2x'],[{width:1440,height:900},1,'1x'],[{width:430,height:780},process.argv.includes('--sewer132-focus')?1.5:2,'portrait'],[{width:844,height:390},2,'landscape']]){
  await page.setViewportSize(size);for(let attempt=0;attempt<3&&(await read()).camera.zoom!==zoom;attempt++){const previous=(await read()).camera.zoom;await page.locator('#zoom').click();await page.waitForFunction(z=>JSON.parse(document.querySelector('#game').dataset.camera).zoom!==z,previous);}await page.waitForFunction(z=>JSON.parse(document.querySelector('#game').dataset.camera).zoom===z,zoom);await page.waitForTimeout(350);await photo(name,label);
 }
 await page.setViewportSize(touch?{width:844,height:390}:{width:1440,height:900});await page.locator('#pause').click();
});
await page.exposeBinding('sewerSlot',async(_,slot)=>{
 await page.locator('#bag').click();await page.locator('#inventory-dialog').waitFor({state:'visible'});
 await page.locator('#inventory-slots button[data-slot="'+slot+'"]').click();await page.locator('#close-inventory').click();
});
try{
 await reviewNavigate(page,base+'/?campaign=fall&release=sewer141');
 const cards=page.locator('#start-picker .level-card');
 assert.deepEqual(await cards.evaluateAll(nodes=>nodes.map(n=>+n.dataset.round)),[11,10,4,2,3,7,5,8,9,0]);
 const sewerCard=page.locator('#start-picker .level-card[data-round="10"]');
 await sewerCard.locator('canvas[data-ready="true"]').waitFor({timeout:60000});
 await sewerCard.click();await page.waitForFunction(()=>document.querySelector('#game').dataset.round==='10');
 await page.locator('#restart').click();
 if(!process.argv.includes('--smoke'))await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.globe?.phase==='gone');
 if(touchSmoke){
  const cdp=await page.context().newCDPSession(page),actions=[];
  assert.equal(await page.evaluate(()=>matchMedia('(pointer:coarse)').matches),true);
  await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.landed);await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');
  await page.locator('[data-hero="1"]').tap();await page.waitForFunction(()=>document.querySelector('#game').dataset.activeHero==='1');
  await page.locator('[data-hero="0"]').tap();await page.waitForFunction(()=>document.querySelector('#game').dataset.activeHero==='0');actions.push('hero-selection');
  async function walkRightTo(x){
   const b=await page.locator('[data-key="right"]').boundingBox();
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2,id:1}]});
   await page.waitForFunction(x=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x>=x,x);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   await page.waitForFunction(()=>Math.abs(JSON.parse(document.querySelector('#game').dataset.heroes)[0].vx)<1);
  }
  await walkRightTo(366);await page.locator('[data-key="interact"]').tap();
  await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].inventory.includes('inspectionLamp'));actions.push('move-touch','use-pickup');
  await walkRightTo(425);await page.locator('[data-key="interact"]').tap();
  await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].inventory.includes('lampOil'));
  await walkRightTo(480);await page.locator('[data-key="interact"]').tap();
  await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].inventory.includes('bullseyeLens'));
  await page.locator('#bag').tap();await page.locator('#inventory-slots button[data-slot="2"]').tap();await page.locator('#close-inventory').tap();
  await page.locator('[data-key="item"]').tap();
  await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.lamp.lens);actions.push('inventory-select','item-fit-lens');
  await page.locator('[data-hero="0"]').tap();await page.locator('[data-hero="0"]').tap();
  // Active picker cycles inventory slots: from2 →3 →0.
  await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].itemSlot===0);
  await page.locator('[data-key="item"]').tap();
  await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.lamp.focused===false);actions.push('picker-slot-cycle','item-toggle-beam');
  const layout=await page.evaluate(()=>{
   const selectors=['[data-key="left"]','[data-key="right"]','[data-key="item"]','[data-key="interact"]','[data-key="primary"]','[data-key="secondary"]','[data-hero="0"]','[data-hero="1"]','[data-hero="2"]'];
   const targets=selectors.map(selector=>{const el=document.querySelector(selector),r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{selector,x:r.x,y:r.y,w:r.width,h:r.height,reachable:!!hit&&(hit===el||el.contains(hit))};});
   const overlaps=[];for(let i=0;i<targets.length;i++)for(let j=i+1;j<targets.length;j++){const a=targets[i],b=targets[j];if(Math.min(a.x+a.w,b.x+b.w)>Math.max(a.x,b.x)&&Math.min(a.y+a.h,b.y+b.h)>Math.max(a.y,b.y))overlaps.push([a.selector,b.selector]);}
   return{targets,overlaps,coarse:matchMedia('(pointer:coarse)').matches};
  });
  assert.deepEqual(layout.overlaps,[]);assert.ok(layout.targets.every(t=>t.reachable),'all touch controls must be unobstructed');
  await photo('entrance-controls','landscape');
  await page.setViewportSize({width:430,height:780});await page.waitForTimeout(400);await photo('entrance-controls','portrait');
  const state=await read();assert.ok(state.camera.x>=0&&state.camera.x+state.camera.width<=3300);assert.deepEqual(state.heroes.map(h=>h.hp),[3,3,3]);assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/touch.json',JSON.stringify({actions,layout,state,captures,errors},null,2));console.log(JSON.stringify({touch:true,actions,overlaps:layout.overlaps,errors}));
 }else if(process.argv.includes('--smoke')){
  await page.evaluate(()=>window.sewerPhoto('ceiling-fall'));await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.landed);await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');
  await page.evaluate(()=>window.sewerPhoto('lamphouse'));assert.deepEqual(errors,[]);console.log(JSON.stringify({ready:true,errors,captures:captures.length}));
 }else{
  const source=fs.readFileSync('tests/routes/sewer-route125.js','utf8');
  let body=source.slice(source.indexOf(" mark('ceiling-fall')"));
  if(process.argv.includes('--outlet-focus'))body=body.replace("mark('stream-swept-'+id);", "mark('stream-swept-'+id);until(id,s=>s.machine.escapeTravel[id]>=300,{},3);mark('pipe-approach-'+id);until(id,s=>s.machine.escapeTravel[id]>=395,{},3);mark('pipe-entry-'+id);until(id,s=>s.machine.escapeTravel[id]>=450,{},3);mark('pipe-depth-'+id);until(id,s=>s.heroes[id].sweptAway,{},3);");
  body=body.replace("until(0,s=>s.machine.hatch.pose===1,{},2);mark('inspection-open');","until(0,s=>s.machine.hatch.pose>=.4,{},2);mark('winch-moving');until(0,s=>s.machine.hatch.pose===1,{},2);mark('inspection-open');");
  body=body.replace("until(1,s=>s.machine.gates[0].pose===1,{},3);mark('outlet-open');","until(1,s=>s.machine.gates[0].pose>=.4,{},3);mark('outlet-moving');until(1,s=>s.machine.gates[0].pose===1,{},3);mark('outlet-open');");
  if(process.argv.includes('--structure-focus')){
   body=body.replace("mark('inspection-open');", "mark('inspection-open');move(0,1950);tick(0,{item:true});mark('leaf-clearance');tick(0,{item:true});");
   body=body.replace("mark('guarded-shot');", "mark('guarded-shot');move(0,2240);mark('landing-rider-start');");
   body=body.replace("until(1,s=>s.machine.gates[0].pose>=.4", "until(0,s=>s.machine.gates[0].pose>=.4").replace("until(1,s=>s.machine.gates[0].pose===1", "until(0,s=>s.machine.gates[0].pose===1");
   body=body.replace("mark('outlet-open');", "mark('outlet-open');move(0,2120);until(0,s=>s.heroes[0].ground&&s.heroes[0].y+44===760,{},2);");
  }
  if(process.argv.includes('--sewer132-focus')){
   body=body.replace("move(0,1840);tick(0,{interact:true});", "move(0,2004);mark('wall-contact');move(0,1840);tick(0,{right:true});tick(0,{interact:true});");
   body=body.replace("until(1,s=>s.machine.lurkers.every(e=>!e.hp),()=>s.cooldown===0?{action:true}:{},8);", "until(1,s=>s.machine.lurkers.every(e=>!e.hp),()=>s.cooldown===0?{action:true}:{},8);mark('lurker-hit');until(1,s=>s.time-s.machine.lurkers[0].deadAt>=.18,{},1);mark('lurker-fall');move(1,2235);mark('lurker-dead');");
  }
  body=body.replace("move(0,1050);tick(0,{interact:true});", "move(0,990);tick(0,{right:true});mark('valve-before');tick(0,{interact:true});move(0,975);tick(0,{right:true});until(0,s=>s.machine.valve.pose>=.4,{},2);mark('valve-moving');");
  body=body.replace("move(0,1840);tick(0,{interact:true});", "move(0,1880);tick(0,{left:true});mark('winch-before');tick(0,{interact:true});move(0,1930);tick(0,{left:true});");
  if(process.argv.includes('--reverse-only'))body=body.replace("mark('inspection-open');", "mark('inspection-open');move(0,1880);tick(0,{interact:true});move(0,1930);tick(0,{left:true});until(0,s=>s.machine.hatch.pose<=.6,{},2);mark('winch-closing');until(0,s=>s.machine.hatch.pose===0,{},2);mark('winch-reset');move(0,1880);tick(0,{interact:true});move(0,1930);tick(0,{left:true});until(0,s=>s.machine.hatch.pose===1,{},2);mark('winch-reopened');return{reversal:true,hp:s.heroes.map(h=>h.hp)};");
  body=body.replace(/s\.heroes\[(\d)\]\.itemSlot=(\d);/g,'await slot($1,$2);').replace(/\b(tick|until|move|mark)\(/g,'await $1(');
  const helpers=`async function play(){
 const read=()=>{const d=document.querySelector('#game').dataset;return{time:+d.simTime,active:+d.activeHero,cooldown:+d.cooldown,heroes:JSON.parse(d.heroes),machine:JSON.parse(d.puzzle).machine,won:d.won==='true',failed:d.failed==='true'};};
 const milestones=[],commands=[],held=new Set();let s=read(),stage='entrance';
 const key=(k,down)=>window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key:k,code:k===' '?'Space':k.length===1?'Key'+k.toUpperCase():k,bubbles:true}));
 function release(){for(const k of held)key(k,false);held.clear();}
 async function select(id){if(s.active!==id){document.querySelectorAll('.hero-card')[id].click();await new Promise(requestAnimationFrame);s=read();}}
 async function slot(id,n){release();await select(id);await window.sewerSlot(n);await new Promise(requestAnimationFrame);s=read();if(s.heroes[id].itemSlot!==n)throw Error('Inventory selection did not change');console.log('SEWER slot '+n+' '+JSON.stringify(s.heroes[id].inventory));}
 async function tick(id,input={}){await select(id);
 const next=new Set(['left','right','up','down'].filter(a=>input[a]).map(a=>({left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown'})[a]));for(const k of held)if(!next.has(k))key(k,false);for(const k of next)if(!held.has(k))key(k,true);held.clear();for(const k of next)held.add(k);
 const pulses=[];for(const [field,k]of [['jump',' '],['action','d'],['sword','z'],['interact','e'],['item','q']])if(input[field]){key(k,true);pulses.push(k);}const before=s.time,start=performance.now();await new Promise(requestAnimationFrame);while(read().time<=before+(input.item?1/60:0)&&!read().won&&!read().failed){if(performance.now()-start>5000)throw Error('Stopped '+stage);await new Promise(requestAnimationFrame);}for(const k of pulses)key(k,false);s=read();if(input.item)console.log('SEWER item '+stage+' '+JSON.stringify({slot:s.heroes[id].itemSlot,inventory:s.heroes[id].inventory,lamp:s.machine.lamp,lamps:s.machine.lamps}));if(s.failed)throw Error('Crew lost '+stage);}
 async function until(id,predicate,input={},seconds=25){const end=s.time+seconds;while(!predicate(s)){if(s.won)return;if(s.time>end)throw Error('Timeout '+stage+' '+JSON.stringify(s));await tick(id,typeof input==='function'?input(s):input);}}
 async function move(id,x){await until(id,s=>Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<16,()=>{const h=s.heroes[id],error=x-h.x,stop=h.vx*h.vx/(2*(h.ground?[2600,2300,2100][id]:1875));return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};});}
 async function mark(name){stage=name;if(name==='permanent-refuge'){const refuge=s.machine.lamps.find(a=>a.id==='refuge');if(!refuge.oil||!refuge.lit||s.heroes[0].inventory.includes('lampOil'))throw Error('Refuge oil/light action did not complete '+JSON.stringify(s));}if(name==='valve-closed'&&(!s.machine.lamp.lens||s.heroes[0].inventory.includes('bullseyeLens')))throw Error('Lens was not actually fitted');console.log('SEWER '+name+' '+s.time);milestones.push({name,time:s.time,heroes:s.heroes,machine:s.machine});release();if(!s.won)await window.sewerPhoto(name);if(name==='lamphouse')while(document.querySelector('#game').dataset.transition==='arriving')await new Promise(requestAnimationFrame);s=read();}
 `;
  const result=await page.evaluate('('+helpers+body+')()');
  if(result.reversal){
   assert.deepEqual(result.hp,[3,3,3]);assert.deepEqual(errors,[]);
   fs.writeFileSync(out+'/evidence.json',JSON.stringify({result,captures,errors},null,2));console.log(JSON.stringify({reversal:true,hp:result.hp,captures:captures.length,errors}));
  }else{
  assert.equal(result.won,true);assert.deepEqual(result.hp,[3,3,3]);
  // The final actual capture is followed by water travel, and Space/Enter advances
  // into the old stable water ID rather than the next numeric ID.
  await page.waitForFunction(()=>['downstream','complete'].includes(document.querySelector('#game').dataset.transition));
  if((await read()).transition!=='complete'){await page.waitForTimeout(300);await photo('all-caught','downstream');await page.waitForTimeout(500);await photo('all-caught','mid-flow');}
  await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='complete');await photo('all-caught','complete');
  assert.match(await page.locator('#next-round').textContent(),/FOLLOW THE CURRENT/);
  assert.match(await page.locator('#win p').textContent(),/DROWNED REGULATOR/);
  if(process.argv.includes('--transition-evidence')){await page.keyboard.down('ArrowRight');await page.keyboard.down('Enter');}else await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('#game').dataset.round==='4');
  const water=await read();assert.equal(water.round,4);await photo('continued-water','entry');if(process.argv.includes('--transition-evidence')){await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.transitionDetail||'{}').phase==='entry');const arrival=await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.transitionDetail));assert.equal(arrival.method,'water');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.transitionDetail||'{}').elapsed>.6);await photo('continued-water','late-entry');await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',code:'ArrowRight',repeat:true,bubbles:true})));await page.waitForTimeout(200);const settled=await read();assert.deepEqual(settled.heroes.map(h=>h.x),water.heroes.map(h=>h.x));assert.deepEqual(settled.heroes.map(h=>h.hp),[3,3,3]);await page.keyboard.up('ArrowRight');await page.keyboard.up('Enter');await photo('continued-water','arrived');}
  assert.deepEqual(errors,[]);fs.writeFileSync(out+'/evidence.json',JSON.stringify({result,captures,errors,continuedTo:water.round},null,2));
  console.log(JSON.stringify({won:true,hp:result.hp,time:result.time,captures:captures.length,continuedTo:water.round,errors}));
  }
 }
}catch(e){await photo('failure','state');fs.writeFileSync(out+'/failure.json',JSON.stringify({error:String(e),errors,state:await read()},null,2));throw e;}
finally{await browser.close();server?.close();}
