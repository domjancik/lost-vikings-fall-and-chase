import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),out='output/pub138/yard';fs.mkdirSync(out,{recursive:true});
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[],errors=[];
try{for(const mobile of [false,true]){
 const page=await browser.newPage({viewport:mobile?{width:430,height:780}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile});page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>localStorage.setItem('last-call-sound','off'));await reviewNavigate(page,'http://127.0.0.1:'+server.address().port+'/?campaign=fall&release=pub138');
 await page.locator('#start-picker .level-card[data-round="11"]').click();await page.waitForFunction(()=>{const d=document.querySelector('#game').dataset;return d.transition==='idle'&&JSON.parse(d.cycleArt||'{}').ready;});
 await page.locator('[data-hero="1"]').click();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.invitations.bow&&JSON.parse(document.querySelector('#game-labels').dataset.labels).some(l=>/arrow/i.test(l.text)));
 await page.waitForTimeout(400);await page.locator('#pause').click();await page.screenshot({path:out+'/'+(mobile?'touch':'desktop')+'-bow-invitation.png'});await page.locator('#pause').click();await page.locator('[data-hero="0"]').click();
 await page.keyboard.down('ArrowLeft');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x<285);await page.keyboard.press('d');
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.bashHit);await page.keyboard.up('ArrowLeft');
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.bashPose>.85);await page.locator('#pause').click();
 const shots=[];for(const [label,width,height,zoom] of [['2x',mobile?430:1440,mobile?780:900,2],['1x',mobile?430:1440,mobile?780:900,1],['landscape',844,390,2]]){
  await page.setViewportSize({width,height});while(await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom)!==zoom)await page.locator('#zoom').click();await page.waitForTimeout(400);
  const state=await page.locator('#game').evaluate(c=>({active:+c.dataset.activeHero,camera:JSON.parse(c.dataset.camera),heroes:JSON.parse(c.dataset.heroes),g:JSON.parse(c.dataset.puzzle).machine}));
  assert.equal(state.active,0);assert.ok(state.g.bashPose>.75);assert.ok(state.camera.x<=120&&state.camera.x+state.camera.width>=245);
  const path=out+'/'+(mobile?'touch':'desktop')+'-'+label+'.png';await page.screenshot({path});shots.push({path,state});
 }results.push({mobile,shots});await page.close();
}assert.deepEqual(errors,[]);console.log(JSON.stringify({contexts:2,captures:6,errors}));}
finally{await browser.close();await new Promise(r=>server.close(r));fs.writeFileSync(out+'/results.json',JSON.stringify({results,errors},null,2));}
