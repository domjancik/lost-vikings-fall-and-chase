import {reviewNavigate} from './review-skin.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {createDevServer} from '../../tools/dev/server.mjs';
import {campaignChoices} from '../../src/app/campaign-picker.js';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),results=[],errors=[];
fs.mkdirSync('output/reorg99/browser',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 for(const built of [false,true]){
  const server=await createDevServer({built});await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base='http://127.0.0.1:'+server.address().port;
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('response',r=>{if(r.status()>=400&& !r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url());});
  try{
   await reviewNavigate(page,base+'/');await page.evaluate(()=>localStorage.setItem('last-call-story-cards','off'));
   const campaignCounts=new Map(campaignChoices.map(c=>[c.id,c.levels.length]));
   for(const campaign of ['arcade','story','cycle']){const count=campaignCounts.get(campaign);
    await page.locator('#start-picker [data-campaign-option="'+campaign+'"]').click();
    await page.waitForFunction(count=>{const cs=[...document.querySelectorAll('#start-picker canvas')];return cs.length===count&&cs.every(c=>c.dataset.ready==='true');},count);
    assert.equal(await page.locator('#start-picker .level-card').count(),count);
   }
   await page.locator('#start-picker .level-card[data-round="6"]').click();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
   const state=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),camera:JSON.parse(c.dataset.camera),campaign:c.dataset.campaign,round:c.dataset.round,active:c.dataset.activeHero,paused:c.dataset.paused}));
   await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');const before=await state();await page.keyboard.down('ArrowRight');await page.waitForTimeout(300);await page.keyboard.up('ArrowRight');assert.ok((await state()).heroes[0].x>before.heroes[0].x+20);
   await page.locator('[data-hero="2"]').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.activeHero==='2');
   await page.locator('#bag').click();assert.ok(await page.locator('#inventory-dialog').isVisible());await page.locator('#close-inventory').click();
   const zoom=(await state()).camera.zoom;await page.locator('#zoom').click();await page.waitForFunction(z=>JSON.parse(document.querySelector('#game').dataset.camera).zoom!==z,zoom);
   await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.paused==='true');await page.locator('#pause').click();
   await page.locator('#restart').click();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes).every(h=>h.hp===3));
   for(const [campaign,round]of [['story',0],['arcade',0],['cycle',5]]){
    await page.locator('#rounds').click();await page.locator('#round-picker [data-campaign-option="'+campaign+'"]').click();await page.locator('#round-picker .level-card[data-round="'+round+'"]').click();
    await page.waitForFunction(c=>document.querySelector('#game').dataset.campaign===c,campaign);await page.waitForTimeout(500);
   }
   await page.setViewportSize({width:430,height:780});await page.screenshot({path:`output/reorg99/browser/${built?'build':'source'}-mobile.png`});
   results.push({mode:built?'build':'source',campaigns:3,previews:campaignChoices.reduce((n,c)=>n+c.levels.length,0),movement:true,switch:true,inventory:true,zoom:true,pause:true,restart:true,mobile:true});
   for(const html of ['hero-art-preview.html','connection-kit-preview.html','viking-gallery88.html','viking-gallery90.html']){await reviewNavigate(page,base+'/'+html);await page.waitForTimeout(700);}
  }finally{await page.close();await new Promise(r=>server.close(r));}
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({results,errors}));
}finally{await browser.close();fs.writeFileSync('output/reorg99/browser/results.json',JSON.stringify({results,errors},null,2));}
