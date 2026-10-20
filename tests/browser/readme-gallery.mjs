import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const out='docs/screenshots';fs.mkdirSync(out,{recursive:true});const server=await createDevServer({built:true});await new Promise(r=>server.listen(15557,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:810}}),errors=[],captures=[];page.on('pageerror',e=>errors.push(String(e)));
await page.addInitScript(()=>{localStorage.setItem('last-call-zoom','1');localStorage.setItem('last-call-sound','off');localStorage.setItem('last-call-story-cards','off');});
// Review camera changes framing only: no hero positions, puzzle flags or art changes.
await page.route('**/game.js?*',async route=>{const r=await route.fetch(),source=await r.text();assert.ok(source.includes('const target=cameraTarget('));await route.fulfill({response:r,body:source.replace('const target=cameraTarget(','const target=globalThis.__galleryCamera??cameraTarget(')});});
try{for(const shot of [
 {name:'the-familiar-hearth',round:11,camera:{x:550,y:100}},
 {name:'inside-the-clockwork',round:3,camera:{x:0,y:100}},
 {name:'ember-freight',round:7,camera:{x:1050,y:80}},
 {name:'the-fourfold-warden',round:5,camera:{x:800,y:170}},
 {name:'scrap-orbit',round:8,camera:{x:700,y:150}}
]){
 await reviewNavigate(page,'http://127.0.0.1:'+server.address().port+'/?campaign=fall&release=readme-gallery');
 await page.locator('#start-picker .level-card[data-round="'+shot.round+'"] canvas[data-ready=true]').waitFor();await page.locator('#start-picker .level-card[data-round="'+shot.round+'"]').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle'&&JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}').ready);
 await page.evaluate(camera=>{globalThis.__galleryCamera=camera;},shot.camera);await page.waitForTimeout(900);
 const state=await page.locator('#game').evaluate(c=>({round:+c.dataset.round,camera:JSON.parse(c.dataset.camera),time:+c.dataset.simTime,heroes:JSON.parse(c.dataset.heroes)}));assert.equal(state.camera.zoom,1);
 const file=out+'/'+shot.name+'.png';await page.screenshot({path:file});captures.push({...shot,file,state,reviewCamera:true});
}assert.deepEqual(errors,[]);fs.writeFileSync(out+'/captures.json',JSON.stringify({kind:'Actual current-engine scene captures with review-camera framing; unchanged simulation and art',captures,errors},null,2));console.log(JSON.stringify({captures:captures.length,errors}));}finally{await browser.close();server.close();}
