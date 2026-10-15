import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const live=!!process.env.FOG_LIVE,out='assets/sewer130/'+(live?'live':'views');fs.mkdirSync(out,{recursive:true});const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[],errors=[];
try{for(const touch of [false,true]){
 const page=await browser.newPage({viewport:touch?{width:844,height:390}:{width:1440,height:900},hasTouch:touch,isMobile:touch});page.on('pageerror',e=>errors.push(String(e)));await page.addInitScript(()=>localStorage.setItem('last-call-story-cards','off'));
 await reviewNavigate(page,base+'/?campaign=cycle&release=sewer130');const card=page.locator('#start-picker .level-card[data-round="10"]');await card.locator('canvas[data-ready="true"]').waitFor({timeout:60000});await card.click();await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');
 const read=()=>page.locator('#game').evaluate(c=>({darkness:JSON.parse(c.dataset.sewerDarkness),camera:JSON.parse(c.dataset.camera),heroes:JSON.parse(c.dataset.heroes),time:+c.dataset.simTime}));
 const first=await read();assert.equal(first.darkness.ambient,0);assert.equal(first.darkness.fog.opaque,true);assert.equal(first.darkness.fog.readbacks,0);await page.waitForTimeout(1200);const drifting=await read();assert.notDeepEqual(drifting.darkness.fog.offsets,first.darkness.fog.offsets);
 await page.locator('#pause').click();const paused=await read();await page.waitForTimeout(180);assert.deepEqual((await read()).darkness.fog.offsets,paused.darkness.fog.offsets);
 for(const zoom of [1,1.5,2]){for(let i=0;i<3&&(await read()).camera.zoom!==zoom;i++){await page.locator('#zoom').click();await page.waitForTimeout(60);}await page.waitForTimeout(250);await page.screenshot({path:out+'/'+(touch?'touch':'desktop')+'-'+zoom+'x.png'});}
 await page.locator('#pause').click();const start=(await read()).heroes[0].x;await page.keyboard.down('ArrowRight');await page.waitForTimeout(220);await page.keyboard.up('ArrowRight');assert.ok((await read()).heroes[0].x>start+5);
 results.push({touch,drifts:true,pauses:true,zooms:[1,1.5,2],movement:true,...await read()});await page.close();
 }assert.deepEqual(errors,[]);fs.writeFileSync(out+'/evidence.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify({cases:results.length,zooms:[1,1.5,2],errors}));}
finally{await browser.close();server?.close();}
