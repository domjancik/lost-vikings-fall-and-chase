import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const live=process.argv.includes('--live'),out=process.env.PUB144_OUT||'assets/pub144';fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{const page=await browser.newPage();await page.goto(live?'https://united-marsh-6ppd.here.now/?release=pub144':'http://127.0.0.1:'+server.address().port);
 const result=await page.evaluate(async()=>{
  const {ALEHALL_WINDOWS,alehallCoastPlacement,drawAlehallWindowScenery}=await import('/alehall-scenery144.js');
  const coast=new Image();coast.src='/assets/alehall135/coast-native.png';await coast.decode();const checks=[];
  for(const x of [0,500,1000,1600])for(const y of [-800,0,500,900]){
   const before=document.createElement('canvas');before.width=1200;before.height=600;const b=before.getContext('2d');b.imageSmoothingEnabled=false;b.setTransform(.5,0,0,.5,0,0);const far=alehallCoastPlacement({x,y});b.drawImage(coast,far.x,far.y,far.w,far.h);
   const after=document.createElement('canvas');after.width=1200;after.height=600;const a=after.getContext('2d');a.imageSmoothingEnabled=false;a.drawImage(before,0,0);a.setTransform(.5,0,0,.5,0,0);drawAlehallWindowScenery(a,coast,{x,y});
   const p=b.getImageData(0,0,1200,600).data,q=a.getImageData(0,0,1200,600).data;let changedOutside=0,missingBefore=0,missingAfter=0;
   for(let py=0;py<600;py++)for(let px=0;px<1200;px++){const i=(py*1200+px)*4,inside=ALEHALL_WINDOWS.some(w=>px*2>=w.x&&px*2<w.x+w.w&&py*2>=w.y&&py*2<w.y+w.h);if(inside){if(!p[i+3])missingBefore++;if(!q[i+3])missingAfter++;}else if(p[i]!==q[i]||p[i+1]!==q[i+1]||p[i+2]!==q[i+2]||p[i+3]!==q[i+3])changedOutside++;}
   checks.push({camera:{x,y},changedOutside,missingBefore,missingAfter});
  }return checks;
 });
 for(const c of result){assert.equal(c.changedOutside,0,'approved outside must be pixel-identical');assert.equal(c.missingAfter,0,'windows cannot reveal uncovered gray');}assert.ok(result.some(c=>c.missingBefore>0),'test must reproduce the old missing backdrop');fs.writeFileSync(out+'/pixel-check.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({cameras:result.length,outsideUnchanged:true,windowGaps:0}));
}finally{await browser.close();server?.close();}
