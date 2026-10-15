import {reviewNavigate} from '../review-skin.mjs';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const root=path.resolve('output/release-water92/dist');
const mime={'.html':'text/html','.js':'text/javascript','.png':'image/png','.css':'text/css','.json':'application/json'};
const server=process.env.WATER92_LIVE?null:http.createServer((req,res)=>{
 const urlPath=req.url.split('?')[0];
 const file=path.resolve(root,'.'+(urlPath==='/'?'/index.html':urlPath));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(file,(err,bytes)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(err?'Missing':bytes);});
}).listen(3047,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage();
try{
 await reviewNavigate(page,(process.env.WATER92_LIVE?'https://united-marsh-6ppd.here.now/':'http://127.0.0.1:3047/')+'?skin=imagegen90&release=92');
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes||'[]').length===3);
 const active=await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.heroes));
 if(active.some(h=>h.skin!=='imagegen90')||!active[2].shieldArtPose)throw Error('Imagegen90 physical binding absent');
 let routeSource=fs.readFileSync('archive/browser/browser-water87.js','utf8').replaceAll('water87-','water92-');
 routeSource=routeSource.replace("await tap('3');await tap('Space');await move(2,710);await shot('shield-intake');","await tap('3');await tap('Space');await move(2,650);await shot('stream-outside');await move(2,680);await wait(400);await shot('stream-partial');await move(2,700);await wait(400);await shot('stream-near');await move(2,710);await wait(400);await shot('shield-intake');await page.locator('#zoom').click();await wait(100);await shot('shield-intake-1x');await page.locator('#zoom').click();");
 routeSource=routeSource.replace('time:+c.dataset.simTime}', 'time:+c.dataset.simTime,camera:JSON.parse(c.dataset.camera),canvasRect:(()=>{const r=c.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};})()}');
 routeSource=routeSource.replace("await shot('drained');","await shot('drained');await wait(300);await shot('drained-contact-2x');await page.locator('#zoom').click();await wait(300);await shot('drained-contact-1x');await page.locator('#zoom').click();await page.setViewportSize({width:844,height:390});await wait(300);await shot('drained-contact-mobile');await page.setViewportSize({width:1440,height:900});await wait(300);");
 const route=eval('('+routeSource+')');
 const result=await route(page);
 fs.mkdirSync('output/water92',{recursive:true});
 fs.writeFileSync('output/water92/'+(process.env.WATER92_LIVE?'live-':'')+'water-route.json',JSON.stringify({active,result},null,2));
 if(!result.won||result.errors.length)throw Error('Route failed '+JSON.stringify(result));
 console.log(JSON.stringify({won:result.won,hp:result.hp,time:result.time,errors:result.errors}));
}finally{await browser.close();server?.close();}
