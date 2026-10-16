import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {createDevServer} from '../../tools/dev/server.mjs';import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const label=process.argv.includes('--baseline')?'baseline':'final',live=process.argv.includes('--live'),out=process.env.DEPTH_PERF_OUT||'output/depth146/'+label;fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true}),cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 if(label==='baseline')await page.route('**/cycle-render.js*',route=>route.fulfill({contentType:'text/javascript',body:fs.readFileSync('tests/fixtures/depth146-baseline-render.js','utf8')}));
 await reviewNavigate(page,(live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?campaign=fall&release=depth146');await page.locator('#start-picker .level-card[data-round="0"] canvas[data-ready="true"]').waitFor();await page.locator('#start-picker .level-card[data-round="0"]').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');await page.waitForTimeout(500);
 await cdp.send('Profiler.enable');await cdp.send('Profiler.start');
 const frames=await page.evaluate(async()=>{const samples=[];let prev=performance.now();for(let n=0;n<120;n++){await new Promise(requestAnimationFrame);const t=performance.now();samples.push(t-prev);prev=t;}return samples;});
 const {profile}=await cdp.send('Profiler.stop');fs.writeFileSync(out+'/cpu.json',JSON.stringify(profile));
 const counts=new Map();for(const id of profile.samples||[])counts.set(id,(counts.get(id)||0)+1);const top=profile.nodes.map(n=>({name:n.callFrame.functionName,file:n.callFrame.url.split('/').pop(),samples:counts.get(n.id)||0})).sort((a,b)=>b.samples-a.samples).slice(0,18);
 const scenes=await page.evaluate(async()=>{
  const {createState}=await import('/engine.js'),{drawCycleWorld}=await import('/cycle-render.js');
  const s=createState(0,'cycle'),canvas=document.createElement('canvas');canvas.width=422;canvas.height=195;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
  const stats=[];for(const camera of [{x:0,y:730},{x:900,y:450},{x:1950,y:0}]){
   const times=[];let draws=0,filters=0;const draw=c.drawImage.bind(c);c.drawImage=(...a)=>{draws++;return draw(...a);};
   const descriptor=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,'filter');Object.defineProperty(c,'filter',{configurable:true,get(){return descriptor.get.call(c);},set(v){filters++;descriptor.set.call(c,v);}});
   s.machine.released=true;s.machine.highArrival=true;s.machine.brakePose=1;s.machine.damper=1;
   const view={width:844,height:390,mobile:true};let ready,start=performance.now();do{ready=drawCycleWorld(c,s,camera,view);if(performance.now()-start>6000)throw Error('Scene art not registered');await new Promise(requestAnimationFrame);}while(!ready.ready||!ready.gate.ready||!ready.fan);draws=0;filters=0;
   for(let n=0;n<100;n++){s.time=n/60;c.setTransform(.5,0,0,.5,-camera.x/2,-camera.y/2);const start=performance.now();drawCycleWorld(c,s,camera,view);times.push(performance.now()-start);}
   c.drawImage=draw;delete c.filter;times.sort((a,b)=>a-b);stats.push({camera,p50:times[50],p95:times[95],drawsPerFrame:draws/100,filtersPerFrame:filters/100});
  }return stats;
 });frames.sort((a,b)=>a-b);const result={label,cpuThrottle:4,mobileEmulation:true,raf:{p50:frames[60],p95:frames[114]},top,scenes};fs.writeFileSync(out+'/perf.json',JSON.stringify(result,null,2));await page.screenshot({path:out+'/mobile.png'});if(label==='final')for(const scene of scenes){assert.ok(scene.drawsPerFrame<120);assert.equal(scene.filtersPerFrame,0);}console.log(JSON.stringify(result));
}finally{await browser.close();server?.close();}
