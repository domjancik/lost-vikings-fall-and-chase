import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate,REVIEW_SKIN,REVIEW_SHEETS} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),out=process.env.SEWER_MOTION_OUT||'output/sewer136/motion';
fs.mkdirSync(out,{recursive:true});
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:out,size:{width:1440,height:900}}});
const page=await context.newPage(),errors=[],photos=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error'&&!m.location().url.endsWith('favicon.ico'))errors.push(m.text());});
const read=()=>page.locator('#game').evaluate(c=>({time:+c.dataset.simTime,heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,art:JSON.parse(c.dataset.cycleArt||'{}'),camera:JSON.parse(c.dataset.camera)}));
async function photo(name){const file=out+'/'+name+'.png';await page.screenshot({path:file});photos.push({name,file,...await read()});}
await page.addInitScript(()=>{localStorage.setItem('last-call-zoom','2');localStorage.setItem('last-call-sound','off');});
let video;
try{
 await reviewNavigate(page,'http://127.0.0.1:'+server.address().port+'/?campaign=fall&release=sewer136-motion');
 await page.locator('#start-picker .level-card[data-round="10"] canvas[data-ready="true"]').waitFor();
 await page.locator('#start-picker .level-card[data-round="10"]').click();
 const intro=await page.evaluate(async()=>{
  const trace=[];let last=-1;const end=performance.now()+15000;
  while(performance.now()<end){
   await new Promise(requestAnimationFrame);const c=document.querySelector('#game'),time=+c.dataset.simTime;
   if(time===last)continue;last=time;
   const machine=JSON.parse(c.dataset.puzzle).machine,heroes=JSON.parse(c.dataset.heroes);
   trace.push({time,globe:machine.globe,heroes:heroes.map(h=>({id:h.id,x:h.x,y:h.y,ground:h.ground})),paused:c.dataset.paused});
   if(machine.globe?.phase==='gone')return trace;
  }
  throw Error('Globe intro did not finish');
 });
 const phases=[...new Set(intro.map(a=>a.globe.phase))];assert.deepEqual(phases,['fall','bounce','settle','hop','run','gone']);
 const firstContact=intro.find(a=>a.globe.bounces>=1);assert.ok(firstContact.heroes.every(h=>!h.ground),'globe reaches floor before all Vikings');
 assert.ok(intro.filter(a=>a.globe.phase==='bounce').at(-1).globe.x>intro[0].globe.x);
 const settle=intro.filter(a=>a.globe.phase==='settle');assert.ok(settle.length>=5);
 assert.ok(intro.some(a=>a.globe.phase==='hop'&&a.globe.vy<0),'autonomous upward hop');
 const running=intro.filter(a=>a.globe.phase==='run');assert.ok(running.length>5);
 assert.ok(running.every(a=>a.globe.legs===1&&a.globe.legCount===6));
 assert.ok(running.at(-1).globe.x>running[0].globe.x+100);assert.ok(intro.every(a=>a.paused==='false'));
 await photo('intro-finished');
 // The route uses the game's ordinary keyboard events and actual inventory UI.
 await page.evaluate(async()=>{
  const read=()=>{const c=document.querySelector('#game');return{time:+c.dataset.simTime,h:JSON.parse(c.dataset.heroes)[0]};};
  const key=(key,down)=>window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key,code:key.startsWith('Arrow')?key:'Key'+key.toUpperCase(),bubbles:true}));
  const frame=()=>new Promise(requestAnimationFrame);let held=null;
  async function move(x){const end=read().time+10;while(true){const {h,time}=read();if(time>end)throw Error('Cannot reach '+x);const error=x-h.x,stop=h.vx*h.vx/(2*2600);if(Math.abs(error)<3&&Math.abs(h.vx)<10)break;const next=Math.abs(error)>stop+2?(error>0?'ArrowRight':'ArrowLeft'):null;if(next!==held){if(held)key(held,false);if(next)key(next,true);held=next;}await frame();}if(held)key(held,false);held=null;}
  async function pulse(k){key(k,true);const t=read().time;do{await frame();}while(read().time<=t);key(k,false);await frame();}
  for(const x of [390,445,500]){await move(x);await pulse('e');}
 });
 assert.deepEqual((await read()).heroes[0].inventory.slice(0,3),['inspectionLamp','lampOil','bullseyeLens']);
 await page.locator('#bag').click();await page.locator('#inventory-dialog').waitFor({state:'visible'});
 await page.locator('#inventory-slots button[data-slot="2"]').click();await page.locator('#close-inventory').click();
 await page.keyboard.press('q');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.lamp.lens);
 await page.waitForTimeout(700);assert.equal((await read()).machine.lamp.focused,true);assert.equal((await read()).heroes[0].face,1);
 await photo('fire-early');
 const sampling=page.evaluate(async()=>{
  const samples=[],target={x:680,y:690};let last=-1;
  while(samples.length<120){
   await new Promise(requestAnimationFrame);const c=document.querySelector('#game'),time=+c.dataset.simTime;if(time===last)continue;last=time;
   const art=JSON.parse(c.dataset.cycleArt),lamp=art.lamps.find(l=>l.portable&&!l.spill),camera=JSON.parse(c.dataset.camera);
   const x=Math.round(target.x-camera.x),y=Math.round(target.y-camera.y),pixels=c.getContext('2d').getImageData(x-4,y-4,8,8).data;
   let luminance=0;for(let n=0;n<pixels.length;n+=4)luminance+=(.2126*pixels[n]+.7152*pixels[n+1]+.0722*pixels[n+2])/64;
   samples.push({time,lamp,luminance,target,camera,paused:c.dataset.paused});
  }return samples;
 });
 await page.waitForTimeout(900);await photo('fire-mid');await page.waitForTimeout(900);await photo('fire-late');
 const samples=await sampling,range=key=>Math.max(...samples.map(a=>a.lamp[key]))-Math.min(...samples.map(a=>a.lamp[key]));
 assert.ok(samples.every(a=>a.paused==='false'&&a.lamp.intensity>.88&&a.lamp.intensity<1));
 assert.ok(range('intensity')>.025&&range('intensity')<.12);
 assert.ok(range('aimSlope')>.005&&range('aimSlope')<.04);
 assert.equal(range('housingX'),0);assert.equal(range('housingY'),0);
 assert.ok(samples.every(a=>Math.abs(a.lamp.x-a.lamp.housingX)<=2&&Math.abs(a.lamp.y-a.lamp.housingY)<=2));
 assert.ok(range('x')>0||range('y')>0);
 const luminances=samples.map(a=>a.luminance),luminanceRange=Math.max(...luminances)-Math.min(...luminances);
 assert.ok(luminanceRange>.1,'actual fixed-world canvas photometry must change');
 await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.paused==='true');
 const pauseBefore=await read();await page.waitForTimeout(400);const pauseAfter=await read();
 assert.equal(pauseBefore.time,pauseAfter.time);assert.deepEqual(pauseBefore.art.lamps,pauseAfter.art.lamps);
 assert.deepEqual(errors,[]);assert.deepEqual((await read()).heroes.map(h=>h.hp),[3,3,3]);
 const result={skin:REVIEW_SKIN,sheets:REVIEW_SHEETS,phases,intro,samples,photos,errors,paused:false,pauseCheck:{durationMs:400,timeBefore:pauseBefore.time,timeAfter:pauseAfter.time,identicalLamps:true},normalControls:true,metrics:{seconds:samples.at(-1).time-samples[0].time,intensityRange:range('intensity'),aimRange:range('aimSlope'),wickXRange:range('x'),wickYRange:range('y'),luminanceRange},photometry:'8x8 raw production canvas pixels at fixed world (680,690), mapped by each frame camera; includes fog/composition'};
 fs.writeFileSync(out+'/motion.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result.metrics));
}catch(e){await page.screenshot({path:out+'/failure.png'});fs.writeFileSync(out+'/failure.json',JSON.stringify({error:String(e),state:await read(),errors},null,2));throw e;}
finally{video=await page.video()?.path();await context.close();await browser.close();await new Promise(r=>server.close(r));if(video)fs.writeFileSync(out+'/video.json',JSON.stringify({file:video,unedited:true,skin:REVIEW_SKIN,sheets:REVIEW_SHEETS},null,2));}
