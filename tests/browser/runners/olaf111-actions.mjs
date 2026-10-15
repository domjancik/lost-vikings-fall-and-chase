import {reviewNavigate} from '../review-skin.mjs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs/promises';import path from 'node:path';import http from 'node:http';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),repository=fileURLToPath(new URL('../../../',import.meta.url));
const root=process.env.OLAF_ACTION_ROOT||repository,out=path.join(repository,'assets/olaf111/'+(process.argv.includes('--look-only')?'early-look-evidence':'actions-evidence'));await fs.mkdir(out,{recursive:true});
const server=http.createServer(async(req,res)=>{try{
 const p=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
 if(!(p==='index.html'||p==='style.css'||p.startsWith('src/')||p.startsWith('assets/')))throw Error('Forbidden');
 const file=path.resolve(root,p);if(!file.startsWith(path.resolve(root)+path.sep))throw Error('Forbidden');
 const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.png':'image/png','.css':'text/css','.json':'application/json'})[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
}catch{res.writeHead(404);res.end('Missing');}}).listen(3124,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),errors=[],captures=[];
async function run(name,options){
 const context=await browser.newContext(options),page=await context.newPage();page.on('pageerror',e=>errors.push(name+':'+String(e)));
 await page.addInitScript(()=>{localStorage.setItem('last-call-story-cards','off');localStorage.setItem('last-call-zoom','2');localStorage.setItem('last-call-skin','current');});
 await reviewNavigate(page,'http://127.0.0.1:3124/?campaign=cycle&skin=current');await page.locator('#start-picker .level-card[data-round="7"]').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroArt||'{}').ready);await page.keyboard.press('3');
 const state=()=>page.locator('#game').evaluate(c=>({pose:c.dataset.pose,frame:+c.dataset.frame,paused:c.dataset.paused,time:+c.dataset.simTime,heroes:JSON.parse(c.dataset.heroes),camera:JSON.parse(c.dataset.camera),machine:JSON.parse(c.dataset.puzzle).machine}));
 async function shot(label){await page.screenshot({path:path.join(out,name+'-'+label+'.png')});captures.push({name:name+'-'+label,...await state()});}
 async function pair(label){await shot(label+'-2x');await page.locator('#zoom').click();await page.waitForTimeout(100);await shot(label+'-1x');await page.locator('#zoom').click();await page.waitForTimeout(100);}
 async function capture(pose,frame,label,extra={}){
  await page.waitForFunction(({pose,frame,extra})=>{
   const c=document.querySelector('#game'),h=JSON.parse(c.dataset.heroes)[2];
   if(c.dataset.pose!==pose||(frame!==null&&+c.dataset.frame!==frame))return false;
   if(extra.maxFeet!==undefined&&h.y+44>=extra.maxFeet)return false;
   if(extra.minX!==undefined&&h.x<extra.minX)return false;
   if(extra.downward&&h.vy<=20)return false;
   if(extra.hurt&&(h.hp===3||Math.floor(+c.dataset.simTime*16)%2))return false;
   document.querySelector('#pause').click();return true;
  },{pose,frame,extra},{timeout:15000});
  await page.waitForTimeout(100);const s=await state();if(s.pose!==pose||(frame!==null&&s.frame!==frame))throw Error('Pose drift '+label+JSON.stringify(s));
  await pair(label);await page.locator('#pause').click();
 }
 async function rightTo(id,x){await page.keyboard.press(String(id+1));await page.keyboard.down('ArrowRight');await page.waitForFunction(({id,x})=>JSON.parse(document.querySelector('#game').dataset.heroes)[id].x>=x,{id,x},{timeout:20000});await page.keyboard.up('ArrowRight');await page.waitForTimeout(250);}
 await rightTo(2,250);
 for(const [key,pose]of [['ArrowUp','look-up'],['ArrowDown','look-down']]){
  await page.keyboard.down(key);await page.waitForFunction(pose=>document.querySelector('#game').dataset.pose===pose,pose);await shot(pose+'-early-2x');await page.waitForTimeout(150);await pair(pose);await page.keyboard.up(key);
 }
 if(process.argv.includes('--look-only')){await context.close();return;}
 // Open the real masonry plug with Erik's running bash, rather than setting it.
 await page.keyboard.press('1');await page.keyboard.down('ArrowRight');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x>=412);await page.keyboard.press('d');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.puzzle).machine.ventOpen);await page.keyboard.up('ArrowRight');
 await page.keyboard.press('3');await page.keyboard.press('Space');await rightTo(2,480);
 await capture('float',0,'ascending-draft',{maxFeet:800});
 // Lower the shield while physically rising; the actual free-fall then supplies
 // front rising/falling and a hard landing, which raised floating cannot trigger.
 await page.keyboard.press('d');await capture('rise',0,'front-rise');
 await capture('fall',0,'front-fall0');await capture('fall',1,'front-fall1');
 for(let f=0;f<3;f++)await capture('land',f,'landing'+f);
 await page.waitForTimeout(150);await page.keyboard.press('Space');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[2].y+44<550,null,{timeout:12000});
 await page.keyboard.down('ArrowRight');await capture('float',1,'floating-glide1',{minX:560});await capture('float',2,'floating-glide2',{minX:560});await page.keyboard.up('ArrowRight');await capture('float',3,'floating-braking-fall',{downward:true});
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[2].ground,null,{timeout:10000});
 // Keep the shield raised to expose Olaf to the inspector's horizontal shot.
 // Board the live trolley and wait for a real hit; no health/position injection.
 await rightTo(2,1010);await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[2].support==='freight-cart',null,{timeout:18000});
 await capture('hurt',null,'inspector-real-damage',{hurt:true});
 await page.locator('#pause').click();await shot('hurt-paused-final');
 await context.close();
}
try{
 if(!process.argv.includes('--mobile'))await run('desktop',{viewport:{width:1440,height:900}});
 await run('mobile',{viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 if(errors.length)throw Error(errors.join(';'));
 await fs.writeFile(path.join(out,'evidence.json'),JSON.stringify({errors,captures,controls:'Normal keyboard controls, UI pause/zoom only; no state overrides.'},null,2));console.log(JSON.stringify({captures:captures.length,errors}));
}finally{await fs.writeFile(path.join(out,'last-run.json'),JSON.stringify({errors,captures},null,2));console.log(JSON.stringify({errors,captures:captures.length}));await browser.close();server.close();}
