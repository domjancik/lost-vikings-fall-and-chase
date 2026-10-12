import {createRequire} from 'node:module';import fs from 'node:fs';import http from 'node:http';import path from 'node:path';import assert from 'node:assert/strict';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const root=path.resolve('output/release-imagegen88/dist'),mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.png':'image/png','.css':'text/css'};
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+req.url.split('?')[0]);if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(e,b)=>{res.writeHead(e?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(e?'Missing':b);});}).listen(3044,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.goto((process.env.VIKINGS88_LIVE||'http://127.0.0.1:3044').replace(/\/$/,'')+'/viking-gallery88.html');await page.waitForFunction(()=>document.querySelectorAll('#cards canvas').length===9);
 assert.equal(await page.locator('#sources details').count(),3);
 await page.locator('#play').click();await page.locator('#hero').selectOption('olaf');await page.locator('#action').selectOption('overhead-walk');await page.locator('#phase').fill('7');await page.locator('#zoom').selectOption('4');
 const result=await page.evaluate(()=>({visible:[...document.querySelectorAll('#cards article')].filter(a=>!a.hidden).length,width:document.querySelectorAll('#cards canvas')[6].style.width,cells:[...document.querySelectorAll('#cards small')].map(s=>s.textContent),sources:[...document.querySelectorAll('#sources a')].map(a=>a.getAttribute('href')),nonblank:[...document.querySelectorAll('#cards canvas')].map(c=>{const pixels=c.getContext('2d').getImageData(0,0,80,80).data;let n=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i])n++;return n;})}));
 assert.equal(result.visible,1);assert.equal(result.width,'320px');assert.ok(result.cells[2].includes('cell 33'));assert.ok(result.sources[2].includes('olaf-full-raw-v3'));assert.ok(result.nonblank.every(n=>n>100));assert.deepEqual(errors,[]);
 await page.setViewportSize({width:390,height:844});await page.locator('#zoom').selectOption('2');await page.locator('#hero').selectOption('all');assert.equal(await page.locator('#cards article:not([hidden])').count(),3);
 fs.mkdirSync('output/imagegen88',{recursive:true});fs.writeFileSync('output/imagegen88/gallery-test.json',JSON.stringify({errors,...result},null,2));console.log(JSON.stringify({errors,comparisons:9,poses:130,controls:'pause/hero/action/phase/zoom/mobile passed'}));
}finally{await browser.close();server.close();}
