import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {playWaterControls} from '../routes/water-browser-controls.js';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const out='output/water108';fs.mkdirSync(out,{recursive:true});
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage();
try{
 await page.addInitScript(()=>localStorage.setItem('last-call-story-cards','off'));
 await page.goto('http://127.0.0.1:'+server.address().port+'/?campaign=cycle&skin=current');
 const result=await playWaterControls(page,{out,probeFront:true});
 if(!result.won||result.hp.some(h=>h!==3)||result.errors.length)throw Error('Unhealthy water route '+JSON.stringify(result));
 fs.writeFileSync(out+'/route.json',JSON.stringify(result,null,2));console.log(JSON.stringify({won:result.won,hp:result.hp,time:result.time,errors:result.errors}));
}catch(error){await page.screenshot({path:out+'/failure.png'});fs.writeFileSync(out+'/failure.json',JSON.stringify({error:String(error),state:await page.locator('#game').evaluate(c=>({...c.dataset}))},null,2));throw error;}
finally{await browser.close();await new Promise(r=>server.close(r));}
