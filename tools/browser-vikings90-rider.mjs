import {createRequire} from 'node:module';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const root=path.resolve('output/release-vikings90/dist'),out='output/vikings90-rider';
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
 const target=path.resolve(root,'.'+(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));
 if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json'};
 fs.readFile(target,(error,data)=>{res.writeHead(error?404:200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});res.end(error?'Missing':data);});
}).listen(3062,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],captures=[];
page.on('pageerror',e=>errors.push(String(e)));
const state=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),pose:c.dataset.pose,frame:+c.dataset.frame,camera:JSON.parse(c.dataset.camera),canvas:{width:c.width,height:c.height,displayWidth:c.getBoundingClientRect().width,displayHeight:c.getBoundingClientRect().height}}));
const shot=async name=>{await page.screenshot({path:`${out}/${name}.png`});captures.push({name,...await state()});};
try{
 await page.goto('http://127.0.0.1:3062/?skin=imagegen90');await page.locator('#play-cycle').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroArt||'{}').ready);
 const viewport=await page.locator('#game').boundingBox();
 if(viewport.width!==1440||viewport.height!==900)throw Error('Production fullscreen styles did not load '+JSON.stringify(viewport));
 await page.keyboard.press('3');await page.keyboard.press('Space');await page.keyboard.down('ArrowRight');
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[2].x>=500);
 await page.keyboard.up('ArrowRight');await page.waitForTimeout(300);
 const x=(await state()).heroes[2].x;
 await page.keyboard.press('1');await page.keyboard.down('ArrowRight');
 await page.waitForFunction(x=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x>=x-100,x);
 await page.keyboard.press('Space');
 await page.waitForFunction(x=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x>=x-8,x);
 await page.keyboard.up('ArrowRight');await page.keyboard.down('ArrowLeft');await page.waitForTimeout(120);await page.keyboard.up('ArrowLeft');
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].support===2,null,{timeout:10000});
 let riderOffset;
 await page.keyboard.press('3');await page.keyboard.down('ArrowRight');
 for(let phase=0;phase<8;phase++){
  await page.waitForFunction(phase=>{const c=document.querySelector('#game');if(c.dataset.pose!=='run'||+c.dataset.frame!==phase)return false;document.querySelector('#pause').click();return true;},phase);
  await page.keyboard.up('ArrowRight');await page.waitForTimeout(100);
  const s=await state(),[r,,o]=s.heroes;
  if(r.support!==2||Math.abs(r.y+44-(o.y-36))>.01)throw Error('Rider lost center-plane contact '+JSON.stringify(s));
  riderOffset??=r.x-o.x;
  if(Math.abs(r.x-o.x-riderOffset)>.01)throw Error('Rider slid across moving shield '+JSON.stringify(s));
  await shot('walk-'+phase+'-2x');
  if(phase===2){
   await page.locator('#zoom').click();await shot('rider-1x');await page.setViewportSize({width:844,height:390});await shot('rider-mobile-1x');
   await page.locator('#zoom').click();await shot('rider-mobile-2x');await page.setViewportSize({width:1440,height:900});
  }
  await page.keyboard.press('Escape');await page.keyboard.down('ArrowRight');
 }
 await page.keyboard.up('ArrowRight');await page.waitForTimeout(300);await page.keyboard.down('ArrowLeft');await page.waitForTimeout(160);await page.keyboard.up('ArrowLeft');await page.keyboard.press('Escape');await shot('reversed');
 if(errors.length)throw Error(errors.join(';'));
 fs.writeFileSync(out+'/evidence.json',JSON.stringify({errors,captures},null,2));console.log(JSON.stringify({errors,captures:captures.length}));
}finally{await browser.close();server.close();}
