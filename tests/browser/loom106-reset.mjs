import {reviewNavigate} from './review-skin.mjs';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),out='assets/loom106/evidence';
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const errors=[],shots=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('pageerror',e=>errors.push(String(e)));
 await page.route('**/game.js*',route=>route.fulfill({contentType:'text/javascript',body:fs.readFileSync('dist/game.js','utf8').replace('const target=cameraTarget(','const target=globalThis.__reviewCamera??cameraTarget(')}));
 await page.addInitScript(()=>localStorage.setItem('last-call-story-cards','off'));
 await reviewNavigate(page,'http://127.0.0.1:'+server.address().port+'/?campaign=cycle');
 await page.locator('#start-picker .level-card[data-round="6"]').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 await page.locator('#restart').click();await page.locator('#pause').click();
 for(const [name,size,zoom,camera]of [
  ['reset-textile-1x',{width:1440,height:900},1,{x:1760,y:400}],
  ['reset-textile-2x',{width:1440,height:900},2,{x:2090,y:500}],
  ['reset-textile-landscape',{width:844,height:390},2,{x:2240,y:600}]]){
  await page.setViewportSize(size);if(await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom)!==zoom)await page.locator('#zoom').click();
  await page.evaluate(camera=>globalThis.__reviewCamera=camera,camera);await page.waitForTimeout(800);
  const state=await page.locator('#game').evaluate(c=>({paused:c.dataset.paused,camera:JSON.parse(c.dataset.camera),machine:JSON.parse(c.dataset.puzzle).machine,cloth:JSON.parse(c.dataset.cycleArt).contacts.find(p=>p.kind==='cloth')}));
  if(state.machine.weave!==0||state.machine.docked||state.cloth.weave.completeRows!==0||state.paused!=='true')throw Error('Reset did not clear textile');
  const file=out+'/'+name+'.png';await page.screenshot({path:file});shots.push({file,...state});
 }
 const result={method:'Real restart control; diagnostic changes only camera target to inspect reset textile, no simulation/progression overrides',shots,errors};
 fs.writeFileSync(out+'/reset-textile.json',JSON.stringify(result,null,2));if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify({captures:shots.length,errors}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
