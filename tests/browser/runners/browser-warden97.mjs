import {createRequire} from 'node:module';import fs from 'node:fs';import http from 'node:http';import path from 'node:path';
if(process.argv.includes('--live'))process.env.WARDEN97_LIVE='1';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const root=path.resolve(process.env.WARDEN_BROWSER_ROOT||'output/release-warden97/dist'),out=process.env.WARDEN_BROWSER_OUT||'output/warden97',skin=process.env.WARDEN_BROWSER_SKIN||'imagegen88';fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.png':'image/png','.css':'text/css','.json':'application/json'};
const server=process.env.WARDEN97_LIVE?null:http.createServer((req,res)=>{const f=path.resolve(root,'.'+(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(f,(err,b)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});res.end(err?'Missing':b);});}).listen(3058,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.goto((process.env.WARDEN97_LIVE?'https://united-marsh-6ppd.here.now/':'http://127.0.0.1:3058/')+`?skin=${encodeURIComponent(skin)}&campaign=cycle&puzzle=warden&release=warden97`,{waitUntil:'domcontentloaded',timeout:120000});await page.evaluate(()=>localStorage.setItem('last-call-story-cards','off'));await page.locator('#start-picker [data-campaign-option="cycle"]').click();await page.locator('#start-picker .level-card[data-round="5"]').click();
 await page.waitForFunction(()=>{const a=JSON.parse(document.querySelector('#game').dataset.cycleArt||'{}');return a.ready&&a.sourceDensity?.startsWith('512native');},null,{timeout:120000});
 const state=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,won:c.dataset.won==='true',failed:c.dataset.failed==='true',art:JSON.parse(c.dataset.cycleArt),time:+c.dataset.simTime,camera:JSON.parse(c.dataset.camera),canvasRect:{x:c.getBoundingClientRect().x,y:c.getBoundingClientRect().y,width:c.getBoundingClientRect().width,height:c.getBoundingClientRect().height}}));
 const held=new Set(),evidence={};
 const keys=async names=>{for(const k of [...held])if(!names.includes(k)){await page.keyboard.up(k);held.delete(k);}for(const k of names)if(!held.has(k)){await page.keyboard.down(k);held.add(k);}};
 const tap=async k=>{await keys([]);await page.keyboard.press(k,{delay:60});await page.waitForTimeout(60);};
 const shot=async name=>{await page.screenshot({path:out+'/'+(process.env.WARDEN97_LIVE?'live-':'')+name+'.png'});evidence[name]=await state();evidence[name].optics=await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.wardenOptics||'null'));evidence[name].resources=await page.locator('.crew').evaluate(crew=>[...crew.querySelectorAll('.hero-card')].map(card=>{const meter=card.querySelector('.hero-resource');if(!meter)return null;const m=meter.getBoundingClientRect(),r=card.getBoundingClientRect(),bag=card.querySelector('.hud-bag').getBoundingClientRect();if(!meter.hidden&&(m.y<bag.bottom||m.bottom>r.bottom))throw Error('Timer overlaps inventory or exceeds picker');return{visible:!meter.hidden,kind:meter.dataset.kind,value:+meter.getAttribute('aria-valuenow'),selected:card.classList.contains('active'),text:meter.textContent};}));};
 const variants=async name=>{await keys([]);await page.keyboard.press('Escape');const t=(await state()).time,original=(await state()).camera.zoom;
  for(const [size,label] of [[{width:1440,height:900},'desktop'],[{width:844,height:390},'mobile'],[{width:430,height:780},'portrait']]){await page.setViewportSize(size);for(const zoom of [1,2]){if((await state()).camera.zoom!==zoom)await page.locator('#zoom').click();await page.waitForTimeout(200);await shot(name+'-'+label+'-'+zoom+'x');}}
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
 await move(2,870);await tap('ArrowRight');await until(s=>s.machine.activeLeg===0&&s.machine.cycle%6.5>=5.3&&s.machine.cycle%6.5<5.5,()=>[],30000);
 evidence['brace-departure']=await state();
 // Keep the approach continuous. Stopping at1410 can consume the entire
 // raised-foot window, then leave a back-facing shield waiting another cycle.
 // The controls remain ordinary movement and the overhead action; no state
 // flags, health or encounter timing are changed by this driver.
 await until(s=>Math.abs(s.heroes[2].x-1490)<5&&Math.abs(s.heroes[2].vx)<16,s=>{
  const h=s.heroes[2],d=1490-h.x-h.vx*Math.abs(h.vx)/3000;
  const input=Math.abs(d)<3?[]:[d>0?'ArrowRight':'ArrowLeft'];
  if(h.x>=1380&&!h.shieldUp)input.push('Space');
  return input;
 },10000);
 evidence['brace-arrival']=await state();
 await until(s=>s.machine.kneel===1,()=>[],8000);await variants('brace');
 if(process.env.WARDEN_REVIEW_SKINS==='1'){
  for(const option of ['current','imagegen90','procedural']){
   await page.locator('#help').click();await page.locator('#hero-skin').selectOption(option);await page.waitForTimeout(150);await page.locator('#close-help').click();await page.keyboard.press('Escape');await page.waitForTimeout(200);await shot('sweat-'+option+'-desktop-2x');await page.setViewportSize({width:844,height:390});await page.waitForTimeout(200);await shot('sweat-'+option+'-mobile-2x');await page.setViewportSize({width:1440,height:900});await page.keyboard.press('Escape');
  }
  await page.locator('#help').click();await page.locator('#hero-skin').selectOption(skin);await page.waitForTimeout(150);await page.locator('#close-help').click();
 }

 await tap('1');await keys(['ArrowRight']);await page.keyboard.press('Space');await until(s=>s.heroes[0].support==='warden-spine',()=>['ArrowRight'],3000);await shot('spine');
 await until(s=>s.machine.laser.phase==='cooldown'&&s.machine.laser.age<.12,s=>s.machine.laser.phase==='lock'&&s.machine.laser.age>.35?['Space']:[],7000);
 await move(0,1280);await page.locator('#zoom').click();await page.waitForTimeout(300);await variants('cap-before');await until(s=>s.machine.exposure>0,s=>['lock','fire'].includes(s.machine.laser.phase)?['Space']:['ArrowRight','d'],6500);await variants('cap-start');await page.waitForTimeout(100);await variants('cap-middle');await page.waitForTimeout(140);await variants('cap-full');await until(s=>s.machine.shutter===1,()=>[],1000);await climb(1,1940,700);await tap('ArrowLeft');await shot('lens-open');await tap('d');await until(s=>s.machine.disabled,()=>[],3000);await shot('shutdown-start');await page.waitForTimeout(650);await shot('shutdown-middle');await until(s=>s.machine.release===1,()=>[],2500);await shot('shutdown-complete');await until(s=>s.machine.shutdown===1&&s.machine.footY===940,()=>[],2000);await variants('shutdown-settled');await page.locator('#zoom').click();
 await variants('disabled-lens');await move(0,1700);await until(s=>s.heroes[0].ground&&Math.abs(s.heroes[0].y+44-940)<2,()=>[],6000);
 await tap('2');await until(s=>s.heroes[1].y+44>930,()=>['ArrowLeft'],6000);await until(s=>s.heroes[1].ground,()=>[],3000);await tap('3');await tap('Space');
 for(const id of [0,1,2]){await climb(id,1760,870);await move(id,1850+id*35);}await shot('boarded-2x');await page.locator('#zoom').click();await shot('boarded-1x');await page.locator('#zoom').click();
 await page.setViewportSize({width:844,height:390});await shot('boarded-mobile-2x');await page.locator('#zoom').click();await shot('boarded-mobile-1x');await page.setViewportSize({width:1440,height:900});await page.locator('#zoom').click();
 await tap('1');await tap('e');await until(s=>s.machine.cargo.distance>360,()=>[],8000);await shot('lift-middle');await until(s=>s.machine.cargo.distance===710,()=>[],8000);await shot('upper-dock');
 for(const id of [0,1,2])await move(id,2800);await until(s=>s.won,()=>[],2000);await shot('exit');const result=await state();
 await page.waitForFunction(()=>!document.querySelector('#win').hidden);await tap('Enter');await page.waitForFunction(()=>document.querySelector('#game').dataset.round==='6'&&document.querySelector('#game').dataset.won==='false');await shot('continued');
 fs.writeFileSync(out+'/'+(process.env.WARDEN97_LIVE?'live-':'')+'browser-route.json',JSON.stringify({won:result.won,hp:result.heroes.map(h=>h.hp),time:result.time,restart:true,continue:true,evidence,errors},null,2));
 if(!result.won||errors.length||result.heroes.some(h=>h.hp!==3))throw Error('Failed '+JSON.stringify({errors,result}));console.log(JSON.stringify({won:result.won,hp:result.heroes.map(h=>h.hp),time:result.time,errors}));
}catch(error){
 const failure=await page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),machine:JSON.parse(c.dataset.puzzle).machine,time:+c.dataset.simTime}));
 fs.writeFileSync(out+'/browser-failure.json',JSON.stringify({error:String(error),failure},null,2));throw error;
}finally{fs.writeFileSync(out+'/browser-errors.json',JSON.stringify(errors));await browser.close();server?.close();}
