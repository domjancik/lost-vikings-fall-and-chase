import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const live=process.argv.includes('--live'),built=!process.argv.includes('--source'),mode=live?'live':built?'built':'source',out='output/hero140/'+mode;fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1100,height:760}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(String(e)));const state=()=>page.locator('#game').evaluate(c=>({active:+c.dataset.activeHero,slots:JSON.parse(c.dataset.heroes).map(h=>h.itemSlot)}));
async function check(key,active,slots){await page.keyboard.press(key);await page.waitForTimeout(60);assert.deepEqual(await state(),{active,slots});checks.push({key,active,slots});}
try{
 await page.addInitScript(()=>{localStorage.setItem('last-call-sound','off');});await reviewNavigate(page,(live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?campaign=fall&release=hero140');
 await page.locator('#start-picker .level-card[data-round="11"]').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');
 await check('1',0,[1,0,0]);await check('1',0,[2,0,0]);await check('1',0,[3,0,0]);await check('1',0,[0,0,0]);
 await check('2',1,[0,0,0]);await check('2',1,[0,1,0]);await check('3',2,[0,1,0]);await check('3',2,[0,1,1]);
 await check('2',1,[0,1,1]);await check('2',1,[0,2,1]);
 await page.keyboard.down('2');await page.waitForTimeout(60);const before=await state();assert.equal(before.slots[1],3);
 await page.keyboard.down('2');await page.waitForTimeout(60);assert.deepEqual(await state(),before);await page.keyboard.up('2');
 await page.locator('[data-hero="1"]').click();await page.waitForTimeout(60);assert.equal((await state()).slots[1],0);
 await check('Tab',2,[0,0,1]);await check('1',0,[0,0,1]);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({mode,checks:checks.length,heldRepeatIgnored:true,hudMatches:true,errors}));
}finally{fs.writeFileSync(out+'/results.json',JSON.stringify({mode,checks,errors},null,2));await browser.close();if(server)await new Promise(r=>server.close(r));}
