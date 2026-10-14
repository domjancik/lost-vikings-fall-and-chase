import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),live=!!process.env.MENU95_LIVE,root=path.resolve('output/release-menu95/dist');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json'};
const server=live?null:http.createServer((req,res)=>{
 if(req.url.split('?')[0]==='/favicon.ico'){res.writeHead(204);res.end();return;}
 const file=path.resolve(root,'.'+(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(file,(err,bytes)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(err?'Missing':bytes);});
}).listen(3053,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],evidence=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text()+' '+m.location().url);});
fs.mkdirSync('output/menu95',{recursive:true});fs.mkdirSync('output/playwright',{recursive:true});
const base=live?'https://united-marsh-6ppd.here.now/':'http://127.0.0.1:3053/';
async function ready(host,count){await page.waitForFunction(({host,count})=>{const pictures=document.querySelectorAll(host+' .level-card canvas');return pictures.length===count&&[...pictures].every(c=>c.dataset.ready==='true');},{host,count},{timeout:30000});}
async function photo(label){await page.screenshot({path:'output/playwright/menu95-'+(live?'live-':'')+label+'.png'});}
async function state(){return page.locator('#game').evaluate(c=>({campaign:c.dataset.campaign,round:c.dataset.round,time:c.dataset.simTime,heroes:c.dataset.heroes,puzzle:c.dataset.puzzle,paused:c.dataset.paused}));}
try{
 await page.goto(base+'?release=menu95');await page.evaluate(()=>localStorage.setItem('last-call-story-cards','off'));
 await page.waitForSelector('#start-picker [data-campaign-option]');assert.equal(await page.locator('#start-picker [data-campaign-option]').count(),3);
 assert.equal(await page.locator('.mobile-controls').isVisible(),false,'Game controls do not clutter title menu');
 const titleBefore=await state();
 for(const [id,count] of [['story',8],['cycle',6],['arcade',11]]){
  await page.locator('#start-picker [data-campaign-option="'+id+'"]').click();await ready('#start-picker',count);
  const pictures=await page.locator('#start-picker canvas').evaluateAll(cs=>cs.map(c=>c.toDataURL()));assert.equal(new Set(pictures).size,count,'Each level must have a distinct actual scene');
  await photo('desktop-'+id);evidence.push({campaign:id,count,distinct:new Set(pictures).size});
  assert.deepEqual(await state(),titleBefore,'Browsing title campaigns must not launch or change state');
 }
 for(const size of [{width:390,height:844},{width:844,height:390}]){
  await page.setViewportSize(size);await page.locator('#start-picker [data-campaign-option="cycle"]').click();await ready('#start-picker',6);await photo('title-'+size.width);
  assert.ok(await page.locator('#start-picker').evaluate(el=>el.getBoundingClientRect().right<=innerWidth),'No mobile horizontal overflow');
 }
 await page.setViewportSize({width:1440,height:900});await page.locator('#start-picker .level-card[data-round="3"]').click();
 await page.waitForFunction(()=>{const c=document.querySelector('#game');return c.dataset.campaign==='cycle'&&c.dataset.round==='3';});
 await page.locator('#pause').click();await page.waitForFunction(()=>document.querySelector('#game').dataset.paused==='true');const before=await state();await page.locator('#rounds').click();
 for(const [id,count] of [['story',8],['arcade',11],['cycle',6]]){await page.locator('#round-picker [data-campaign-option="'+id+'"]').click();await ready('#round-picker',count);}
 const after=await state();assert.deepEqual(after,before,'Preview browsing must preserve live state');
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#round-dialog').open);assert.equal((await state()).paused,'true','Return preserves prior pause');
 await page.locator('#pause').click();await page.locator('#rounds').click();await photo('ingame-desktop');
 await page.setViewportSize({width:390,height:844});await photo('ingame-mobile');
 // Exercise every card: correct campaign/level launches, controls unpaused, fresh crew.
 let launched=0;
 for(const [id,count] of [['cycle',6],['story',8],['arcade',11]])for(let round=0;round<count;round++){
  if(!await page.locator('#round-dialog').evaluate(d=>d.open))await page.locator('#rounds').click();
  await page.locator('#round-picker [data-campaign-option="'+id+'"]').click();await page.locator('#round-picker .level-card[data-round="'+round+'"]').click();
  await page.waitForFunction(({id,round})=>{const c=document.querySelector('#game');return c.dataset.campaign===id&&Number(c.dataset.round)===round&&c.dataset.paused==='false';},{id,round});
  assert.ok(!await page.locator('#round-dialog').evaluate(d=>d.open));assert.ok((await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.heroes))).every(h=>h.hp===3&&!h.dead));launched++;
 }
 // Native touch and keyboard activation, in a fresh mobile browser context.
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const mobile=await touch.newPage();
 mobile.on('pageerror',e=>errors.push(String(e)));await mobile.goto(base+'?release=menu95');
 await mobile.locator('#start-picker [data-campaign-option="cycle"]').tap();await mobile.locator('#start-picker .level-card[data-round="4"]').tap();
 await mobile.waitForFunction(()=>{const c=document.querySelector('#game');return c.dataset.campaign==='cycle'&&c.dataset.round==='4';});
 assert.ok(await mobile.locator('.mobile-controls').isVisible());await mobile.locator('#rounds').tap();
 await mobile.locator('#round-picker .level-card[data-round="3"]').focus();await mobile.keyboard.press('Enter');
 await mobile.waitForFunction(()=>document.querySelector('#game').dataset.round==='3');await touch.close();
 assert.deepEqual(errors,[]);console.log(JSON.stringify({campaigns:3,previews:25,launched,errors,pausedReturn:true,touchAndKeyboard:true}));
 evidence.push({launched,errors,pausedReturn:true});
}finally{fs.writeFileSync('output/menu95/'+(live?'live-':'')+'evidence.json',JSON.stringify({evidence,errors},null,2));await browser.close();server?.close();}
