import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';

const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const built=process.argv.includes('--built');
const server=await createDevServer({built});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const failures=new Map(),errors=[];
const paths=['warden102/parts-native.png','warden89/scene-native.png','warden105/cart-native.png','gate61/gate.png','clockwork71/tower.png','terrain48/terrain.png','depth94/a-native.png','vikings90/erik-native.png'];
try{
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/assets/**',async route=>{
  const resource=new URL(route.request().url()).pathname;
  if(paths.some(path=>resource.endsWith('/'+path))){
   const count=(failures.get(resource)||0)+1;failures.set(resource,count);
   if(count===1){await route.fulfill({status:503,body:'Temporary asset failure'});return;}
   await new Promise(resolve=>setTimeout(resolve,150));
  }
  await route.continue();
 });
 await page.addInitScript(()=>{localStorage.setItem('last-call-story-cards','off');localStorage.setItem('last-call-sound','off');});
 await page.goto(`http://127.0.0.1:${server.address().port}/?campaign=fall&skin=imagegen90`);
 await page.locator('#start-picker .level-card[data-round="5"]').click();
 await page.waitForFunction(()=>{
  const canvas=document.querySelector('#game');
  return JSON.parse(canvas.dataset.cycleArt||'{}').ready&&JSON.parse(canvas.dataset.heroArt||'{}').ready;
 },null,{timeout:10000});
 for(const path of paths){const count=[...failures].find(([url])=>url.endsWith('/'+path))?.[1]||0;assert.ok(count>=2,`${path} must recover after its first failed request`);}
 assert.deepEqual(errors,[]);
 await fs.mkdir('output/loading-review',{recursive:true});
 await page.screenshot({path:`output/loading-review/${built?'built':'source'}-recovered.png`});
 console.log(JSON.stringify({built,recovered:Object.fromEntries(failures),errors}));
}catch(error){
 console.error(JSON.stringify({failures:Object.fromEntries(failures),errors,state:await page.locator('#game').evaluate(c=>({art:c.dataset.cycleArt,hero:c.dataset.heroArt,round:c.dataset.round}))}));
 throw error;
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
