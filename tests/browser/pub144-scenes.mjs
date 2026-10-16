import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),baseline=process.argv.includes('--baseline'),touch=process.argv.includes('--touch'),live=process.argv.includes('--live');
const out=process.env.PUB144_OUT||(baseline?'output/pub144/before':'assets/pub144/'+(touch?'touch':'desktop'));fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:touch?{width:844,height:390}:{width:1440,height:900},hasTouch:touch,isMobile:touch}),errors=[],captures=[];
page.on('pageerror',e=>errors.push(String(e)));
const read=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),camera:JSON.parse(c.dataset.camera),art:JSON.parse(c.dataset.cycleArt),time:+c.dataset.simTime}));
async function move(id,x){await page.locator('.hero-card[data-hero="'+id+'"]').click();const h=(await read()).heroes[id],key=x>h.x?'ArrowRight':'ArrowLeft';await page.keyboard.down(key);await page.waitForFunction(({id,x,right})=>{const h=JSON.parse(document.querySelector('#game').dataset.heroes)[id];return right?h.x>=x:h.x<=x;},{id,x,right:key==='ArrowRight'});await page.keyboard.up(key);await page.waitForTimeout(450);}
async function photo(name){await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.paused==='true');
 for(const z of [1,2]){for(let n=0;n<4;n++){const old=(await read()).camera.zoom;if(old===z)break;await page.locator('#zoom').click();await page.waitForFunction(old=>JSON.parse(document.querySelector('#game').dataset.camera).zoom!==old,old);}await page.waitForTimeout(150);const state=await read();assert.equal(state.camera.zoom,z);const file=out+'/'+name+'-'+z+'x.png';await page.screenshot({path:file});captures.push({file,...state});}
 await page.locator('#pause').click();}
try{
 await reviewNavigate(page,(live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?campaign=fall&release=pub144');
 await page.locator('#start-picker .level-card[data-round="11"] canvas[data-ready="true"]').waitFor();await page.locator('#start-picker .level-card[data-round="11"]').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');
 await page.locator('.hero-card[data-hero="2"]').click();await page.keyboard.down('ArrowLeft');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.cart.parked);await page.keyboard.up('ArrowLeft');await page.keyboard.press('Space');await move(2,1000);await photo('loft-backing');
 await move(1,1260);await photo('first-window');await move(1,1560);await photo('second-window');
 for(const [name,key]of [['look-up','ArrowUp'],['look-down','ArrowDown']]){await page.keyboard.down(key);await page.waitForTimeout(850);await photo(name);await page.keyboard.up(key);await page.waitForTimeout(450);}
 if(touch){await page.setViewportSize({width:430,height:780});await page.waitForTimeout(350);await photo('portrait-window');}
 const state=await read();assert.deepEqual(state.heroes.map(h=>h.hp),[3,3,3]);assert.deepEqual(errors,[]);if(!baseline)assert.equal(state.art.loftWall.collision,false);
 fs.writeFileSync(out+'/evidence.json',JSON.stringify({baseline,touch,coarse:await page.evaluate(()=>matchMedia('(pointer:coarse)').matches),captures,errors},null,2)+'\n');console.log(JSON.stringify({baseline,touch,captures:captures.length,errors}));
}finally{await browser.close();server?.close();}
