import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
fs.mkdirSync('assets/sewer145',{recursive:true});
try{const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port);const result=await page.evaluate(async()=>{
 const {drawLurkerWalk}=await import('/sewer-lurker-art.js'),image=new Image();image.src='/assets/sewer125/props-native.png';await image.decode();
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=384;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#182123';c.fillRect(0,0,1024,384);
 const checks=[];for(const [row,dir]of [[0,-1],[1,1]])for(let i=0;i<8;i++){const e={x:i*128+64,y:row*128+120,dir,travel:i*6};const pose=drawLurkerWalk(c,image,e);checks.push(pose);}
 c.drawImage(image,0,192,64,64,0,256,128,128);c.drawImage(image,64,192,64,64,128,256,128,128);
 const bounds=[];for(const dir of [-1,1])for(let phase=-48;phase<48;phase++){
  const tile=document.createElement('canvas');tile.width=64;tile.height=64;const g=tile.getContext('2d');g.imageSmoothingEnabled=false;g.scale(.5,.5);drawLurkerWalk(g,image,{x:64,y:120,dir,gaitTravel:phase});const data=g.getImageData(0,60,64,4).data;
  if(data.some((v,i)=>i%4===3&&v))throw Error('Foot extends below floor '+dir+':'+phase);bounds.push({dir,phase,belowFloor:0});
 }
 return {png:canvas.toDataURL(),checks,bounds};
 });assert.equal(result.checks.length,16);fs.writeFileSync('assets/sewer145/gait-matrix.png',Buffer.from(result.png.split(',')[1],'base64'));fs.writeFileSync('assets/sewer145/gait-check.json',JSON.stringify({poses:result.checks,bounds:result.bounds},null,2));console.log('16 production gait poses,192 grounded raster checks, both directions');
}finally{await browser.close();server.close();}
