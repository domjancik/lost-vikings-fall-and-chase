import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),baseline=process.argv.includes('--baseline');
const out='output/water142';fs.mkdirSync(out,{recursive:true});
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port);
 const result=await page.evaluate(async()=>{
  const {drawWaterPlants,waterDecorReady}=await import('/water-effects92.js');
  while(!waterDecorReady())await new Promise(r=>setTimeout(r,20));
  const sheet=document.createElement('canvas');sheet.width=288;sheet.height=112;const g=sheet.getContext('2d');g.imageSmoothingEnabled=false;
  const counts=[],roots=[];
  for(let phase=0;phase<12;phase++){
   const c=document.createElement('canvas');c.width=40;c.height=48;const ctx=c.getContext('2d');ctx.setTransform(.5,0,0,.5,-168,-454);
   drawWaterPlants(ctx,{time:4+(phase+.1-376*.015)/3,machine:{waterY:550}});
   const data=ctx.getImageData(0,0,40,48).data;let count=0;for(let n=3;n<data.length;n+=4)if(data[n])count++;
   counts.push(count);roots.push([...ctx.getImageData(0,46,40,2).data]);g.drawImage(c,phase%6*48,Math.floor(phase/6)*56);
  }
  const display=document.createElement('canvas');display.width=864;display.height=336;const d=display.getContext('2d');d.imageSmoothingEnabled=false;d.drawImage(sheet,0,0,864,336);
  const drySheet=document.createElement('canvas');drySheet.width=288;drySheet.height=56;const dryContext=drySheet.getContext('2d'),dryCounts=[];
  for(const [index,waterY]of [550,850,874,899,901,950].entries()){
   const tile=document.createElement('canvas');tile.width=40;tile.height=48;const ctx=tile.getContext('2d');ctx.setTransform(.5,0,0,.5,-550,-404);
   drawWaterPlants(ctx,{time:9,machine:{waterY}});const pixels=ctx.getImageData(0,0,40,48).data;let count=0;for(let n=3;n<pixels.length;n+=4)if(pixels[n])count++;
   dryCounts.push({waterY,count});dryContext.drawImage(tile,index*48,0);
  }
  return{counts,rootsStable:roots.every(r=>r.every((v,i)=>v===roots[0][i])),dryCounts,png:display.toDataURL(),dryPng:drySheet.toDataURL()};
 });
 fs.writeFileSync(out+'/'+(baseline?'before':'after')+'.png',Buffer.from(result.png.split(',')[1],'base64'));delete result.png;
 fs.writeFileSync(out+'/'+(baseline?'before':'after')+'-dry.png',Buffer.from(result.dryPng.split(',')[1],'base64'));delete result.dryPng;
 fs.writeFileSync(out+'/'+(baseline?'before':'after')+'.json',JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result));
 if(!baseline){assert.equal(new Set(result.counts).size,1,'no leaves appear/disappear during sway');assert.ok(result.rootsStable,'roots stay attached');assert.equal(new Set(result.dryCounts.map(p=>p.count)).size,1,'receding water cannot change leaf identity');}
}finally{await browser.close();server.close();}
