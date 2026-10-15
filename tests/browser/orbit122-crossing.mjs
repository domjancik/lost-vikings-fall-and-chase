import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),live=!!process.env.ORBIT_LIVE,out='assets/orbit122/'+(live?'live-crossing':'crossing');
fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});
if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true}),errors=[],records={};
page.on('pageerror',e=>errors.push(String(e)));
const hero=()=>page.locator('#game').evaluate(c=>JSON.parse(c.dataset.heroes)[1]);
async function hold(key,predicate){await page.keyboard.down(key);await page.waitForFunction(predicate,null,{timeout:20000});await page.keyboard.up(key);await page.waitForTimeout(180);}
async function photo(name){await page.keyboard.press('Escape');records[name]=await hero();await page.screenshot({path:out+'/'+name+'.png'});await page.keyboard.press('Escape');}
try{
 await reviewNavigate(page,(live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?campaign=cycle&release=orbit122');
 await page.locator('#start-picker .level-card[data-round="8"]').click();
 await page.locator('.hero-card[data-hero="1"]').click();await page.keyboard.press('e');
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[1].inventory.includes('magneticShoes'));
 await hold('ArrowRight',()=>JSON.parse(document.querySelector('#game').dataset.heroes)[1].x>1770);
 await hold('ArrowUp',()=>JSON.parse(document.querySelector('#game').dataset.heroes)[1].y+44<=650);
 await hold('ArrowRight',()=>JSON.parse(document.querySelector('#game').dataset.heroes)[1].x>1855);
 await page.keyboard.press('q');
 await page.waitForFunction(()=>{const h=JSON.parse(document.querySelector('#game').dataset.heroes)[1];return h.magnet?.plateId===2&&h.magnet.pull===1;});
 await photo('attached-over-gap');
 await hold('ArrowLeft',()=>JSON.parse(document.querySelector('#game').dataset.heroes)[1].x>2075);
 await photo('rounded-far-end');await page.keyboard.press('q');
 await page.waitForFunction(()=>{const h=JSON.parse(document.querySelector('#game').dataset.heroes)[1];return !h.magnet&&h.ground&&Math.abs(h.rotation)<.01;});
 const end=await hero();assert.ok(end.x>=2060);assert.equal(end.y+44,650);assert.equal(end.hp,3);assert.deepEqual(errors,[]);
 await photo('right-landing');fs.writeFileSync(out+'/evidence.json',JSON.stringify({records,end,errors},null,2));
 console.log(JSON.stringify({crossed:true,x:end.x,feet:end.y+44,hp:end.hp,errors}));
}catch(e){await page.screenshot({path:out+'/failure.png'});throw e;}
finally{await browser.close();server?.close();}
