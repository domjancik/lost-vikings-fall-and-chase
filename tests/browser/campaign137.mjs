import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),live=process.argv.includes('--live');
const out='output/campaign137/'+(live?'live':'built');fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],results=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});
const order=[11,10,4,2,3,7,5,8,9,0];
const cards=()=>page.locator('#start-picker .level-card');
const waitRound=round=>page.waitForFunction(round=>{const c=document.querySelector('#game');return +c.dataset.round===round&&c.dataset.campaign==='fall'&&JSON.parse(c.dataset.cycleArt||'{}').ready;},round);
try{
 await page.addInitScript(()=>{localStorage.setItem('last-call-cycle52-round','8');localStorage.setItem('last-call-sound','off');});
 await reviewNavigate(page,base+'/?release=campaign137');
 await waitRound(8);assert.deepEqual(await cards().evaluateAll(cs=>cs.map(c=>+c.dataset.round)),order);
 await page.waitForFunction(()=>[...document.querySelectorAll('#start-picker canvas')].every(c=>c.dataset.ready==='true'));
 await page.screenshot({path:out+'/fall-menu.png'});
 await page.locator('#start-picker [data-campaign-option="cycle"]').click();assert.deepEqual(await cards().evaluateAll(cs=>cs.map(c=>+c.dataset.round)),[1,6]);
 await page.locator('#start-picker [data-campaign-option="fall"]').click();await page.locator('#start-picker .level-card[data-round="11"]').click();
 for(const [i,round] of order.entries()){
  await waitRound(round);assert.match(await page.locator('#rounds').innerText(),new RegExp('^'+(i+1)+'/10'));
  await page.locator('#debug').click();
  assert.deepEqual(await page.locator('#debug-level option').evaluateAll(cs=>cs.map(c=>+c.value)),order);
  assert.equal(await page.locator('#debug-prev').isDisabled(),i===0);assert.equal(await page.locator('#debug-next').isDisabled(),i===9);
  results.push({chapter:i+1,round});
  if(i<9)await page.locator('#debug-next').click();else await page.locator('#close-debug').click();
 }
 await reviewNavigate(page,base+'/?campaign=fall&release=campaign137');await waitRound(0);assert.match(await page.locator('#rounds').innerText(),/^10\/10/);
 await page.setViewportSize({width:430,height:780});await page.waitForTimeout(300);await page.screenshot({path:out+'/fall-menu-mobile.png'});
 await page.locator('#start-picker [data-campaign-option="cycle"]').click();await page.locator('#start-picker .level-card[data-round="6"]').click();
 await page.waitForFunction(()=>document.querySelector('#game').dataset.campaign==='cycle');assert.match(await page.locator('#rounds').innerText(),/^2\/2/);
 await page.locator('#debug').click();assert.deepEqual(await page.locator('#debug-level option').evaluateAll(cs=>cs.map(c=>+c.value)),[1,6]);assert.ok(await page.locator('#debug-next').isDisabled());
 await page.locator('#debug-prev').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.round==='1');assert.match(await page.locator('#rounds').innerText(),/^1\/2/);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({live,results,migration:true,resume:true,mobile:true,machineRooms:[1,6],errors}));
}finally{fs.writeFileSync(out+'/results.json',JSON.stringify({live,results,errors},null,2));await browser.close();if(server)await new Promise(r=>server.close(r));}
