import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate} from './review-skin.mjs';
import {railLength} from '../../src/levels/orbit/magnetic.js';
import {createState} from '../../src/core/engine.js';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),live=!!process.env.LODE_LIVE,out='assets/lode123/'+(live?'live':process.argv.includes('--push')?'contact':process.argv.includes('--brake')?'brake':'route');fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:process.argv.includes('--touch')?{width:844,height:390}:{width:1440,height:900},hasTouch:process.argv.includes('--touch'),isMobile:process.argv.includes('--touch')}),errors=[],captures=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'&&!m.location().url.endsWith('favicon.ico'))errors.push(m.text());if(m.text().startsWith('LODE '))console.log(m.text());});
const read=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,art:JSON.parse(c.dataset.cycleArt||'null'),camera:JSON.parse(c.dataset.camera),time:+c.dataset.simTime}));
await page.exposeBinding('lodePhoto',async(_,name)=>{
 const liveFile=out+'/'+name+'-live.png';await page.screenshot({path:liveFile});captures.push({file:liveFile,name,label:'live',...await read()});
 await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.paused==='true');
 for(const [size,zoom,label]of [[{width:1440,height:900},2,'2x'],[{width:1440,height:900},1,'1x'],[{width:430,height:780},2,'portrait'],[{width:844,height:390},2,'landscape']]){
  await page.setViewportSize(size);if((await read()).camera.zoom!==zoom)await page.locator('#zoom').click();await page.waitForTimeout(350);const file=out+'/'+name+'-'+label+'.png';await page.screenshot({path:file});captures.push({file,name,label,...await read()});
 }
 await page.setViewportSize({width:1440,height:900});await page.locator('#pause').click();
});
try{
 await reviewNavigate(page,(live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?campaign=cycle&release=lode123');await page.evaluate(()=>localStorage.setItem('last-call-story-cards','off'));
 await page.locator('#start-picker .level-card[data-round="9"]').click();await page.waitForFunction(()=>{const d=document.querySelector('#game').dataset;return d.round==='9'&&JSON.parse(d.cycleArt||'{}').ready;});
 await page.locator('#restart').click();
 if(process.argv.includes('--touch')){
 const cdp=await page.context().newCDPSession(page);await page.locator('[data-key="interact"]').tap();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].inventory.includes('magneticShoes'));
 const button=await page.locator('[data-key="right"]').boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:button.x+button.width/2,y:button.y+button.height/2,id:1}]});await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x>740);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.locator('[data-key="item"]').tap();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].magnet?.plateId===0);
 await page.waitForTimeout(900);await page.screenshot({path:out+'/touch-attachment.png'});const state=await read();assert.equal(state.heroes[0].boots,true);assert.equal(state.heroes[0].magnet.pull,1);assert.deepEqual(errors,[]);fs.writeFileSync(out+'/touch.json',JSON.stringify({state,errors},null,2));console.log(JSON.stringify({touch:true,attached:true,errors}));
 }else if(process.argv.includes('--smoke')){await page.evaluate(()=>window.lodePhoto('initial'));assert.deepEqual(errors,[]);console.log(JSON.stringify({ready:true,errors}));}
 else{
 let source=fs.readFileSync('tests/routes/lode-route123.js','utf8'),body=source.slice(source.indexOf(" mark('service-shoes')")).replace(/\b(tick|until|move|railMove|mark)\(/g,'await $1(');
 if(process.argv.includes('--push')){const end=body.indexOf("await mark('sustained-ballast-push');")+"await mark('sustained-ballast-push');".length;body=body.slice(0,end)+"return{push:true,hp:s.heroes.map(h=>h.hp),time:s.time,milestones};}";}
 if(process.argv.includes('--brake')){const end=body.indexOf("await mark('brake-freed');")+"await mark('brake-freed');".length;body=body.slice(0,end)+"return{brake:true,hp:s.heroes.map(h=>h.hp),time:s.time,milestones};}";}
 const lengths=createState(9,'cycle').machine.plates.map(railLength);
 const helpers=`async function play(){
 const read=()=>{const d=document.querySelector('#game').dataset;return{time:+d.simTime,active:+d.activeHero,cooldown:+d.cooldown,heroes:JSON.parse(d.heroes),machine:JSON.parse(d.puzzle).machine,won:d.won==='true',failed:d.failed==='true'};};
 const lengths=${JSON.stringify(lengths)},railLength=p=>lengths[p.id],milestones=[],commands=[],held=new Set(),options={recall:${process.argv.includes('--recall')}};let s=read(),stage='start';
 const key=(k,down)=>window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key:k,code:k===' '?'Space':k.length===1?'Key'+k.toUpperCase():k,bubbles:true}));
 async function tick(id,input={}){if(s.active!==id){document.querySelectorAll('.hero-card')[id].click();await new Promise(requestAnimationFrame);s=read();}
 const next=new Set(['left','right','up','down'].filter(a=>input[a]).map(a=>({left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown'})[a]));for(const k of held)if(!next.has(k))key(k,false);for(const k of next)if(!held.has(k))key(k,true);held.clear();for(const k of next)held.add(k);
 const pulses=[];for(const [field,k]of [['jump',' '],['action','d'],['sword','z'],['interact','e'],['item','q']])if(input[field]){key(k,true);pulses.push(k);}const before=s.time,start=performance.now();await new Promise(requestAnimationFrame);while(read().time<=before&&!read().won&&!read().failed){if(performance.now()-start>5000)throw Error('Stopped '+stage);await new Promise(requestAnimationFrame);}for(const k of pulses)key(k,false);s=read();if(s.failed)throw Error('Crew lost '+stage);}
 async function until(id,predicate,input={},seconds=25){const end=s.time+seconds;while(!predicate(s)){if(s.won)return;if(s.time>end)throw Error('Timeout '+stage+' '+JSON.stringify(s));await tick(id,typeof input==='function'?input(s):input);}}
 async function move(id,x){await until(id,s=>Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<16,()=>{const h=s.heroes[id],error=x-h.x,stop=h.vx*h.vx/(2*(h.ground?[2600,2300,2100][id]:1875));return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};});}
 async function railMove(id,u){await until(id,s=>s.heroes[id].magnet&&Math.abs(s.heroes[id].magnet.u-u)<3&&Math.abs(s.heroes[id].magV)<16,()=>{const h=s.heroes[id],error=u-(h.magnet?.u??0),stop=(h.magV||0)**2/(2*[2600,2300,2100][id]);return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};},25);}
 async function mark(name){stage=name;console.log('LODE '+name+' '+s.time);milestones.push({name,time:s.time,heroes:s.heroes,machine:s.machine});if(['service-shoes','gallery-recovery','winding-wheel','hinged-crossing','inverted-ballast','mass-transfer','upper-lift','free-cap-0','recovered-crew','sustained-ballast-push','brake-aim','brake-freed'].includes(name)){if(name!=='sustained-ballast-push'){for(const k of held)key(k,false);held.clear();}await window.lodePhoto(name);for(const k of held)key(k,false);held.clear();s=read();}}
 `;
 const result=await page.evaluate('('+helpers+body+')()');assert.equal(process.argv.includes('--push')?result.push:process.argv.includes('--brake')?result.brake:result.won,true);assert.deepEqual(result.hp,[3,3,3]);assert.deepEqual(errors,[]);fs.writeFileSync(out+'/evidence.json',JSON.stringify({result,captures,errors},null,2));console.log(JSON.stringify({won:result.won,hp:result.hp,time:result.time,captures:captures.length,errors}));
 }
}catch(e){await page.screenshot({path:out+'/failure.png'});fs.writeFileSync(out+'/failure.json',JSON.stringify({error:String(e),errors,state:await read()},null,2));throw e;}
finally{await browser.close();server?.close();}
