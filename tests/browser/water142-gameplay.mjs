import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),mobile=process.argv.includes('--touch');
const out='assets/water142/'+(mobile?'touch':'desktop');fs.mkdirSync(out,{recursive:true});
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile}),errors=[],captures=[];
page.on('pageerror',e=>errors.push(String(e)));
const read=()=>page.locator('#game').evaluate(c=>({time:+c.dataset.simTime,camera:JSON.parse(c.dataset.camera),heroes:JSON.parse(c.dataset.heroes),paused:c.dataset.paused==='true'}));
async function photo(name){const file=out+'/'+name+'.png';await page.screenshot({path:file});captures.push({file,...await read()});}
async function zoom(z){for(let n=0;n<4;n++){const old=(await read()).camera.zoom;if(old===z)return;await page.locator('#zoom').click();await page.waitForFunction(old=>JSON.parse(document.querySelector('#game').dataset.camera).zoom!==old,old);}assert.equal((await read()).camera.zoom,z);}
try{
 await page.addInitScript(()=>localStorage.setItem('last-call-story-cards','off'));
 await reviewNavigate(page,'http://127.0.0.1:'+server.address().port+'/?campaign=fall&release=water142');
 await page.locator('#start-picker .level-card[data-round="4"] canvas[data-ready="true"]').waitFor();await page.locator('#start-picker .level-card[data-round="4"]').click();
 await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');
 await page.keyboard.down('ArrowRight');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x>460);await page.keyboard.up('ArrowRight');
 await page.keyboard.down('ArrowDown');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].y>930);await page.keyboard.up('ArrowDown');
 // Capture both historical source-swap boundaries while the real game runs.
 for(const phase of [5,6,11,0]){
  await page.waitForFunction(phase=>Math.floor(+document.querySelector('#game').dataset.simTime*3+376*.015)%12===phase,phase);
  await page.locator('#pause').click();assert.ok((await read()).paused);
  for(const z of [1,2]){await zoom(z);await photo('phase-'+phase+'-'+z+'x');}
  const t=(await read()).time;await page.waitForTimeout(120);assert.equal((await read()).time,t);await page.locator('#pause').click();
 }
 assert.deepEqual((await read()).heroes.map(h=>h.hp),[3,3,3]);assert.deepEqual(errors,[]);
 fs.writeFileSync(out+'/evidence.json',JSON.stringify({mobile,coarse:await page.evaluate(()=>matchMedia('(pointer:coarse)').matches),captures,errors},null,2)+'\n');
 console.log(JSON.stringify({mobile,captures:captures.length,hp:(await read()).heroes.map(h=>h.hp),errors}));
}catch(e){await page.screenshot({path:out+'/failure.png'});throw e;}
finally{await browser.close();server.close();}
