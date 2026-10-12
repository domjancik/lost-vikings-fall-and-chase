import {createRequire} from 'node:module';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const mime={'.html':'text/html','.js':'text/javascript','.png':'image/png','.css':'text/css'};
const webRoot=path.resolve('output/release-imagegen88/dist');
const server=http.createServer((req,res)=>{
 const p=path.resolve(webRoot,'.'+decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));
 if(!p.startsWith(webRoot+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(p,(error,data)=>{res.writeHead(error?404:200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream'});res.end(error?'Not found':data);});
}).listen(3040,'127.0.0.1');
fs.mkdirSync('output/playwright/vikings88',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.goto('http://127.0.0.1:3040/');await page.locator('#play-cycle').click();await page.waitForTimeout(500);await page.keyboard.press('F2');await page.locator('#debug-level').selectOption('0');await page.locator('#debug-go').click();await page.waitForTimeout(300);
 const diagnostic=await page.evaluate(async()=>{
  const {drawHeroArt,whenHeroesReady,setHeroSkin}=await import('./hero-art.js?v=imagegen88');setHeroSkin('imagegen88');await whenHeroesReady();
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=192;const g=canvas.getContext('2d');g.imageSmoothingEnabled=false;g.scale(.5,.5);
  g.fillStyle='#202531';g.fillRect(0,0,2048,384);
  for(let id=0;id<3;id++)for(const [k,skin]of ['current','imagegen88'].entries())for(let f=0;f<8;f++){
   const x=(k*8+f)*128+64,y=id*128+80;g.fillStyle='#b6c5d1';g.fillRect(x-60,y+44,120,2);drawHeroArt(g,{id,face:1,skin},x,y,'run',f);
  }
  return canvas.toDataURL('image/png').split(',')[1];
 });
 fs.writeFileSync('output/playwright/vikings88/same-size-native-gaits.png',Buffer.from(diagnostic,'base64'));
 const selectSkin=async skin=>{await page.locator('#help').click();await page.locator('#hero-skin').selectOption(skin);await page.locator('#close-help').click();};
 const state=()=>page.evaluate(()=>JSON.parse(document.querySelector('#game').dataset.heroes));
 const result={errors,cadence:[],evidence:[]};
 for(const skin of ['current','imagegen88']){
  await selectSkin(skin);await page.locator('#restart').click();await page.waitForTimeout(250);
  for(let id=0;id<3;id++){
   await page.locator('#restart').click();await page.waitForTimeout(100);
   await page.keyboard.press(String(id+1));await page.keyboard.down('ArrowRight');
   await page.waitForFunction(id=>JSON.parse(document.querySelector('#game').dataset.heroes)[id].x>=335,id);
   await page.keyboard.up('ArrowRight');await page.waitForTimeout(180);
   await page.waitForFunction(id=>JSON.parse(document.querySelector('#game').dataset.heroes)[id].ground,id);
   const before=(await state())[id];await page.keyboard.down('ArrowRight');
   for(let n=0;n<8;n++){
    await page.waitForFunction(n=>document.querySelector('#game').dataset.pose==='run'&&Number(document.querySelector('#game').dataset.frame)===n,n);
    await page.locator('#pause').click();await page.waitForTimeout(160);
    const label=`${skin}-${id}-phase${n}`;
    const actual=await page.locator('#game').getAttribute('data-frame');
    if(Number(actual)!==n)throw Error(`${label}: captured phase ${actual} instead of ${n}`);
    await page.screenshot({path:`output/playwright/vikings88/${label}-2x.png`});result.evidence.push({label,actual,heroes:await state()});
    if(n===7){
     await page.locator('#zoom').click();await page.waitForTimeout(180);await page.screenshot({path:`output/playwright/vikings88/${skin}-${id}-running-1x.png`});
     await page.setViewportSize({width:390,height:844});await page.waitForTimeout(200);await page.screenshot({path:`output/playwright/vikings88/${skin}-${id}-running-mobile-1x.png`});
     await page.locator('#zoom').click();await page.waitForTimeout(200);await page.screenshot({path:`output/playwright/vikings88/${skin}-${id}-running-mobile-2x.png`});
     await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(180);
    }
    await page.locator('#pause').click();await page.keyboard.up('ArrowRight');await page.keyboard.down('ArrowRight');
   }
   const after=(await state())[id];result.cadence.push({skin,id,before,after});await page.keyboard.up('ArrowRight');await page.waitForTimeout(160);
   await page.locator('#pause').click();await page.locator('#zoom').click();await page.waitForTimeout(160);await page.screenshot({path:`output/playwright/vikings88/${skin}-${id}-1x.png`});await page.locator('#zoom').click();await page.locator('#pause').click();
   await page.keyboard.down('ArrowLeft');await page.waitForTimeout(110);await page.screenshot({path:`output/playwright/vikings88/${skin}-${id}-reverse.png`});await page.keyboard.up('ArrowLeft');await page.waitForTimeout(200);await page.screenshot({path:`output/playwright/vikings88/${skin}-${id}-idle.png`});
  }
 }
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(200);await page.screenshot({path:'output/playwright/vikings88/trial-mobile-2x.png'});await page.locator('#zoom').click();await page.waitForTimeout(200);await page.screenshot({path:'output/playwright/vikings88/trial-mobile-1x.png'});
 if(errors.length)throw Error(errors.join(';'));fs.writeFileSync('output/playwright/vikings88/evidence.json',JSON.stringify(result,null,2));console.log(JSON.stringify({errors,captures:result.evidence.length}));
}finally{await browser.close();server.close();}
