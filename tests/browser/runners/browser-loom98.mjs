import {createRequire} from 'node:module';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),live=!!process.env.LOOM98_LIVE,root=path.resolve('output/release-loom98/dist'),port=process.argv.includes('--miss')?3056:3054;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json'};
const server=live?null:http.createServer((req,res)=>{const url=req.url.split('?')[0];if(url==='/favicon.ico'){res.writeHead(204);res.end();return;}const f=path.resolve(root,'.'+(url==='/'?'/index.html':url));if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(f,(e,b)=>{res.writeHead(e?404:200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});res.end(e?'Missing':b);});}).listen(port,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],shots=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());else if(m.text().startsWith('LOOM '))console.log(m.text());});
fs.mkdirSync('output/loom98',{recursive:true});fs.mkdirSync('output/playwright',{recursive:true});
const probe=process.argv.includes('--miss'),offset=Number(process.env.LOOM98_OFFSET||0);
const prefix=(live?'live-':'')+(probe?'miss-':offset?'offset-':'');
await page.exposeBinding('loomPhoto',async(_,label)=>{
 if(label.includes('thread')||label==='miss'||label==='first-aperture'){
  // Genuine look-up control frames the aperture below the pause badge.
  await page.keyboard.down('ArrowUp');await page.waitForTimeout(250);
 }
 await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.paused==='true');
 for(const [name,size]of [['2x',{width:1440,height:900}],['1x',{width:1440,height:900}],['portrait',{width:430,height:780}],['landscape',{width:844,height:390}]]){
  const zoom=name==='1x'||name==='portrait'&&(label.startsWith('cam-')||label==='open-shutter-inspection')?1:2;
  const current=await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom);if(current!==zoom)await page.locator('#zoom').click();await page.setViewportSize(size);await page.waitForTimeout(450);
  const file='output/playwright/loom98-'+prefix+label+'-'+name+'.png';await page.screenshot({path:file});shots.push({label,name,file,state:await page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,camera:JSON.parse(c.dataset.camera),art:JSON.parse(c.dataset.cycleArt||'null')}))});
 }
 await page.setViewportSize({width:1440,height:900});await page.locator('#pause').click();await page.keyboard.up('ArrowUp');
});
try{
 await page.goto((live?'https://united-marsh-6ppd.here.now/':`http://127.0.0.1:${port}/`)+'?release=loom98');
 await page.evaluate(()=>localStorage.setItem('last-call-story-cards','off'));
 await page.locator('#start-picker [data-campaign-option="cycle"]').click();
 await page.waitForFunction(()=>{const cs=[...document.querySelectorAll('#start-picker canvas')];return cs.length===7&&cs.every(c=>c.dataset.ready==='true');});
 assert.equal(new Set(await page.locator('#start-picker canvas').evaluateAll(cs=>cs.map(c=>c.toDataURL()))).size,7);
 await page.locator('#start-picker .level-card[data-round="6"]').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.round==='6');
 await page.waitForTimeout(1000);await page.locator('#restart').click();await page.waitForFunction(()=>+document.querySelector('#game').dataset.simTime<.2);
 let source=fs.readFileSync('tests/routes/loom-route96.js','utf8');source=source.slice(source.indexOf('export function')).replace('export function simulateLoomRoute()','async function playLoom()');
 const begin=source.indexOf(' const s=createState'),end=source.indexOf(" awaitMarkPlaceholder");
 const markEnd=source.indexOf(" mark('board-piston')");
 const helpers=`
 const read=()=>{const d=document.querySelector('#game').dataset;return{time:+d.simTime,active:+d.activeHero,heroes:JSON.parse(d.heroes),machine:JSON.parse(d.puzzle).machine,won:d.won==='true',failed:d.failed==='true'};};
 let s=read(),stage='start';const milestones=[],commands=[],held=new Set();
 const key=(name,down)=>window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key:name,code:name===' '?'Space':name.length===1?'Key'+name.toUpperCase():name,bubbles:true}));
 async function tick(id,input={}){
  if(s.active!==id){document.querySelectorAll('.hero-card')[id].click();await new Promise(requestAnimationFrame);s=read();}
  const next=new Set(['left','right','up','down'].filter(a=>input[a]).map(a=>({left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown'})[a]));
  for(const k of held)if(!next.has(k))key(k,false);for(const k of next)if(!held.has(k))key(k,true);held.clear();for(const k of next)held.add(k);
  const pulses=[];for(const [field,k]of [['jump',' '],['action','d'],['sword','z'],['interact','e']])if(input[field]){key(k,true);pulses.push(k);}
  const before=s.time;await new Promise(requestAnimationFrame);while(read().time<=before)await new Promise(requestAnimationFrame);
  for(const k of pulses)key(k,false);s=read();if(s.failed)throw Error('Crew lost '+stage);
 }
 async function until(id,predicate,input={},seconds=25){const end=s.time+seconds;while(!predicate(s)){if(s.won)return;if(s.time>end)throw Error('Timeout '+stage+' '+JSON.stringify(s));await tick(id,typeof input==='function'?input(s):input);}}
 async function move(id,x,seconds=25){await until(id,s=>Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<16,()=>{const h=s.heroes[id],error=x-h.x,brake=h.ground?([2600,2300,2100][id]):1875,stop=h.vx*h.vx/(2*brake);return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};},seconds);}
 async function mark(name){stage=name;milestones.push({name,time:s.time,heroes:s.heroes,machine:s.machine});console.log('LOOM '+name+' '+s.time);if(['initial','lift-high','shield-step','bobbin-taken','first-aperture','miss','first-thread-seated','safe-clutch-dock','second-thread-seated','sky-repaired','retained-shutter','open-shutter-inspection','all-crew-reunion','cam-rest','cam-descending','cam-impact','cam-recovery'].includes(name)){for(const k of [...held])if(k!=='ArrowUp'){key(k,false);held.delete(k);}await window.loomPhoto(name);for(const k of held)key(k,false);held.clear();s=read();}}
 `;
 source=source.slice(0,begin)+helpers+source.slice(markEnd);
 const bodyStart=source.indexOf(" mark('board-piston')");
 let body=source.slice(bodyStart).replace(/\b(tick|until|move|mark|thread)\(/g,'await $1(').replace('function await thread(','async function thread(');
 source=source.slice(0,bodyStart)+body;
 source=source.replace("await mark('board-piston');","await mark('initial');await mark('board-piston');");
 source=source.replace('await move(0,3020);',"await move(0,2860);await mark('open-shutter-inspection');await move(0,3020);");
 if(!probe&&!live&&!offset)source=source.replace("await mark('release-pawl');",`await mark('release-pawl');await move(0,1620);
 for(const [name,lo,hi]of [['cam-rest',.4,1],['cam-descending',2.8,2.9],['cam-impact',3.1,3.22],['cam-recovery',3.55,3.7]]){await until(0,s=>s.heroes[0].ground,{},2);await until(0,s=>{const t=(s.machine.phase%(Math.PI*2))/(Math.PI*2)*4.8;return t>lo&&t<hi;},{},12);await tick(0,{jump:true,up:true});await until(0,s=>Math.abs(s.heroes[0].vy)<50,{up:true},1);await mark(name);}await until(0,s=>s.heroes[0].ground,{},2);`);
 if(offset)source=source.replace('eye.x-22-230*t','eye.x-22-230*t+'+offset);
 if(probe)source=source.replace("await mark('first-aperture');",`await mark('first-aperture');await until(0,s=>s.machine.threadAttempt&&!s.machine.threadAttempt.accepted,{right:true},2);await mark('miss');return{missed:true,owner:s.machine.owner,guides:s.machine.guides,hp:s.heroes.map(h=>h.hp),time:s.time,milestones};`);
 const result=await page.evaluate('('+source+')()');
 if(probe){assert.equal(result.missed,true);assert.equal(result.guides,0);assert.equal(result.owner,0);}else assert.equal(result.won,true);
 assert.deepEqual(result.hp,[3,3,3]);assert.deepEqual(errors,[]);
 if(!probe)await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='complete');
 await page.keyboard.press('r');await page.waitForFunction(()=>{const d=document.querySelector('#game').dataset;return d.won==='false'&&JSON.parse(d.puzzle).machine.guides===0;});
 assert.ok((await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.heroes))).every(h=>h.hp===3&&!h.dead));
 await page.evaluate(()=>window.loomPhoto('reset'));
 fs.writeFileSync('output/loom98/'+prefix+'route.json',JSON.stringify({result,shots,errors},null,2));
 console.log(JSON.stringify({won:result.won,hp:result.hp,time:result.time,shots:shots.length,errors}));
}catch(e){await page.screenshot({path:'output/playwright/loom98-'+prefix+'failure.png'});fs.writeFileSync('output/loom98/'+prefix+'failure.json',JSON.stringify({error:String(e),shots,errors,state:await page.locator('#game').evaluate(c=>({...c.dataset}))},null,2));throw e;}
finally{await browser.close();server?.close();}
