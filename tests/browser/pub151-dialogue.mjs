import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),live=process.argv.includes('--live'),out=process.env.PUB151_OUT||'assets/pub151/dialogue';
fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900},hasTouch:true,isMobile:true}),errors=[],captures=[];
page.on('pageerror',e=>errors.push(String(e)));
const read=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,camera:JSON.parse(c.dataset.camera),art:JSON.parse(c.dataset.cycleArt)}));
async function move(id,x){await page.locator('.hero-card[data-hero="'+id+'"]').tap();const right=x>(await read()).heroes[id].x,key=right?'ArrowRight':'ArrowLeft';await page.keyboard.down(key);await page.waitForFunction(({id,x,right})=>{const h=JSON.parse(document.querySelector('#game').dataset.heroes)[id];return right?h.x>=x:h.x<=x;},{id,x,right});await page.keyboard.up(key);await page.waitForTimeout(200);}
async function captureSet(name,refresh){
 for(const [size,width,height]of [['desktop',1440,900],['landscape',844,390],['portrait',430,780]]){
  await page.setViewportSize({width,height});
  for(const zoom of [1,1.5,2]){
   for(let n=0;n<3&&(await read()).camera.zoom!==zoom;n++){const old=(await read()).camera.zoom;await page.locator('#zoom').tap();await page.waitForFunction(old=>JSON.parse(document.querySelector('#game').dataset.camera).zoom!==old,old);}
   assert.equal((await read()).camera.zoom,zoom);await refresh();await page.waitForTimeout(100);
   const panels=await page.locator('#game-labels').evaluate(c=>JSON.parse(c.dataset.labels).filter(l=>l.kind==='speech'));
   assert.equal(panels.length,1,name+' '+size+' '+zoom);
   for(const p of panels){assert.ok(p.x>=0&&p.x+p.w<=width&&p.y>=0&&p.y+p.h<=height);for(const l of p.lines){assert.ok(l.x>=p.x+p.padding&&l.x+l.width<=p.x+p.w-p.padding+1);assert.ok(l.y<=p.y+p.h-p.padding);}}
   const file=out+'/'+name+'-'+size+'-'+zoom+'x.png';await page.screenshot({path:file});captures.push({file,panels,...await read()});
  }
 }
}
try{
 await reviewNavigate(page,(live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?campaign=fall&release=pub151');
 await page.locator('#start-picker .level-card[data-round="11"] canvas[data-ready="true"]').waitFor();await page.locator('#start-picker .level-card[data-round="11"]').tap();await page.waitForFunction(()=>document.querySelector('#game').dataset.transition==='idle');
 await move(1,365);
 await captureSet('yard',async()=>{await page.waitForFunction(()=>{const c=document.querySelector('#game'),m=JSON.parse(c.dataset.puzzle).machine;return m.dialogue?.speaker==='TORSTEN'&&m.dialogue.until-Number(c.dataset.simTime)>1;},null,{timeout:20000});});
 await move(0,1580);
 await captureSet('fisher',async()=>{await page.keyboard.press('e');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.dialogue?.speaker==='RUNA');});
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/evidence.json',JSON.stringify({captures,errors,ordinaryInput:true},null,2));console.log(JSON.stringify({captures:captures.length,errors}));
}finally{await browser.close();server?.close();}
