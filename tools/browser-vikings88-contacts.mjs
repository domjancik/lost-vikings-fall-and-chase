import{createRequire}from'node:module';import fs from'node:fs';import http from'node:http';import path from'node:path';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const{chromium}=require('playwright'),out='output/playwright/vikings88';fs.mkdirSync(out,{recursive:true});
const webRoot=path.resolve('output/release-imagegen88/dist');
const server=http.createServer((req,res)=>{const p=path.resolve(webRoot,'.'+(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));if(!p.startsWith(webRoot+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(p,(e,d)=>{res.writeHead(e?404:200,{'Content-Type':p.endsWith('.js')?'text/javascript':p.endsWith('.png')?'image/png':p.endsWith('.css')?'text/css':'text/html'});res.end(e?'Not found':d);});}).listen(3041,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],evidence=[];
page.on('pageerror',e=>errors.push(String(e)));
const state=()=>page.evaluate(()=>({heroes:JSON.parse(document.querySelector('#game').dataset.heroes),pose:document.querySelector('#game').dataset.pose,frame:document.querySelector('#game').dataset.frame,camera:JSON.parse(document.querySelector('#game').dataset.camera)}));
const capture=async label=>{await page.screenshot({path:`${out}/${label}.png`});evidence.push({label,...await state()});};
const captureSizes=async label=>{
 await capture(label+'-2x');await page.locator('#zoom').click();await page.waitForTimeout(160);await capture(label+'-1x');await page.setViewportSize({width:390,height:844});await page.waitForTimeout(160);await capture(label+'-mobile-1x');await page.locator('#zoom').click();await page.waitForTimeout(160);await capture(label+'-mobile-2x');await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(160);
};
const toX=async(id,x)=>{await page.waitForTimeout(120);await page.evaluate(()=>document.activeElement?.blur());await page.keyboard.press(String(id+1));await page.keyboard.down('ArrowRight');await page.waitForFunction(({id,x})=>JSON.parse(document.querySelector('#game').dataset.heroes)[id].x>=x,{id,x});await page.keyboard.up('ArrowRight');await page.waitForTimeout(150);};
const enterCycle=async()=>{await page.goto('http://127.0.0.1:3041/?skin=imagegen88');await page.locator('#play-cycle').click();await page.waitForTimeout(400);await page.keyboard.press('F2');await page.locator('#debug-level').selectOption('0');await page.locator('#debug-go').click();await page.waitForTimeout(300);};
try{
 await page.goto('http://127.0.0.1:3041/?skin=imagegen88');await page.locator('#play-clockwork').click();await page.waitForTimeout(700);
 await page.locator('#pause').click();await captureSizes('imagegen88-clockwork-real-context');await page.locator('#pause').click();
 await enterCycle();
 await page.locator('#help').click();await page.locator('#hero-skin').selectOption('imagegen88');await page.locator('#close-help').click();
 for(let id=0;id<(process.env.VIKINGS88_PRIORITY?0:3);id++){
  await page.locator('#restart').click();await toX(id,640);await page.keyboard.down('ArrowUp');await page.waitForFunction(id=>JSON.parse(document.querySelector('#game').dataset.heroes)[id].climbing,id);await page.waitForTimeout(1100);await page.keyboard.up('ArrowUp');await page.locator('#pause').click();await page.waitForTimeout(200);await capture(`imagegen88-${id}-actual-ladder-2x`);
  await page.locator('#zoom').click();await page.waitForTimeout(160);await capture(`imagegen88-${id}-actual-ladder-1x`);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(200);await capture(`imagegen88-${id}-actual-ladder-mobile-1x`);await page.locator('#zoom').click();await page.waitForTimeout(160);await capture(`imagegen88-${id}-actual-ladder-mobile-2x`);await page.setViewportSize({width:1440,height:900});await page.locator('#pause').click();
 }
 if(!process.env.VIKINGS88_PRIORITY){await page.locator('#restart').click();await toX(2,640);await page.keyboard.press('f');await page.waitForTimeout(500);await page.keyboard.down('ArrowUp');try{await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[2].climbing,{},{timeout:5000});}catch(e){fs.writeFileSync(`${out}/raised-ladder-block.json`,JSON.stringify({errors,...await state()},null,2));await capture('imagegen88-raised-ladder-block');throw e;}await page.waitForTimeout(700);await page.keyboard.up('ArrowUp');await page.locator('#pause').click();await captureSizes('imagegen88-olaf-actual-raised-ladder');await page.locator('#pause').click();}
 // The cycle puzzle does not implement bash; verify abilities in the arcade
 // collection using its production entry, rather than mutating a hero state.
 await page.goto('http://127.0.0.1:3041/');await page.locator('#play').click();await page.waitForTimeout(400);
 for(const[id,key,pose]of[[0,'d','bash'],[1,'Space','sword'],[1,'d','bow'],[2,'Space','shield-raise']]){
  await page.locator('#restart').click();await toX(id,335);
  if(pose==='bash'){await page.keyboard.down('ArrowRight');await page.waitForFunction(()=>Number(document.querySelector('#game').dataset.speed)>140);}
  const middle=pose==='bow'?2:3;
  await page.keyboard.press(key);await page.waitForFunction(({pose,middle})=>document.querySelector('#game').dataset.pose===pose&&Number(document.querySelector('#game').dataset.frame)>=middle,{pose,middle});await page.locator('#pause').click();await page.keyboard.up('ArrowRight');await page.waitForTimeout(120);await captureSizes(`imagegen88-${id}-actual-${pose}`);await page.locator('#pause').click();
 }
 // Raise Olaf at x335, then Erik jumps onto the actual center support plane.
 await enterCycle();
 await page.locator('#restart').click();await toX(2,335);await page.keyboard.press('Space');await page.waitForTimeout(700);await page.locator('#pause').click();await captureSizes('imagegen88-olaf-actual-held-overhead');await page.locator('#pause').click();
 await toX(0,295);await page.keyboard.press('Space');await page.keyboard.down('ArrowRight');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x>=333);await page.keyboard.up('ArrowRight');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].support===2);await page.locator('#pause').click();await page.waitForTimeout(160);await captureSizes('imagegen88-actual-rider-middle-plane');
 if(errors.length)throw Error(errors.join(';'));fs.writeFileSync(`${out}/contacts-evidence.json`,JSON.stringify({errors,evidence},null,2));console.log(JSON.stringify({errors,captures:evidence.length}));
}finally{await browser.close();server.close();}
