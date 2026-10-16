import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),live=process.argv.includes('--live'),out=process.env.PUB148_OUT||'assets/pub148/room';
fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900},hasTouch:true,isMobile:true}),errors=[],captures=[];
page.on('pageerror',e=>errors.push(String(e)));
const read=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,camera:JSON.parse(c.dataset.camera),art:JSON.parse(c.dataset.cycleArt)}));
try{
 await reviewNavigate(page,(live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?campaign=fall&release=pub148');
 await page.locator('#start-picker .level-card[data-round="11"] canvas[data-ready="true"]').waitFor();await page.locator('#start-picker .level-card[data-round="11"]').tap();
 await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');
 await page.locator('.hero-card[data-hero="0"]').tap();await page.keyboard.down('ArrowRight');
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x>1670);
 await page.keyboard.up('ArrowRight');await page.waitForTimeout(400);
 for(const [label,width,height]of [['desktop',1440,900],['landscape',844,390],['portrait',430,780]]){
  await page.setViewportSize({width,height});
  for(const zoom of [1,2]){
   for(let n=0;n<3&&(await read()).camera.zoom!==zoom;n++){const old=(await read()).camera.zoom;await page.locator('#zoom').tap();await page.waitForFunction(old=>JSON.parse(document.querySelector('#game').dataset.camera).zoom!==old,old);}
   assert.equal((await read()).camera.zoom,zoom);await page.waitForTimeout(350);
   const file=out+'/'+label+'-'+zoom+'x.png';await page.screenshot({path:file});captures.push({file,...await read()});
  }
 }
 assert.deepEqual(errors,[]);assert.ok(captures.every(s=>s.art.partition.header.y+s.art.partition.header.h===646));
 fs.writeFileSync(out+'/evidence.json',JSON.stringify({captures,errors,ordinaryInput:true},null,2));console.log(JSON.stringify({captures:captures.length,errors}));
}finally{await browser.close();server?.close();}
