import {reviewNavigate} from './review-skin.mjs';
import {createRequire} from 'node:module';import fs from 'node:fs';import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();await reviewNavigate(page,'http://127.0.0.1:'+server.address().port+'/?campaign=cycle');
 const result=await page.evaluate(async()=>{
  const {updateHeroResource}=await import('/hero-resources.js?v=warden104'),card=document.querySelector('.hero-card[data-hero="2"]').cloneNode(true),host=document.createElement('div');host.append(card);
  const s={level:{mechanic:'warden'},machine:{braced:true,braceAge:0,fatigue:0},heroes:[{},{},{id:2}]},results=[];
  for(const kind of ['strength','recover','air'])for(const remaining of [1.01,.99]){
   s.level.mechanic=kind==='air'?'water':'warden';s.machine.braced=kind==='strength';s.machine.fatigue=kind==='recover'?remaining:0;s.machine.braceAge=14-remaining;s.heroes[2].air=remaining;
   updateHeroResource(s,2,card);const text=card.querySelector('.resource-seconds').textContent;if(text!==Math.ceil(remaining)+'s')throw Error('Stale timer '+kind+':'+text);results.push({kind,remaining,text});
  }
  return results;
 });fs.writeFileSync('output/warden104/timer-boundary.json',JSON.stringify({results:result,passed:true},null,2));console.log(JSON.stringify({results:result,passed:true}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
