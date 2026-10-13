import{createRequire}from'node:module';import fs from'node:fs';import http from'node:http';import path from'node:path';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const{chromium}=require('playwright'),out='output/playwright/vikings90';fs.mkdirSync(out,{recursive:true});
const webRoot=path.resolve('output/release-vikings90/dist');
const server=http.createServer((req,res)=>{const p=path.resolve(webRoot,'.'+(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));if(!p.startsWith(webRoot+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(p,(e,d)=>{res.writeHead(e?404:200,{'Content-Type':p.endsWith('.js')?'text/javascript':p.endsWith('.png')?'image/png':p.endsWith('.css')?'text/css':'text/html'});res.end(e?'Not found':d);});}).listen(3056,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],evidence=[];
page.on('pageerror',e=>errors.push(String(e)));
const state=()=>page.evaluate(()=>({heroes:JSON.parse(document.querySelector('#game').dataset.heroes),pose:document.querySelector('#game').dataset.pose,frame:document.querySelector('#game').dataset.frame,camera:JSON.parse(document.querySelector('#game').dataset.camera)}));
const capture=async label=>{await page.screenshot({path:`${out}/${label}.png`});evidence.push({label,...await state()});};
const captureSizes=async label=>{
 await capture(label+'-2x');await page.locator('#zoom').click();await page.waitForTimeout(160);await capture(label+'-1x');await page.setViewportSize({width:390,height:844});await page.waitForTimeout(160);await capture(label+'-mobile-1x');await page.locator('#zoom').click();await page.waitForTimeout(160);await capture(label+'-mobile-2x');await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(160);
};
const toX=async(id,x)=>{await page.waitForTimeout(120);await page.evaluate(()=>document.activeElement?.blur());await page.keyboard.press(String(id+1));await page.keyboard.down('ArrowRight');await page.waitForFunction(({id,x})=>JSON.parse(document.querySelector('#game').dataset.heroes)[id].x>=x,{id,x});await page.keyboard.up('ArrowRight');await page.waitForTimeout(150);};
const enterCycle=async()=>{await page.goto('http://127.0.0.1:3056/?skin=imagegen90');await page.locator('#play-cycle').click();await page.waitForTimeout(400);await page.keyboard.press('F2');await page.locator('#debug-level').selectOption('0');await page.locator('#debug-go').click();await page.waitForTimeout(300);};
try{
 await enterCycle();
 for(const id of (process.argv.includes("--all")?[0,1,2]:[0])){
  await page.locator('#restart').click();await toX(id,640);
  for(let phase=0;phase<4;phase++){
   await page.keyboard.down('ArrowUp');await page.waitForFunction(phase=>document.querySelector('#game').dataset.pose==='climb'&&Number(document.querySelector('#game').dataset.frame)===phase,phase);
   await page.keyboard.press('Escape');await page.keyboard.up('ArrowUp');await page.waitForTimeout(70);await capture(`imagegen90-${id}-actual-ladder-phase-${phase}`);
   if(phase===2)await captureSizes(`imagegen90-${id}-actual-ladder-material`);
   await page.keyboard.press('Escape');
  }
  await page.keyboard.up('ArrowUp');await page.waitForTimeout(200);const stopped=await state();await page.waitForTimeout(250);const held=await state();
  if(stopped.frame!==held.frame)throw Error('Stopped ladder pose advanced without travel');
  await capture(`imagegen90-${id}-actual-ladder-stopped`);
  await page.keyboard.down('ArrowDown');await page.waitForTimeout(200);await page.keyboard.up('ArrowDown');await page.keyboard.press('Escape');await capture(`imagegen90-${id}-actual-ladder-reversed`);await page.keyboard.press('Escape');
 }
 if(process.argv.includes('--all')){await page.locator('#restart').click();await toX(2,640);await page.keyboard.press('f');await page.waitForTimeout(400);await page.keyboard.down('ArrowUp');await page.waitForTimeout(1400);await page.keyboard.up('ArrowUp');await page.keyboard.down('ArrowRight');await page.waitForTimeout(250);await page.keyboard.up('ArrowRight');await page.waitForFunction(()=>document.querySelector('#game').dataset.pose==='float');await page.keyboard.press('Escape');await page.waitForTimeout(100);await captureSizes('imagegen90-olaf-actual-float');}
 fs.writeFileSync(`${out}/ladder-detail-evidence.json`,JSON.stringify({errors,evidence},null,2));console.log(JSON.stringify({errors,captures:evidence.length}));
}finally{await browser.close();server.close();}
