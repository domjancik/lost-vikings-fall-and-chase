import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),live=!!process.env.FREIGHT_LIVE,out=process.env.FREIGHT_OUT||'output/freight109';
fs.mkdirSync(out+'/captures',{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise((r,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',r);});
const touch=process.argv.includes('--touch'),browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:touch?{width:430,height:780}:{width:1440,height:900},hasTouch:touch,isMobile:touch}),errors=[],captures=[];
page.on('pageerror',e=>errors.push(e.stack||String(e)));page.on('console',m=>{if(m.type()==='error'&&!m.location().url.endsWith('/favicon.ico'))errors.push(m.text()+' '+m.location().url);else if(m.text().startsWith('FREIGHT '))console.log(m.text());});
await page.exposeBinding('freightPhoto',async(_,label)=>{
 await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.paused==='true');
 for(const [name,size,zoom]of [['2x',{width:1440,height:900},2],['1x',{width:1440,height:900},1],['portrait',{width:430,height:780},2],['landscape',{width:844,height:390},2]]){
  if(await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom)!==zoom)await page.locator('#zoom').click();
  await page.setViewportSize(size);await page.waitForTimeout(450);
  const file=out+'/captures/'+label+'-'+name+'.png';await page.screenshot({path:file});captures.push({label,name,file,state:await page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,art:JSON.parse(c.dataset.cycleArt),camera:JSON.parse(c.dataset.camera)}))});
 }
 await page.setViewportSize({width:1440,height:900});await page.locator('#pause').click();
});
try{
 await page.goto((live?'https://united-marsh-6ppd.here.now/':'http://127.0.0.1:'+server.address().port+'/')+'?campaign=cycle&release=freight109');
 await page.evaluate(()=>localStorage.setItem('last-call-story-cards','off'));
 await page.locator('#start-picker [data-campaign-option="cycle"]').click();
 await page.waitForFunction(()=>{const c=[...document.querySelectorAll('#start-picker canvas')];return c.length>=8&&c.every(i=>i.dataset.ready==='true');});
 const pictures=await page.locator('#start-picker canvas').evaluateAll(c=>c.map(i=>i.toDataURL()));
 assert.equal(new Set(pictures).size,pictures.length);
 await page.locator('#start-picker .level-card[data-round="7"]').click();
 await page.waitForFunction(()=>document.querySelector('#game').dataset.round==='7'&&JSON.parse(document.querySelector('#game').dataset.cycleArt).ready);
 await page.locator('#restart').click();await page.waitForFunction(()=>+document.querySelector('#game').dataset.simTime<.2);
 if(touch){
  const cdp=await page.context().newCDPSession(page),read=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),camera:JSON.parse(c.dataset.camera)}));
  async function hold(key,ms){const r=await page.locator('[data-key="'+key+'"]').boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x+r.width/2,y:r.y+r.height/2,id:1}]});await page.waitForTimeout(ms);const state=await read();await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});return state;}
  const before=(await read()).heroes[0].x;await hold('right',700);await page.waitForTimeout(150);assert.ok((await read()).heroes[0].x>before+100);
  await page.locator('.hero-card[data-hero="2"]').tap();await page.locator('[data-key="primary"]').tap();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[2].shieldUp);
  const beforeY=(await read()).camera.y,looked=await hold('up',600);assert.equal(looked.camera.look,-1);assert.ok(looked.camera.y<beforeY-80);
  await page.locator('[data-key="secondary"]').tap();await page.waitForFunction(()=>!JSON.parse(document.querySelector('#game').dataset.heroes)[2].shieldUp);
  await page.locator('#pause').tap();await page.screenshot({path:out+'/captures/coarse-touch.png'});assert.deepEqual(errors,[]);fs.writeFileSync(out+'/touch.json',JSON.stringify({state:await read(),coarse:await page.evaluate(()=>matchMedia('(pointer:coarse)').matches),errors},null,2));console.log(JSON.stringify({touchPassed:true,errors}));
 }else if(process.argv.includes('--smoke')){await page.evaluate(()=>window.freightPhoto('initial'));console.log(JSON.stringify({ready:true,errors}));assert.deepEqual(errors,[]);}
 else{
 let source=fs.readFileSync('tests/routes/freight-route109.js','utf8');source=source.slice(source.indexOf('export function')).replace('export function simulateFreightRoute(hz=120)','async function playFreight()');
 const begin=source.indexOf(' const s=createState'),bodyStart=source.indexOf(" mark('clear-first-riser')");
 const helpers=`
 const read=()=>{const d=document.querySelector('#game').dataset;return{time:+d.simTime,active:+d.activeHero,cooldown:+d.cooldown,heroes:JSON.parse(d.heroes),machine:JSON.parse(d.puzzle).machine,shots:JSON.parse(d.shots||'[]'),items:JSON.parse(d.items),won:d.won==='true',failed:d.failed==='true'};};
 let s=read(),stage='start';const milestones=[],commands=[],held=new Set(),reviewUpper=${process.argv.includes('--upper')};
 const key=(name,down)=>window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key:name,code:name===' '?'Space':name.length===1?'Key'+name.toUpperCase():name,bubbles:true}));
 async function tick(id,input={}){
  if(s.active!==id){document.querySelectorAll('.hero-card')[id].click();await new Promise(requestAnimationFrame);s=read();}
  const next=new Set(['left','right','up','down'].filter(a=>input[a]).map(a=>({left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown'})[a]));
  for(const k of held)if(!next.has(k))key(k,false);for(const k of next)if(!held.has(k))key(k,true);held.clear();for(const k of next)held.add(k);
  const pulses=[];for(const [field,k]of [['jump',' '],['overhead',' '],['action','d'],['sword','z'],['interact','e']])if(input[field]){key(k,true);pulses.push(k);}
  const before=s.time;await new Promise(requestAnimationFrame);while(read().time<=before&&!read().failed&&!read().won)await new Promise(requestAnimationFrame);
  for(const k of pulses)key(k,false);s=read();if(s.failed&&stage!=='failure-proof')throw Error('Crew lost '+stage+' '+JSON.stringify(s));
 }
 async function until(id,predicate,input={},seconds=25){const end=s.time+seconds;while(!predicate(s)){if(s.won)return;if(s.time>end)throw Error('Timeout '+stage+' '+JSON.stringify(s));await tick(id,typeof input==='function'?input(s):input);}}
 async function move(id,x,seconds=25){await until(id,s=>Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<16,()=>{const h=s.heroes[id],error=x-h.x,stop=h.vx*h.vx/(2*(h.ground?[2600,2300,2100][id]:1875));return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};},seconds);}
 async function mark(name){stage=name;milestones.push({name,time:s.time,heroes:s.heroes,machine:s.machine});console.log('FREIGHT '+name+' '+s.time);
  if(reviewUpper?['inspector-charge','inspector-firing','inspector-recovered'].includes(name):['clear-first-riser','passenger-draft','draft-rising','winch-unrolling','trolley-crossing','cell-carried','second-riser-powered','inspector-charge','upper-inspector','high-exhaust-run','purging','shutter-retracting','cooled-departure','crew-departure'].includes(name)){
   for(const k of held)key(k,false);held.clear();await window.freightPhoto(name);s=read();
  }
 }
 `;
 let body=source.slice(bodyStart).replace(/\b(tick|until|move|mark|ferry)\(/g,'await $1(').replace('function await ferry(','async function ferry(');
 body=body.replace("await move(1,1580);await tick(1,{interact:true});","await mark('cell-carried');await move(1,1580);await tick(1,{interact:true});");
 body=body.replace('await move(2,480);await until(2,','await move(2,480);await until(2,s=>s.heroes[2].y+44<760,{},5);await mark(\'draft-rising\');await until(2,');
 body=body.replace("await tick(1,{left:true,sword:true});await until(1,","await tick(1,{left:true,sword:true});await until(1,s=>s.machine.rescuePose[0]>.3,{},1);await mark('winch-unrolling');await until(1,");
 body=body.replace('await move(id,1000,5);await until(id,',"await move(id,1000,5);if(id===2){await until(id,s=>s.machine.cart.x>1090,{},5);await mark('trolley-crossing');}await until(id,");
 body=body.replace("await mark('upper-return');","await until(2,s=>s.machine.inspectors[1].phase==='aim'&&s.machine.inspectors[1].combatClock>.2,{},3);await mark('inspector-charge');await mark('upper-return');");
 body=body.replace('await move(0,2330);',"await move(0,2330);await mark('purging');await until(0,s=>s.machine.shutter>.35,{},3);await mark('shutter-retracting');");
 body=body.replace('await move(2,3140);',"await move(2,3020);await mark('crew-departure');await move(2,3140);");
 if(process.argv.includes('--danger'))body=body.slice(0,body.indexOf("await mark('guarded-shooting')"))+"await mark('failure-proof');await move(1,970);await until(1,s=>s.failed,{},18);return{failed:s.failed,hp:s.heroes.map(h=>h.hp),time:s.time,milestones};}";
 if(process.argv.includes('--upper'))body=body.slice(0,body.indexOf("await mark('upper-return')"))+"await until(2,s=>s.machine.inspectors[1].phase==='fire',{},1);await mark('inspector-firing');await until(2,s=>s.machine.inspectors[1].phase==='recover',{},1);await mark('inspector-recovered');return{upper:true,hp:s.heroes.map(h=>h.hp),time:s.time,milestones};}";
 source=source.slice(0,begin)+helpers+body;
 const result=await page.evaluate('('+source+')()');
 if(process.argv.includes('--danger')){assert.equal(result.failed,true);assert.equal(result.hp[1],0);await page.screenshot({path:out+'/captures/actual-death.png'});}
 else if(process.argv.includes('--upper')){assert.equal(result.upper,true);assert.deepEqual(result.hp,[3,3,3]);}
 else{assert.equal(result.won,true);assert.deepEqual(result.hp,[3,3,3]);await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='complete');}
 assert.deepEqual(errors,[]);
 await page.keyboard.press('r');await page.waitForFunction(()=>{const d=document.querySelector('#game').dataset;return d.won==='false'&&JSON.parse(d.puzzle).machine.ventOpen===false;});
 await page.evaluate(()=>window.freightPhoto('reset'));
 fs.writeFileSync(out+'/route.json',JSON.stringify({result,captures,errors},null,2));console.log(JSON.stringify({won:result.won,hp:result.hp,time:result.time,captures:captures.length,errors}));
 }
}catch(e){await page.screenshot({path:out+'/captures/failure.png'});fs.writeFileSync(out+'/failure.json',JSON.stringify({error:String(e),errors,state:await page.locator('#game').evaluate(c=>({...c.dataset}))},null,2));throw e;}
finally{await browser.close();server?.close();}
