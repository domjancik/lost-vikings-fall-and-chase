import {createRequire} from 'node:module';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const root=path.resolve('output/release-clockwork93/dist');
const mime={'.html':'text/html','.js':'text/javascript','.png':'image/png','.css':'text/css','.json':'application/json'};
const server=process.env.CLOCKWORK93_LIVE?null:http.createServer((req,res)=>{
 const urlPath=req.url.split('?')[0];
 const file=path.resolve(root,'.'+(urlPath==='/'?'/index.html':urlPath));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(file,(err,bytes)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(err?'Missing':bytes);});
}).listen(3050,'127.0.0.1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage();
try{
 await page.goto((process.env.CLOCKWORK93_LIVE?'https://united-marsh-6ppd.here.now/':'http://127.0.0.1:3050/')+'?skin=imagegen90&release=92');
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes||'[]').length===3);
 const active=await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.heroes));
 if(active.some(h=>h.skin!=='imagegen90')||!active[2].shieldArtPose)throw Error('Imagegen90 physical binding absent');
 let routeSource=fs.readFileSync('browser-clockwork71.js','utf8').replaceAll('http://127.0.0.1:3018/?campaign=cycle&puzzle=clockwork',(process.env.CLOCKWORK93_LIVE?'https://united-marsh-6ppd.here.now/':'http://127.0.0.1:3050/')+'?campaign=cycle&skin=imagegen90&release=93');
 // Keep only the inset phases; the original route still uses ordinary controls.
 const first=routeSource.indexOf('await page.exposeBinding(binding,');
 const last=routeSource.indexOf(' const result=await page.evaluate',first);
 const photoBinding=`await page.exposeBinding(binding,async(_,name)=>{
  if(!['docked','split-drive','release-inset'].includes(name))return;
  await page.locator('#pause').click();
  for(const size of [{width:390,height:844},{width:844,height:390},{width:1440,height:900}]){
   await page.setViewportSize(size);
   for(let n=0;n<2;n++){
    await page.waitForTimeout(300);
    const proof=await page.locator('#game').evaluate(c=>{
     const v=JSON.parse(c.dataset.clockView),r=c.getBoundingClientRect(),cam=JSON.parse(c.dataset.camera),scale=r.height/cam.height;
     if(!v.split)throw Error('Missing inset');
     const b={x:r.x+(v.inset.x-2)*scale,y:r.y+(v.inset.y-2)*scale,w:(v.inset.w+4)*scale,h:(v.inset.h+4)*scale};
     const overlap=[...document.querySelectorAll('.hero-card,.action-pad button')].some(e=>{const q=e.getBoundingClientRect();return b.x<q.right&&b.x+b.w>q.left&&b.y<q.bottom&&b.y+b.h>q.top;});
     if(overlap)throw Error('Inset overlaps selection/actions');
     if(matchMedia('(max-width:960px), (pointer:coarse)').matches&&v.inset.x!==6)throw Error('Mobile inset not left');
     return{view:v,screen:b,camera:cam};
    });
    proofs.push({name,size,...proof});
    await page.screenshot({path:'output/playwright/clockwork93-'+name+'-'+size.width+'-'+proof.camera.zoom+'x.png'});
    await page.locator('#zoom').click();
   }
  }
  await page.locator('#pause').click();
 });
`;
 routeSource=routeSource.slice(0,first)+photoBinding+routeSource.slice(last);
 const proofs=[];const route=eval('('+routeSource+')');
 const routeResult=await route(page);const result={...routeResult.result,hp:routeResult.result.heroes.map(h=>h.hp),errors:routeResult.errors,continued:routeResult.continued};
 fs.mkdirSync('output/clockwork93',{recursive:true});
 fs.writeFileSync('output/clockwork93/'+(process.env.CLOCKWORK93_LIVE?'live-':'')+'inset-route.json',JSON.stringify({active,result,proofs},null,2));
 if(!result.won||result.errors.length)throw Error('Route failed '+JSON.stringify(result));
 console.log(JSON.stringify({won:result.won,hp:result.hp,time:result.time,errors:result.errors}));
}finally{await browser.close();server?.close();}
