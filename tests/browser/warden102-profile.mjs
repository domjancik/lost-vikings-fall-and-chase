import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const out=process.env.WARDEN_PROFILE_OUT||'before';fs.mkdirSync('output/warden102',{recursive:true});
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[],errors=[];
try{
 const page=await browser.newPage({viewport:{width:844,height:390},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 page.on('pageerror',e=>errors.push(String(e)));
 await page.route('**/game.js*',async route=>{
  let body=fs.readFileSync('dist/game.js','utf8');
  body=body.replace('function draw(){','function draw(){const profileStart=performance.now();globalThis.__drawCalls=0;globalThis.__filteredCalls=0;');
  body=body.replace('const target=cameraTarget(','const target=globalThis.__profileCamera??cameraTarget(');
  body=body.replace('drawLabels(labels,labelQueue,camera,canvas.clientHeight/sceneHeight,window.devicePixelRatio||1,vertical);','drawLabels(labels,labelQueue,camera,canvas.clientHeight/sceneHeight,window.devicePixelRatio||1,vertical);if(globalThis.__profileFrames)globalThis.__profileFrames.push({ms:performance.now()-profileStart,calls:globalThis.__drawCalls,filtered:globalThis.__filteredCalls});');
  await route.fulfill({body,contentType:'text/javascript'});
 });
 await page.addInitScript(()=>{
  localStorage.setItem('last-call-story-cards','off');
  const draw=CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage=function(...args){globalThis.__drawCalls=(globalThis.__drawCalls||0)+1;if(this.filter!=='none')globalThis.__filteredCalls=(globalThis.__filteredCalls||0)+1;return draw.apply(this,args);};
 });
 await page.goto('http://127.0.0.1:'+server.address().port+'/?campaign=cycle');
 await page.locator('#start-picker .level-card[data-round="5"]').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 const session=await page.context().newCDPSession(page);await session.send('Emulation.setCPUThrottlingRate',{rate:6});
 for(const zoom of [1,2]){
  if(await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom)!==zoom)await page.locator('#zoom').click();
  await page.evaluate(()=>{globalThis.__profileCamera={x:800,y:350};});await page.waitForTimeout(1500);
  await page.evaluate(()=>{globalThis.__profileFrames=[];});await page.waitForTimeout(4000);
  const frames=await page.evaluate(()=>{const f=globalThis.__profileFrames;globalThis.__profileFrames=null;return f;});
  const ms=frames.map(f=>f.ms).sort((a,b)=>a-b),sum=key=>frames.reduce((n,f)=>n+f[key],0)/frames.length;
  results.push({zoom,frames:frames.length,medianDrawMs:ms[Math.floor(ms.length*.5)],p95DrawMs:ms[Math.floor(ms.length*.95)],meanDrawImageCalls:sum('calls'),meanFilteredCalls:sum('filtered')});
  await page.screenshot({path:`output/warden102/${out}-mobile-${zoom}x.png`});
 }
 const receipt={device:'844x390, DPR2, Chrome headless, CPU throttle6; camera-only boss-bay diagnostic',results,errors};
 fs.writeFileSync('output/warden102/profile-'+out+'.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
 if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close();await new Promise(r=>server.close(r));}
