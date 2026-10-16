import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const out='output/pub139/hearth';fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[],errors=[];
try{for(const mobile of [false,true]){
 const page=await browser.newPage({viewport:mobile?{width:430,height:780}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile});page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{localStorage.setItem('last-call-sound','off');localStorage.setItem('last-call-zoom','2');});
 await reviewNavigate(page,'http://127.0.0.1:'+server.address().port+'/?campaign=fall&release=pub139');await page.locator('#start-picker .level-card[data-round="11"]').click();
 await page.waitForFunction(()=>{const d=document.querySelector('#game').dataset;return d.transition==='idle'&&JSON.parse(d.cycleArt||'{}').ready;});await page.locator('[data-hero="2"]').click();await page.waitForTimeout(400);
 const layers=await page.evaluate(()=>({text:+getComputedStyle(document.querySelector('#game-labels')).zIndex,crew:+getComputedStyle(document.querySelector('.below')).zIndex,labels:JSON.parse(document.querySelector('#game-labels').dataset.labels)}));
 assert.ok(layers.text>layers.crew);assert.ok(layers.labels.some(l=>l.priority===100));assert.equal(layers.labels.at(-1).priority,100);
 await page.locator('#pause').click();await page.screenshot({path:out+'/'+(mobile?'touch':'desktop')+'-dialogue.png'});await page.locator('#pause').click();
 await page.keyboard.down('ArrowRight');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[2].x>1245);await page.keyboard.up('ArrowRight');await page.waitForTimeout(200);
 const trace=[];for(let i=0;i<24;i++){trace.push(await page.locator('#game').evaluate(c=>({time:+c.dataset.simTime,hearth:JSON.parse(c.dataset.cycleArt).hearth})));await page.waitForTimeout(50);}
 assert.ok(new Set(trace.map(t=>JSON.stringify(t.hearth.heat.strips))).size>3);assert.ok(trace.every(t=>t.hearth.readbacks===0&&t.hearth.heat.copiedPixels<=1189));
 await page.locator('#pause').click();const frozen=await page.locator('#game').evaluate(c=>JSON.stringify(JSON.parse(c.dataset.cycleArt).hearth));await page.waitForTimeout(300);assert.equal(await page.locator('#game').evaluate(c=>JSON.stringify(JSON.parse(c.dataset.cycleArt).hearth)),frozen);
 const captures=[];for(const [label,width,height,zoom] of [['2x',mobile?430:1440,mobile?780:900,2],['1x',mobile?430:1440,mobile?780:900,1],['landscape',844,390,2]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(100);
  for(let attempt=0;attempt<4;attempt++){const before=await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom);if(before===zoom)break;await page.locator('#zoom').click();await page.waitForFunction(z=>JSON.parse(document.querySelector('#game').dataset.camera).zoom!==z,before);}
  await page.waitForFunction(z=>JSON.parse(document.querySelector('#game').dataset.camera).zoom===z,zoom);await page.waitForTimeout(350);
  const state=await page.locator('#game').evaluate(c=>({camera:JSON.parse(c.dataset.camera),hearth:JSON.parse(c.dataset.cycleArt).hearth}));assert.ok(state.hearth.heat);const file=out+'/'+(mobile?'touch':'desktop')+'-'+label+'.png';await page.screenshot({path:file});captures.push({file,state});
 }results.push({mobile,layers,trace,frozen:true,captures});await page.close();
}assert.deepEqual(errors,[]);console.log(JSON.stringify({contexts:2,captures:8,heatMoves:true,pausedStable:true,textAboveHealth:true,errors}));}
finally{await browser.close();await new Promise(r=>server.close(r));fs.writeFileSync(out+'/results.json',JSON.stringify({results,errors},null,2));}
