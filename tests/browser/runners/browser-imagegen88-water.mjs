import {createRequire} from 'node:module';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const root=path.resolve('output/release-imagegen88/dist');
const mime={'.html':'text/html','.js':'text/javascript','.png':'image/png','.css':'text/css','.json':'application/json'};
const server=process.env.VIKINGS88_LIVE?null:http.createServer((req,res)=>{
 const urlPath=req.url.split('?')[0];
 const file=path.resolve(root,'.'+(urlPath==='/'?'/index.html':urlPath));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(file,(err,bytes)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(err?'Missing':bytes);});
}).listen(3043,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage();
try{
 await page.goto((process.env.VIKINGS88_LIVE?'https://united-marsh-6ppd.here.now/':'http://127.0.0.1:3043/')+'?skin=imagegen88&release=88');
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes||'[]').length===3);
 const active=await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.heroes));
 if(active.some(h=>h.skin!=='imagegen88')||!active[2].shieldArtPose)throw Error('Imagegen88 physical binding absent');
 const route=eval('('+fs.readFileSync('archive/browser/browser-water87.js','utf8').replaceAll('water87-','imagegen88-water-')+')');
 const result=await route(page);
 fs.mkdirSync('output/imagegen88',{recursive:true});
 fs.writeFileSync('output/imagegen88/'+(process.env.VIKINGS88_LIVE?'live-':'')+'water-route.json',JSON.stringify({active,result},null,2));
 if(!result.won||result.errors.length)throw Error('Route failed '+JSON.stringify(result));
 console.log(JSON.stringify({won:result.won,hp:result.hp,time:result.time,errors:result.errors}));
}finally{await browser.close();server?.close();}
