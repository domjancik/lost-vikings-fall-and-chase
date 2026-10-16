import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {reviewNavigate} from './review-skin.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),mobile=process.argv.includes('--mobile'),live=process.argv.includes('--live'),out=process.env.SEWER_ENTRY_OUT||'output/sewer136/entry-'+(mobile?'mobile':'desktop');
fs.mkdirSync(out,{recursive:true});const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:mobile?{width:430,height:780}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile}),errors=[],captures=[];
page.on('pageerror',e=>errors.push(String(e)));
const state=()=>page.locator('#game').evaluate(c=>({time:+c.dataset.simTime,heroes:JSON.parse(c.dataset.heroes),g:JSON.parse(c.dataset.puzzle).machine,camera:JSON.parse(c.dataset.camera),art:JSON.parse(c.dataset.cycleArt||'{}'),darkness:JSON.parse(c.dataset.sewerDarkness||'{}')}));
await page.addInitScript(()=>{localStorage.setItem('last-call-zoom','2');localStorage.setItem('last-call-sound','off');});
try{
 await reviewNavigate(page,(live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?campaign=fall&release=sewer136');
 await page.locator('#start-picker .level-card[data-round="10"] canvas[data-ready="true"]').waitFor();
 await page.locator('#start-picker .level-card[data-round="10"]').click();
 const targets=[['fall',g=>g.phase==='fall'],['bounce',g=>g.phase==='bounce'],['settle',g=>g.phase==='settle'],['unfold',g=>g.phase==='hop'&&g.legs>.6],['six-feet',g=>g.phase==='run'],['darkness',g=>g.phase==='gone']];
 for(const [name,predicate]of targets){
  await page.waitForFunction(code=>{const g=JSON.parse(document.querySelector('#game').dataset.puzzle).machine.globe;return g&&Function('g','return ('+code+')(g)')(g);},predicate.toString(),{timeout:10000});
  await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.paused==='true');
  for(const [label,size,zoom]of [['2x',{width:1440,height:900},2],['1x',{width:1440,height:900},1],['portrait',{width:430,height:780},2],['landscape',{width:844,height:390},2]]){
   await page.setViewportSize(size);while(await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom)!==zoom)await page.locator('#zoom').click();await page.waitForTimeout(250);
   const file=out+'/'+name+'-'+label+'.png';await page.screenshot({path:file});captures.push({name,label,file,...await state()});
  }
  await page.setViewportSize(mobile?{width:430,height:780}:{width:1440,height:900});await page.locator('#pause').click();console.log('ENTRY '+name);
 }
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.globe.phase==='gone');
 const before=await state();await page.keyboard.down('ArrowRight');await page.waitForTimeout(250);await page.keyboard.up('ArrowRight');assert.ok((await state()).heroes[0].x>before.heroes[0].x+15);
 assert.deepEqual(errors,[]);assert.deepEqual((await state()).heroes.map(h=>h.hp),[3,3,3]);fs.writeFileSync(out+'/entry.json',JSON.stringify({captures,errors,controlsResumed:true},null,2));console.log(JSON.stringify({captures:captures.length,errors,controlsResumed:true}));
}catch(e){await page.screenshot({path:out+'/failure.png'});fs.writeFileSync(out+'/failure.json',JSON.stringify({error:String(e),state:await state(),errors},null,2));throw e;}
finally{await browser.close();if(server)await new Promise(r=>server.close(r));}
