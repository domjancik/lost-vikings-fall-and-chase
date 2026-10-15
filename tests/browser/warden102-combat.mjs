import {reviewNavigate} from './review-skin.mjs';
import fs from 'node:fs';import {createRequire} from 'node:module';import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),errors=[],evidence=[];
try{
 const page=await browser.newPage({viewport:{width:844,height:390},deviceScaleFactor:2,isMobile:true,hasTouch:true});page.on('pageerror',e=>errors.push(String(e)));
 await page.route('**/game.js*',async route=>{
  let body=fs.readFileSync('dist/game.js','utf8').replace('function draw(){','function draw(){const profileStart=performance.now();');
  body=body.replace('const target=cameraTarget(','const target=globalThis.__profileCamera??cameraTarget(');
  body=body.replace('drawLabels(labels,labelQueue,camera,canvas.clientHeight/sceneHeight,window.devicePixelRatio||1,vertical);','drawLabels(labels,labelQueue,camera,canvas.clientHeight/sceneHeight,window.devicePixelRatio||1,vertical);if(globalThis.__profileFrames)globalThis.__profileFrames.push(performance.now()-profileStart);');
  await route.fulfill({body,contentType:'text/javascript'});
 });
 await page.addInitScript(()=>localStorage.setItem('last-call-story-cards','off'));await reviewNavigate(page,'http://127.0.0.1:'+server.address().port+'/?campaign=cycle&skin=imagegen90');
 await page.locator('#start-picker .level-card[data-round="5"]').click();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 await page.keyboard.press('3');await page.keyboard.press('Space');await page.keyboard.down('ArrowRight');
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[2].x>=1200);await page.keyboard.up('ArrowRight');
 const cdp=await page.context().newCDPSession(page);
 for(const phase of ['laser','stomp']){
  if(phase==='laser')await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.laser.phase==='fire');
  else await page.waitForFunction(()=>{const c=document.querySelector('#game'),g=JSON.parse(c.dataset.puzzle).machine,age=+c.dataset.simTime-g.slamAt;return age>.12&&age<.25;});
  await page.keyboard.press('Escape');
  for(const zoom of [1,2]){
   if(await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom)!==zoom)await page.locator('#zoom').click();
   await page.evaluate(({zoom})=>{globalThis.__profileCamera={x:900,y:zoom===1?350:590};},{zoom});await page.waitForTimeout(700);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:6});await page.evaluate(()=>{globalThis.__profileFrames=[];});await page.waitForTimeout(2200);
   const frames=await page.evaluate(()=>{const f=globalThis.__profileFrames;globalThis.__profileFrames=null;return f.sort((a,b)=>a-b);});
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
   const file=`output/warden102/${phase}-mobile-${zoom}x.png`;await page.screenshot({path:file});
   const state=await page.locator('#game').evaluate(c=>({camera:JSON.parse(c.dataset.camera),optics:JSON.parse(c.dataset.wardenOptics),machine:JSON.parse(c.dataset.puzzle).machine,art:JSON.parse(c.dataset.cycleArt),audio:JSON.parse(c.dataset.audio),heroes:JSON.parse(c.dataset.heroes)}));
   if(!state.optics.regions.some(r=>r.kind===(phase==='laser'?'laser':'slam')))throw Error('Missing active refraction '+phase);
   evidence.push({phase,zoom,file,samples:frames.length,medianDrawMs:frames[Math.floor(frames.length*.5)],p95DrawMs:frames[Math.floor(frames.length*.95)],...state});
  }
  if(phase==='laser'){await page.keyboard.press('Escape');await page.keyboard.press('d');await page.keyboard.press('ArrowLeft');}
 }
 fs.writeFileSync('output/warden102/combat.json',JSON.stringify({evidence,errors},null,2));if(errors.length)throw Error(errors.join('\n'));
 console.log(JSON.stringify({results:evidence.map(e=>({phase:e.phase,zoom:e.zoom,medianDrawMs:e.medianDrawMs,p95DrawMs:e.p95DrawMs,copiedPixels:e.optics.copiedPixels})),errors}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
