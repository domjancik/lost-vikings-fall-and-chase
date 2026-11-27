import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {campaignChoices} from '../../src/app/campaign-picker.js';
import {campaignOrder} from '../../src/campaigns/machines/cycle-order.js';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const out=path.resolve('output/overview-60'), archive='E:/Lost Vikings - Playable Archive/versions';
const shots=[
 ['01','prototype','arcade',0,0,0,'THE NEON STAG','Original prototype','Transcript recovery · line platforms'],
 ['02','baseline','arcade',0,0,0,'THE NEON STAG','First Git snapshot','c59d4eb · sprite terrain and parallax'],
 ['03','platform56','arcade',0,0,0,'THE NEON STAG','Revision 56','Archived build · sprite and platform revisions'],
 ['04','refraction62','cycle',1,0,100,'THE REFRACTION GATE','Revision 62','Archived build · optical machinery'],
 ['05','clockwork69','cycle',3,0,100,'INSIDE THE CLOCKWORK','Revision 69','Archived build · first clockwork tower'],
 ['06','current','fall',3,0,100,'INSIDE THE CLOCKWORK','Current build','Matched camera · same tower'],
 ['07','warden89','cycle',5,800,170,'THE FOURFOLD WARDEN','Revision 89','Archived build · first guardian'],
 ['08','current','fall',5,800,170,'THE FOURFOLD WARDEN','Current build','Matched camera · same guardian hall'],
 ['09','loom98','cycle',6,1020,410,'THE STORM LOOM','Revision 98','Archived build · first loom sequence'],
 ['10','current','cycle',6,1020,410,'THE STORM LOOM','Current build','Matched camera · same loom'],
 ['11','current','fall',11,0,190,'THE FAMILIAR HEARTH','Current build','A new opening · the Norse alehall'],
 ['12','current','fall',7,1050,80,'EMBER FREIGHT','Current build','The depot opens onto a night skyline'],
 ['13','current','fall',8,700,150,'SCRAP ORBIT','Current build','Magnetic machinery above the void'],

 ['21','current','fall',4,155,680,'THE DROWNED REGULATOR','Water refraction','Underwater traversal'],
 ['22','current','fall',5,800,170,'THE FOURFOLD WARDEN','Laser sweep','Telegraph and firing'],
 ['23','current','fall',10,1300,490,'THE LAST LAMPLIGHTER','Moving lantern','Walking with occluded lighting and haze'],
 ['24','current','fall',11,0,0,'THE FAMILIAR HEARTH','Current mobile HUD','Touch controls'],
 ['25','current','fall',11,180,435,'THE FAMILIAR HEARTH','Finished movement','In-engine movement'],
 ['26','current','fall',3,1450,530,'INSIDE THE CLOCKWORK','Drive the carriage','Split view'],
 ['27','current','fall',11,1438,430,'THE FAMILIAR HEARTH','The floor gives way','The crew follows the creation globe'],
 ['28','current','fall',10,0,300,'THE LAST LAMPLIGHTER','The chase begins','The globe lands, unfolds six legs and escapes'],
 ['29','current','fall',11,1680,500,'THE FAMILIAR HEARTH','Storeroom light review','Faint globe spill reaches the discarded cups'],
];
const tour=[];
for(const id of ['arcade','story','cycle','fall']){
 const campaign=campaignChoices.find(c=>c.id===id);
 for(const round of campaignOrder(id,campaign.levels.length)){
  const shot=[String(31+tour.length),'current',id,round,0,0,campaign.levels[round].name,campaign.name,'Level flythrough'];
  shots.push(shot);tour.push({id:shot[0],campaign:id,round,name:shot[6],group:campaign.name});
 }
}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.json':'application/json'};
const server=http.createServer(async(req,res)=>{try{
 const u=new URL(req.url,'http://localhost'),[,id,...segments]=decodeURIComponent(u.pathname).split('/'),shot=shots.find(s=>s[0]===id);if(!shot)throw Error();
 const version=shot[1],root=path.resolve(version==='current'?'dist':version==='prototype'||version==='baseline'?path.join(out,'..','timelapse',version):path.join(archive,version));
 const file=path.resolve(root,segments.join('/')||'index.html');if(!file.startsWith(root+path.sep))throw Error();let data=await readFile(file);
 if(file===path.join(root,'game.js')&&version!=='prototype'){
  const js=data.toString('utf8'),re=/const camera=snapPixel\(cameraX\),vertical=Math\.min\(snapPixel\(cameraY\),Math\.floor\(\(\(s\.level\.worldBottom\?\?790\)-sceneHeight\)\/WORLD_PIXEL\)\*WORLD_PIXEL\)/;
  if(!re.test(js))throw Error('Camera source changed');
  data=js.replace(re,`const camera=${id==='24'?'snapPixel(cameraX)':`(globalThis.__tourView?.x??${shot[4]})`},vertical=${id==='24'?'snapPixel(cameraY)':`(globalThis.__tourView?.y??${shot[5]})`}`);
  data=data.replace(/function draw\(\)\s*\{/,m=>m+'globalThis.__timelapseState=s;');
  data=data.replace("for(const key of ['cycleArt'","canvas.dataset.sceneReady=String(scene.ready);for(const key of ['cycleArt'");
 }
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);
 }catch(e){res.writeHead(404);res.end('Not found');}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const selected=process.argv.slice(2),results=[];
async function capture(shot){
 const [id,version,campaign,round,x,y,title,era,note]=shot;
 const page=await browser.newPage(id==='24'?{viewport:{width:430,height:780},hasTouch:true,isMobile:true}:{viewport:{width:1440,height:790}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});page.on('requestfailed',r=>errors.push(r.failure().errorText+' '+r.url()));
 try{
 await page.addInitScript(({campaign,round,zoom})=>{for(const [k,v]of Object.entries({'last-call-zoom':zoom,'last-call-sound':'off','last-call-story-cards':'off','last-call-round':round,'last-call-cycle52-round':round,'last-call-story46-round':round}))localStorage.setItem(k,String(v));},{campaign,round,zoom:['21','23','25','29'].includes(id)?2:['27','28'].includes(id)?1.5:1});
 await page.addInitScript(()=>{
 const raf=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window),real=performance.now.bind(performance);
 let manual=false, stamp=0, sequence=0;const queue=new Map();
 window.requestAnimationFrame=fn=>{const id=++sequence;const native=manual?null:raf(t=>{if(!manual&&queue.has(id)){queue.delete(id);stamp=t;fn(t);}});queue.set(id,{fn,native});return id;};
 window.cancelAnimationFrame=id=>{const task=queue.get(id);if(task?.native!=null)cancel(task.native);queue.delete(id);};
 window.__lockCapture=()=>{manual=true;for(const {native} of queue.values())if(native!=null)cancel(native);if(!stamp)stamp=real();Object.defineProperty(performance,'now',{value:()=>stamp,configurable:true});};
 window.__captureFrame=()=>{stamp+=1000/60;const list=[...queue.keys()];for(const id of list){const task=queue.get(id);if(task){queue.delete(id);task.fn(stamp);}}return document.querySelector('#game').toDataURL('image/png').split(',')[1];};
 });
 await page.goto(`http://127.0.0.1:${server.address().port}/${id}/?campaign=${campaign}${version==='current'?'&skin=imagegen90':''}`,{waitUntil:'load'});
 const pick=page.locator(`#start-picker .level-card[data-round="${round}"]`);
 if(await page.locator('#start-picker').count())await pick.first().click({timeout:10000});
 else {const selector=campaign==='arcade'?'#play':({1:'#play-refraction',3:'#play-clockwork',5:'#play-warden'}[round]);await page.locator(selector).click({timeout:10000});}
 if(version!=='prototype')await page.waitForFunction(round=>{const s=globalThis.__timelapseState,c=document.querySelector('#game');return s?.round===round&&s.time>.12&&(!c.dataset.transition||c.dataset.transition==='idle');},round,{timeout:12000});
 if(['07','08','22'].includes(id)){
  const parts=id==='07'?'warden89':'warden102';
  const paths=['assets/warden89/scene-native.png','assets/'+parts+'/parts-native.png',...(id==='07'?[]:['assets/warden97/emitter-native.png','assets/warden97/plunger-native.png','assets/warden105/cart-native.png'])];
  await page.evaluate(async paths=>{await Promise.all(paths.map(async path=>{const image=new Image();image.src=path;await image.decode();if(!image.naturalWidth)throw Error('Missing sprite: '+path);}));},paths);
  if(errors.length)throw Error('Warden assets failed to load: '+errors.join(', '));
 }
 await page.waitForTimeout(550);
 if(version==='current')await page.waitForFunction(()=>document.querySelector('#game').dataset.sceneReady==='true'&&JSON.parse(document.querySelector('#game').dataset.heroArt||'{}').ready,null,{timeout:20000});
 if(id==='27')await page.evaluate(()=>{
  const s=globalThis.__timelapseState,g=s.machine;
  Object.assign(g,{phase:'crack',crackTime:.5,bend:2});Object.assign(g.door,{open:true,pose:1});
  s.heroes.forEach((h,i)=>Object.assign(h,{x:[2048,2186,2114][i],y:716,prevY:716,ground:true,vx:0,vy:0,shieldUp:false}));
 });
 if(id==='29')await page.evaluate(()=>{const s=globalThis.__timelapseState;Object.assign(s.machine.door,{open:true,pose:1});Object.assign(s.heroes[0],{x:2048,y:716,ground:true});});
 if(id==='28')await page.evaluate(async()=>{
  const s=globalThis.__timelapseState;
  const {setupSewer}=await import('./sewer-campaign.js');setupSewer(s);s.time=0;
 });
 const tourShot=tour.find(shot=>shot.id===id);
 if(tourShot)await page.evaluate(()=>{
  const s=globalThis.__timelapseState;s.noHazards=true;
  const c=document.querySelector('#game'),view=JSON.parse(c.dataset.camera);
  const top=s.level.worldTop??0,bottom=s.level.worldBottom??790;
  const floors=[...(s.level.floors||[]),...(s.level.platforms||[])];
  const middle=floors.length?floors.reduce((sum,p)=>sum+p.y,0)/floors.length:610;
  globalThis.__tourBounds={width:Math.max(0,(s.level.worldWidth??1440)-view.width),y:Math.max(top,Math.min(bottom-view.height,middle-view.height*.64))};
 });
 if(id==='21'){
  await page.keyboard.down('ArrowRight');await page.waitForFunction(()=>globalThis.__timelapseState.heroes[0].x>460);await page.keyboard.up('ArrowRight');
  await page.keyboard.down('ArrowDown');await page.waitForFunction(()=>globalThis.__timelapseState.heroes[0].y>930);await page.keyboard.up('ArrowDown');
 }
 if(id==='22'||id==='23')await page.evaluate(id=>{const s=globalThis.__timelapseState,h=s.heroes[0]; const x=id==='22'?1300:1580,y=id==='22'?896:716;Object.assign(h,{x,y,prevX:x,prevY:y,ground:true});s.active=0;
 if(id==='23'){for(const other of s.heroes)other.inventory=other.inventory.map(item=>item==='inspectionLamp'?null:item);h.inventory[0]='inspectionLamp';s.machine.lamp.hookId=null;s.items=s.items.filter(i=>i.type!=='inspectionLamp');Object.assign(s.machine.lamp,{lit:true,focused:true,lens:true});s.machine.lurkers=[];}
 else{Object.assign(s.machine,{engaged:true,cycle:3.45,footY:760});s.machine.laser={phase:'track',age:.1,target:{x,y:y+22}};}
 },id);
 if(id==='26')await page.evaluate(()=>{const s=globalThis.__timelapseState,g=s.machine;Object.assign(g.wheel,{x:2612,y:840,mode:'docked',occupied:true,occupant:0});g.joined=true;g.half.mode='joined';g.drive=.24;g.carrier.x=1640+1060*g.drive/.75;g.carrier.y=920;for(const h of s.heroes.slice(1)){h.x=g.carrier.x+35+h.id*34;h.prevX=h.x;h.y=h.prevY=876;h.ground=true;h.support='clock-carriage';}});
 if(id==='25')await page.keyboard.down('ArrowLeft');
 if(id==='26')await page.keyboard.down('ArrowRight');
 await page.evaluate(()=>window.__lockCapture());
 const target=path.join(out,selected.includes('--preview')?'preview':'frames',id);await mkdir(target,{recursive:true});
 const state=await page.evaluate(()=>{const c=document.querySelector('#game'),s=globalThis.__timelapseState;return{camera:c.dataset.camera?JSON.parse(c.dataset.camera):{x:0,y:0,width:c.width,height:c.height},size:[c.width,c.height],level:s?.level?.name??null};});
 const frames=selected.includes('--preview')?1:tourShot?48:id==='27'?114:['23','28'].includes(id)?300:180;
 const encoder=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate','60','-c:v','png','-i','-','-c:v','libx264rgb','-preset','ultrafast','-crf','0','-threads','2',path.join(target,'capture.mkv')],{stdio:['pipe','ignore','inherit'],windowsHide:true});
 const done=once(encoder,'exit');
 if(id==='01'||id==='02'||id==='03')await page.keyboard.down('ArrowRight');
 for(let i=0;i<frames;i++){
  if(tourShot)await page.evaluate(({i,frames})=>{const b=globalThis.__tourBounds;globalThis.__tourView={x:Math.round((.08+.84*i/(frames-1))*b.width/2)*2,y:Math.round(b.y/2)*2};},{i,frames});
  if(id==='23'&&i===12)await page.keyboard.down('ArrowRight');
  if(id==='23'&&[62,162].includes(i)){await page.keyboard.up('ArrowRight');await page.keyboard.down('ArrowLeft');}
  if(id==='23'&&i===112){await page.keyboard.up('ArrowLeft');await page.keyboard.down('ArrowRight');}
  if(id==='23'&&i===212)await page.keyboard.up('ArrowLeft');
  if(i===32&&['01','02','03'].includes(id))await page.keyboard.up('ArrowRight');
  if(i===50&&['01','02','03'].includes(id))await page.keyboard.press('Space');
  if(id==='25'&&i===49)await page.keyboard.press('Space');if(id==='25'&&i===95)await page.keyboard.up('ArrowLeft');
  if(id==='21'&&i===34)await page.keyboard.down('ArrowRight');if(id==='21'&&i===110)await page.keyboard.up('ArrowRight');
  const frame=await page.evaluate(()=>window.__captureFrame());
  if(!encoder.stdin.write(Buffer.from(frame,'base64')))await once(encoder.stdin,'drain');
 }
 encoder.stdin.end();if((await done)[0]!==0)throw Error('Capture encoding failed');
 if(errors.length)throw Error('Capture contains loading or script errors: '+errors.join(', '));
 const finalHero=await page.evaluate(()=>{const h=globalThis.__timelapseState?.heroes[0];return h?{x:h.x,y:h.y,dead:h.dead}:null;});
 const result={id,version,title,era,note,requestedCamera:[x,y],...state,frames,errors,finalHero};
 results.push(result);await writeFile(path.join(target,'capture.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }catch(error){console.error(id,version,error.message,errors);process.exitCode=1;}
 finally{await page.close();}
}
try{await writeFile(path.join(out,'tour.json'),JSON.stringify(tour,null,2));const queue=shots.filter(s=>!['24'].includes(s[0])).filter(s=>selected.includes('--tour')?tour.some(t=>t.id===s[0]):!selected.some(x=>/^\d\d$/.test(x))||selected.includes(s[0]));for(let i=0;i<queue.length;i+=3)await Promise.all(queue.slice(i,i+3).map(capture));}finally{await browser.close();server.close();}




