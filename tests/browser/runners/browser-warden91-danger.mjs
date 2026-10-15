import {reviewNavigate} from '../review-skin.mjs';
import {createRequire} from 'node:module';import fs from 'node:fs';import http from 'node:http';import path from 'node:path';
if(process.argv.includes('--live'))process.env.WARDEN91_LIVE='1';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const root=path.resolve('output/release-warden91/dist'),out='output/warden91/danger';fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.png':'image/png','.css':'text/css','.json':'application/json'};
const server=process.env.WARDEN91_LIVE?null:http.createServer((req,res)=>{const f=path.resolve(root,'.'+(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(f,(err,b)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});res.end(err?'Missing':b);});}).listen(3059,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
try{
 await reviewNavigate(page,(process.env.WARDEN91_LIVE?'https://united-marsh-6ppd.here.now/':'http://127.0.0.1:3059/')+'?skin=imagegen88&campaign=cycle&puzzle=warden&release=91');await page.locator('#play-warden').click();
 await page.waitForFunction(()=>{const a=JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}');return a.ready&&a.sourceDensity?.startsWith('512native');});
 const state=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,won:c.dataset.won==='true',failed:c.dataset.failed==='true',art:JSON.parse(c.dataset.cycleArt),time:+c.dataset.simTime,camera:JSON.parse(c.dataset.camera),canvasRect:{x:c.getBoundingClientRect().x,y:c.getBoundingClientRect().y,width:c.getBoundingClientRect().width,height:c.getBoundingClientRect().height}}));
 const held=new Set(),evidence={};
 const keys=async names=>{for(const k of [...held])if(!names.includes(k)){await page.keyboard.up(k);held.delete(k);}for(const k of names)if(!held.has(k)){await page.keyboard.down(k);held.add(k);}};
 const tap=async k=>{await keys([]);await page.keyboard.press(k,{delay:60});await page.waitForTimeout(60);};
 const shot=async name=>{await page.screenshot({path:out+'/'+(process.env.WARDEN91_LIVE?'live-':'')+name+'.png'});evidence[name]=await state();};
 const variants=async name=>{await keys([]);await page.keyboard.press('Escape');const t=(await state()).time,original=(await state()).camera.zoom;
  for(const [size,label] of [[{width:1440,height:900},'desktop'],[{width:844,height:390},'mobile']]){await page.setViewportSize(size);for(const zoom of [1,2]){if((await state()).camera.zoom!==zoom)await page.locator('#zoom').click();await page.waitForTimeout(200);await shot(name+'-'+label+'-'+zoom+'x');}}
  await page.setViewportSize({width:1440,height:900});if((await state()).camera.zoom!==original)await page.locator('#zoom').click();await page.waitForTimeout(200);if(Math.abs((await state()).time-t)>.03)throw Error('Paused capture advanced simulation');await page.keyboard.press('Escape');};
 const until=async(cond,input=()=>[],limit=35000)=>{const start=Date.now();while(Date.now()-start<limit){const s=await state();if(s.failed)throw Error('Death '+JSON.stringify(s));if(cond(s)){await keys([]);return;}await keys(input(s));await page.waitForTimeout(25);}throw Error('Timeout '+JSON.stringify(await state()));};
 const move=async(id,x)=>{await tap(String(id+1));await until(s=>s.won||Math.abs(s.heroes[id].x-x)<5&&Math.abs(s.heroes[id].vx)<16,s=>{const h=s.heroes[id],d=x-h.x-h.vx*Math.abs(h.vx)/3000;return Math.abs(d)<3?[]:[d>0?'ArrowRight':'ArrowLeft'];});await page.waitForTimeout(120);};
 const climb=async(id,x,feet)=>{await move(id,x);await until(s=>Math.abs(s.heroes[id].y+44-feet)<2,s=>[feet<s.heroes[id].y+44?'ArrowUp':'ArrowDown']);await tap('ArrowRight');};
 await tap('ArrowRight');await page.locator('#restart').click();await page.waitForTimeout(100);
 const restarted=await state();if(restarted.heroes.some(h=>h.hp!==3)||restarted.machine.disabled)throw Error('Restart did not reset encounter');
 if((await state()).camera.zoom!==1)await page.locator('#zoom').click();
 await shot('initial-1x');await page.locator('#zoom').click();await shot('initial-2x');
 await climb(1,400,1120);await move(1,2180);await climb(1,2180,940);await climb(1,1940,760);await tap('ArrowUp');await shot('marksman-cover');
 await climb(0,650,760);await move(0,880);
 await move(2,920);await tap('d');
 const block=(await state()).machine.blockAt;await until(s=>s.machine.waves.some(w=>w.dir<0&&w.x>950&&w.x<1060),()=>[],30000);await variants('incoming-wave');
 await until(s=>s.machine.blockAt!==block,()=>[],3000);await variants('shield-block');
 await until(s=>s.machine.laser.phase==='track',()=>[],7000);await variants('laser-track');await until(s=>s.machine.laser.phase==='lock',()=>[],2000);await variants('laser-lock');await until(s=>s.machine.laser.phase==='fire',()=>[],2000);await variants('laser-fire-shield');
 await tap('2');for(const id of [3,1,2,0]){await tap(id===3||id===2?'2':'1');await until(s=>s.machine.activeLeg===id&&s.machine.cycle%6.5<.4,()=>[],30000);await variants('leg-'+id+'-warning');await until(s=>s.machine.activeLeg===id&&s.machine.cycle%6.5>=2.3,()=>[],5000);await variants('leg-'+id+'-raised');await until(s=>s.machine.activeLeg===id&&s.machine.cycle%6.5>=5.2,()=>[],5000);await variants('leg-'+id+'-impact');}
 await tap('2');await until(s=>s.machine.laser.phase==='fire',()=>[],7000);await variants('laser-ledge-cover');
 // Restart and demonstrate the actual brace exhaustion with a carried spine rider.
 await page.locator('#restart').click();await climb(0,650,760);await move(0,880);await move(2,870);
 await until(s=>s.machine.activeLeg===0&&s.machine.cycle%6.5>=5.3&&s.machine.cycle%6.5<5.5,()=>[],30000);await move(2,1410);await tap('d');await until(s=>s.machine.activeLeg===3&&s.machine.cycle%6.5>=2&&s.machine.cycle%6.5<4.5,()=>[],8000);await tap('Space');await move(2,1490);await until(s=>s.machine.kneel===1,()=>[],8000);
 await tap('1');await keys(['ArrowRight']);await page.keyboard.press('Space');await until(s=>s.heroes[0].support==='warden-spine',()=>['ArrowRight'],3000);await keys([]);
 await until(s=>s.machine.braceAge>12.9,s=>s.machine.laser.phase==='lock'&&s.machine.laser.age>.35?['Space']:[],15000);await variants('brace-strained-rider');
 await until(s=>!s.machine.braced,()=>[],2000);await variants('brace-exhausted');await move(2,1410);await tap('d');await until(s=>s.machine.kneel===0,()=>[],3000);await variants('unloaded-rider');
 fs.writeFileSync(out+'/evidence.json',JSON.stringify({evidence,errors},null,2));if(errors.length)throw Error(JSON.stringify(errors));console.log('Captured real-input boss danger matrix '+Object.keys(evidence).length+' views.');
}finally{fs.writeFileSync(out+'/browser-errors.json',JSON.stringify(errors));await browser.close();server?.close();}
