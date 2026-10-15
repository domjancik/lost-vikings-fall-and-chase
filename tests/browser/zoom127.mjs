import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const live=!!process.env.ZOOM_LIVE,out='assets/zoom127/'+(live?'live':'local');fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[],errors=[];
try{for(const touch of [false,true]){
 const page=await browser.newPage({viewport:touch?{width:844,height:390}:{width:1440,height:900},hasTouch:touch,isMobile:touch});page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>localStorage.setItem('last-call-story-cards','off'));
 await reviewNavigate(page,base+'/?campaign=cycle&release=zoom127');
 const start=async()=>{await page.locator('#start-picker .level-card[data-round="0"] canvas[data-ready="true"]').waitFor({timeout:60000});await page.locator('#start-picker .level-card[data-round="0"]').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');};await start();
 const read=()=>page.locator('#game').evaluate(c=>({camera:JSON.parse(c.dataset.camera),width:c.width,height:c.height,heroes:JSON.parse(c.dataset.heroes)}));
 const check=async z=>{await page.waitForFunction(z=>JSON.parse(document.querySelector('#game').dataset.camera).zoom===z,z);assert.equal(await page.locator('#zoom').textContent(),z+'×');assert.equal(await page.evaluate(()=>localStorage.getItem('last-call-zoom')),String(z));};
 assert.equal((await read()).camera.zoom,2);
 for(const z of [1,1.5,2]){if(touch)await page.locator('#zoom').tap();else await page.locator('#zoom').click();await check(z);}
 for(const z of [1,1.5]){await page.keyboard.press('v');await check(z);}
 // A fractional backing size used to reset the canvas every frame. Observe real native setters.
 await page.evaluate(()=>{window.zoomResizes=0;for(const key of ['width','height']){const d=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,key);Object.defineProperty(document.querySelector('#game'),key,{get(){return d.get.call(this)},set(v){window.zoomResizes++;d.set.call(this,v)}});}});
 await page.waitForTimeout(350);assert.equal(await page.evaluate(()=>window.zoomResizes),0);
 const before=await read();assert.ok(Number.isInteger(before.height));await page.keyboard.down('ArrowRight');await page.waitForTimeout(220);await page.keyboard.up('ArrowRight');assert.ok((await read()).heroes[0].x>before.heroes[0].x+5);
 await page.screenshot({path:out+'/'+(touch?'touch':'desktop')+'-1.5x.png'});
 await page.reload();await start();await check(1.5);results.push({touch,cycle:[2,1,1.5,2],keyboard:true,persisted:1.5,resizes:0,movement:true,camera:(await read()).camera});await page.close();
 }assert.deepEqual(errors,[]);fs.writeFileSync(out+'/evidence.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors}));}
finally{await browser.close();server?.close();}
