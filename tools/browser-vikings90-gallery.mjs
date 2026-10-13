import {createRequire} from 'node:module';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const live=process.argv.includes('--live');
const root=path.resolve('output/release-vikings90/dist'),out=live?'output/viking-gallery90-live':'output/viking-gallery90';
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
 const target=path.resolve(root,'.'+req.url.split('?')[0]);
 if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(target,(error,data)=>{res.writeHead(error?404:200,{'Content-Type':target.endsWith('.html')?'text/html':target.endsWith('.json')?'application/json':'image/png'});res.end(error?'Missing':data);});
}).listen(3060,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.goto(live?'https://united-marsh-6ppd.here.now/viking-gallery90.html?release=90':'http://127.0.0.1:3060/viking-gallery90.html',{waitUntil:'domcontentloaded',timeout:120000});
 await page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('erik'));
 await page.locator('#pause').click();
 for(const hero of process.argv.includes('--all')?['erik','baleog','olaf']:['erik','baleog']){
  await page.locator('#hero').selectOption(hero);
  await page.waitForFunction(hero=>document.querySelector('#status').textContent.startsWith(hero),hero);
  const actions=await page.locator('#action option').evaluateAll(options=>options.map(o=>o.value));
  for(const action of actions){
   await page.locator('#action').selectOption(action);
   await page.locator('#step').click();
   await page.waitForTimeout(20);
   if(!(await page.locator('#status').textContent()).includes(action))throw Error('Incorrect action binding '+action);
  }
  await page.locator('#action').selectOption('walk');await page.waitForTimeout(40);
  await page.screenshot({path:`${out}/${hero}-desktop.png`});
 }
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(80);
 const size=await page.locator('#art').evaluate(c=>({native:c.width,display:c.getBoundingClientRect().width,height:c.height}));
 if(size.native!==340||size.display!==340||size.height!==1080)throw Error('Mobile gallery resized native pixels '+JSON.stringify(size));
 await page.locator('#mirror').check();await page.locator('#step').click();await page.waitForTimeout(40);
 await page.screenshot({path:`${out}/mobile.png`,fullPage:true});
 if(errors.length)throw Error(errors.join(';'));
 fs.writeFileSync(`${out}/evidence.json`,JSON.stringify({errors,mobile:size},null,2));console.log(JSON.stringify({errors,mobile:size}));
}finally{await browser.close();server.close();}
