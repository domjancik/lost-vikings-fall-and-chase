import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
fs.mkdirSync('output/walls101',{recursive:true});
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const errors=[],evidence=[];
try {
 for(const before of process.env.WALL_BACKINGS_ONLY?[false]:[true,false]){
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url());});
  // Only the camera target can be panned in diagnostics; game state is untouched.
  await page.route('**/game.js*',async route=>{
   const body=fs.readFileSync('dist/game.js','utf8').replace('const target=cameraTarget(','const target=globalThis.__wallCamera??cameraTarget(');
   await route.fulfill({contentType:'text/javascript',body});
  });
  if(before)await page.route('**/depth-render94.js*',async route=>{
   await route.fulfill({contentType:'text/javascript',body:execFileSync('git',['show','c41c562:src/render/depth-render94.js'],{encoding:'utf8'})});
  });
  await page.addInitScript(()=>localStorage.setItem('last-call-story-cards','off'));
  await page.goto('http://127.0.0.1:'+server.address().port+'/?campaign=cycle&skin=imagegen90');
  await page.locator('#start-picker .level-card[data-round="5"]').click();
  await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
  await page.locator('#pause').click();
  const shot=async name=>{
   await page.waitForTimeout(550);const file=`output/walls101/${before?'before':'after'}-${name}.png`;await page.screenshot({path:file});
   const data=await page.locator('#game').evaluate(c=>({camera:JSON.parse(c.dataset.camera),decor:JSON.parse(c.dataset.cycleArt).decor,heroes:JSON.parse(c.dataset.heroes)}));
   evidence.push({file,name,before,...data});
  };
  if(process.env.WALL_BACKINGS_ONLY){
   for(let round=0;round<6;round++){
    await page.evaluate(()=>{delete globalThis.__wallCamera;});
    await page.setViewportSize({width:1440,height:900});
    await page.locator('#rounds').click();await page.locator('#round-picker .level-card[data-round="'+round+'"]').click();
    await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').decor?.ready);
    if(await page.locator('#game').getAttribute('data-paused')!=='true')await page.locator('#pause').click();
    for(const zoom of [1,2]){
     if(await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom)!==zoom)await page.locator('#zoom').click();
     await page.locator('#game').evaluate(c=>{const b=JSON.parse(c.dataset.cycleArt).decor.wallBackings[0].room,cam=JSON.parse(c.dataset.camera);globalThis.__wallCamera={x:Math.max(0,b.x+b.w/2-cam.width/2),y:b.y+b.h/2-cam.height*.55};});
     await shot('backing-'+round+'-'+zoom+'x');
    }
    await page.setViewportSize({width:844,height:390});
    await page.locator('#game').evaluate(c=>{const b=JSON.parse(c.dataset.cycleArt).decor.wallBackings[0].room,cam=JSON.parse(c.dataset.camera);globalThis.__wallCamera={x:Math.max(0,b.x+b.w/2-cam.width/2),y:b.y+b.h/2-cam.height*.55};});
    await shot('backing-'+round+'-mobile');
   }
   await page.close();continue;
  }
  for(const zoom of [1,2]){
   if(await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom)!==zoom)await page.locator('#zoom').click();
   await shot('normal-'+zoom+'x');
   for(const [name,x,y]of [['left-upper',0,100],['service-stage',420,440],['right-upper',2200,100],['lower-room',1200,900]]){
    await page.evaluate(({x,y})=>{globalThis.__wallCamera={x,y};},{x,y});await shot(name+'-'+zoom+'x');
   }
   await page.evaluate(()=>{delete globalThis.__wallCamera;});
  }
  await page.setViewportSize({width:844,height:390});
  await page.evaluate(()=>{globalThis.__wallCamera={x:480,y:500};});await shot('service-mobile');
  await page.close();
 }
 if(errors.length)throw Error(errors.join('\n'));
 fs.writeFileSync('output/walls101/'+(process.env.WALL_BACKINGS_ONLY?'backing-evidence.json':'evidence.json'),JSON.stringify({evidence,errors},null,2));
 console.log(JSON.stringify({captures:evidence.length,errors}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
