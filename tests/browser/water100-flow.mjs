import {reviewNavigate} from './review-skin.mjs';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{localStorage.setItem('last-call-story-cards','off');localStorage.setItem('last-call-zoom','1');});
 await reviewNavigate(page,'http://127.0.0.1:'+server.address().port+'/?campaign=cycle');
 await page.locator('#start-picker .level-card[data-round="4"]').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 await page.waitForTimeout(600);
 for(const frame of [0,1,2]){await page.screenshot({path:`output/water100/unshielded-flow-${frame}.png`});await page.waitForTimeout(84);}
 const perf=await page.evaluate(async()=>{
   const values=[];let previous=performance.now();
   for(let i=0;i<90;i++){await new Promise(requestAnimationFrame);const now=performance.now();values.push(now-previous);previous=now;}
   values.sort((a,b)=>a-b);return {medianFrameMs:values[45],p95FrameMs:values[85],samples:values.length};
 });
 const state=await page.locator('#game').evaluate(c=>({machine:JSON.parse(c.dataset.puzzle).machine,camera:JSON.parse(c.dataset.camera)}));
 if(state.machine.shelter!==0||errors.length)throw Error('Stream probe failed');
 fs.writeFileSync('output/water100/flow.json',JSON.stringify({state,perf,errors},null,2));
 console.log(JSON.stringify({perf,errors}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
