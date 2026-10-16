import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),touch=process.argv.includes('--touch'),live=process.argv.includes('--live'),out=process.env.ALEHALL_OUT||'output/alehall135/'+(touch?'touch':'desktop');
fs.mkdirSync(out,{recursive:true});const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:touch?{width:430,height:780}:{width:1440,height:900},hasTouch:touch,isMobile:touch}),errors=[],captures=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.text().startsWith('HALL '))console.log(m.text());});
const read=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,camera:JSON.parse(c.dataset.camera),art:JSON.parse(c.dataset.cycleArt||'{}'),round:+c.dataset.round,transition:c.dataset.transition}));
await page.addInitScript(()=>{localStorage.setItem('last-call-cycle52-round','11');localStorage.setItem('last-call-zoom','2');localStorage.setItem('last-call-sound','off');});
await page.exposeBinding('pubTap',async(_,action)=>{const key={jump:'primary',sword:'primary',action:'secondary',interact:'interact',item:'item'}[action];await page.locator('[data-key='+key+']').tap();});
await page.exposeBinding('pubPhoto',async(_,label)=>{
 const before=await read();if(before.round!==11)return;
 if(label==='fall'){await page.screenshot({path:out+'/'+label+'.png'});captures.push({label,state:before});return;}
 await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.paused==='true');
 for(const [suffix,width,height,zoom]of [['2x',1440,900,2],['1x',1440,900,1],['portrait',430,780,2],['landscape',844,390,2]]){
  while(await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom)!==zoom)await page.locator('#zoom').click();
  await page.setViewportSize({width,height});await page.waitForTimeout(300);await page.screenshot({path:out+'/'+label+'-'+suffix+'.png'});captures.push({label,suffix,state:await read()});
 }
 await page.setViewportSize(touch?{width:430,height:780}:{width:1440,height:900});await page.waitForTimeout(100);await page.locator('#pause').click();
});
try{
 await reviewNavigate(page,(live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?campaign=cycle&release=alehall135');
 await page.locator('#start-picker .level-card[data-round="11"]').click();await page.waitForFunction(()=>{const d=document.querySelector('#game').dataset;return d.transition==='idle'&&JSON.parse(d.cycleArt||'{}').ready;});
 if(process.argv.includes('--smoke')){await page.screenshot({path:out+'/initial.png'});console.log(JSON.stringify(await read()));}
 else{
  let source=fs.readFileSync('tests/routes/alehall135-route.js','utf8');source=source.slice(source.indexOf('export function')).replace('export function simulateAlehallRoute(hz=120)','async function playHall()');
  const begin=source.indexOf('const s=createState'),bodyStart=source.indexOf(" mark('push-sledge')"),bodyEnd=source.indexOf(' const compact=');
  const helpers=`
  const read=()=>{const d=document.querySelector('#game').dataset;return{time:+d.simTime,active:+d.activeHero,heroes:JSON.parse(d.heroes),machine:JSON.parse(d.puzzle).machine,won:d.won==='true',failed:d.failed==='true'};};
  let s=read(),stage='start',crack=false,broken=false;const milestones=[],held=new Set(),key=(k,down)=>window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key:k,code:k===' '?'Space':k.length===1?'Key'+k.toUpperCase():k,bubbles:true}));
  async function tick(id,input={}){
   if(s.active!==id){document.querySelector('.hero-card[data-hero="'+id+'"]').click();await new Promise(requestAnimationFrame);s=read();}
   const next=new Set(['left','right','up','down'].filter(k=>input[k]).map(k=>({left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown'})[k]));for(const k of held)if(!next.has(k))key(k,false);for(const k of next)if(!held.has(k))key(k,true);held.clear();for(const k of next)held.add(k);
   const pulses=[];for(const [field,k]of [['jump',' '],['sword','z'],['action','d'],['interact','e'],['item','q']])if(input[field]){if(${touch})await window.pubTap(field);else{key(k,true);pulses.push(k);}}
   const before=s.time,start=performance.now();await new Promise(requestAnimationFrame);while(read().time<=before&&!read().won&&!read().failed){if(performance.now()-start>5000)throw Error('Simulation stopped '+stage);await new Promise(requestAnimationFrame);}for(const k of pulses)key(k,false);s=read();if(s.failed)throw Error('Crew lost '+stage);
   if(!crack&&s.machine.phase==='crack'&&s.machine.crackTime>.7){crack=true;for(const k of held)key(k,false);held.clear();await window.pubPhoto('cracking');s=read();}
   if(!broken&&s.machine.phase==='fall'&&s.machine.fallTime>.1&&!s.won){broken=true;for(const k of held)key(k,false);held.clear();await window.pubPhoto('floor-break');s=read();}
  }
  async function until(id,predicate,input={},seconds=20){const end=s.time+seconds;while(!predicate(s)){if(s.won)return;if(s.time>end)throw Error('Timeout '+stage+' '+JSON.stringify(s));await tick(id,typeof input==='function'?input(s):input);}}
  async function move(id,x){await until(id,s=>Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<15,()=>{const h=s.heroes[id],error=x-h.x,stop=h.vx*h.vx/(2*[2600,2300,2100][id]);return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};});}
  async function mark(name){stage=name;milestones.push({name,time:s.time,heroes:s.heroes,machine:s.machine});console.log('HALL '+name+' '+s.time);if(['push-sledge','tray-loaded','delivery-open','key-picked','door-open','inspection','fall'].includes(name)){for(const k of held)key(k,false);held.clear();await window.pubPhoto(name);s=read();}}
  `;
  let body=source.slice(bodyStart,bodyEnd).replace(/\b(tick|until|move|mark)\(/g,'await $1(');
  body=body.replace("await until(2,s=>s.machine.cups.mode==='carried',{},2);","await until(2,s=>s.machine.cups.mode==='carried',{},2);await mark('tray-loaded');");
  body=body.replace("await until(1,s=>s.machine.wrapCut,{},1);","await until(1,s=>s.machine.wrapCut,{},1);await mark('delivery-open');");
  body=body.replace("await until(0,s=>s.heroes[0].inventory.includes('hallKey'),{},1);","await until(0,s=>s.heroes[0].inventory.includes('hallKey'),{},1);await mark('key-picked');");
  body=body.replace("await until(0,s=>s.machine.door.pose===1,{},2);","await until(0,s=>s.machine.door.pose===1,{},2);await mark('door-open');");
  source=source.slice(0,begin)+helpers+body+'return {won:s.won,hp:s.heroes.map(h=>h.hp),time:s.time,milestones};}';
  const result=await page.evaluate('('+source+')()');assert.equal(result.won,true);assert.deepEqual(result.hp,[3,3,3]);
  await page.waitForFunction(()=>document.querySelector('#game').dataset.round==='10');const arrival=await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.transitionDetail||'{}'));assert.equal(arrival.method,'fall');
  await page.screenshot({path:out+'/sewer-arrival.png'});assert.deepEqual(errors,[]);fs.writeFileSync(out+'/route.json',JSON.stringify({result,captures,arrival,errors,touchActions:touch},null,2));console.log(JSON.stringify({won:result.won,hp:result.hp,time:result.time,captures:captures.length,arrival,errors}));
 }
}catch(e){await page.screenshot({path:out+'/failure.png'});fs.writeFileSync(out+'/failure.json',JSON.stringify({error:String(e),state:await read(),errors,captures},null,2));throw e;}
finally{await browser.close();server?.close();}
