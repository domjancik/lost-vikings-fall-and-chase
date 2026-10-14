import {createRequire} from 'node:module';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const live=!!process.env.DEPTH94_LIVE,root=path.resolve('output/release-depth94/dist');
const mime={'.html':'text/html','.js':'text/javascript','.png':'image/png','.css':'text/css','.json':'application/json'};
// Local diagnostic changes only the camera target; production files remain untouched.
const server=live?null:http.createServer((req,res)=>{
 if(req.url.split('?')[0]==='/favicon.ico'){res.writeHead(204);res.end();return;}
 const file=path.resolve(root,'.'+(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(file,(err,bytes)=>{if(!err&&path.basename(file)==='src/app/game.js')bytes=Buffer.from(bytes.toString().replace('const target=cameraTarget(','const target=globalThis.__depthCamera??cameraTarget('));res.writeHead(err?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(err?'Missing':bytes);});
}).listen(3052,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],proofs=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text()+' '+m.location().url);});
fs.mkdirSync('output/playwright',{recursive:true});fs.mkdirSync('output/depth94',{recursive:true});
const names=['cycle','refraction','momentum','clockwork','water','warden'];
async function shot(label,diagnostic){
 const proof=await page.locator('#game').evaluate(c=>({camera:JSON.parse(c.dataset.camera),art:JSON.parse(c.dataset.cycleArt),heroes:JSON.parse(c.dataset.heroes),paused:c.dataset.paused}));
 if(!proof.art.ready||!proof.art.decor?.ready)throw Error('Art not ready '+label);
 const file='output/playwright/depth94-'+(live?'live-':'')+label+'.png';await page.screenshot({path:file});proofs.push({label,diagnostic,file,...proof});return proof;
}
try{
 await page.goto((live?'https://united-marsh-6ppd.here.now/':'http://127.0.0.1:3052/')+'?skin=imagegen90&release=depth94');
 await page.locator('#play-clockwork').click();
 for(let i=0;i<6;i++){
  await page.evaluate(()=>{delete globalThis.__depthCamera;});await page.setViewportSize({width:1440,height:900});
  await page.locator('#rounds').click();await page.locator('.round-option[data-round="'+i+'"]').click();
  await page.waitForFunction(()=>{const a=document.querySelector('#game').dataset.cycleArt;return a&&JSON.parse(a).decor?.ready;});
  await page.waitForTimeout(200);await page.locator('#pause').click();
  for(const size of [{width:1440,height:900},{width:390,height:844}]){
   await page.setViewportSize(size);
   for(const zoom of [1,2]){
    const current=await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom);if(current!==zoom)await page.locator('#zoom').click();
    await page.waitForTimeout(600);await shot(names[i]+'-normal-'+size.width+'-'+zoom+'x',false);
   }
  }
  if(live||process.env.DEPTH94_NORMAL_ONLY)continue;
  await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(100);
  const decor=await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.cycleArt).decor);
  for(const [j,p] of decor.props.entries()){
   await page.locator('#game').evaluate((c,p)=>{const cam=JSON.parse(c.dataset.camera);globalThis.__depthCamera={x:p.x-cam.width/2,y:p.floorY-cam.height*.72};},p);
   await page.waitForTimeout(650);await shot(names[i]+'-diagnostic-prop-'+j+'-2x',true);
  }
  for(const [j,w] of decor.walls.entries()){
   await page.locator('#game').evaluate((c,w)=>{const cam=JSON.parse(c.dataset.camera);globalThis.__depthCamera={x:w.x+w.w/2-cam.width/2,y:w.y-cam.height*.65};},w);
   await page.waitForTimeout(650);await shot(names[i]+'-diagnostic-wall-'+j+'-2x',true);
  }
 }
 if(errors.length)throw Error(errors.join('\n'));
 console.log(JSON.stringify({captures:proofs.length,errors,rooms:names}));
}finally{fs.writeFileSync('output/depth94/'+(live?'live-':process.env.DEPTH94_NORMAL_ONLY?'normal-':'')+'evidence.json',JSON.stringify({proofs,errors},null,2));await browser.close();server?.close();}
