import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port);
 const result=await page.evaluate(async()=>{
  const {drawSewerWheel,sewerWheelMount}=await import('/sewer-wheel141.js');
  const canvas=document.createElement('canvas');canvas.width=896;canvas.height=160;
  const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#101618';c.fillRect(0,0,896,160);
  const receipts=[];
  for(const [row,kind,pivot]of [[0,'valve',[32,34]],[1,'winch',[22,30]]]){
   const tile=document.createElement('canvas');tile.width=112;tile.height=80;const g=tile.getContext('2d'),m=sewerWheelMount(kind);
   g.imageSmoothingEnabled=false;g.setTransform(.5,0,0,.5,40-m.axis[0]/2,40-m.axis[1]/2);
   const start=performance.now();while(!drawSewerWheel(g,kind,0).ready){if(performance.now()-start>5000)throw Error('Missing wheel assets');await new Promise(r=>setTimeout(r,20));}
   const expected=[...g.getImageData(35,35,11,11).data];
   for(let degrees=0;degrees<360;degrees+=5){
    g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,112,80);g.restore();drawSewerWheel(g,kind,degrees/270);
    const hub=[...g.getImageData(35,35,11,11).data];
    // Compare the complete interior of the fixed six-native-pixel shaft cap.
    for(let y=0;y<11;y++)for(let x=0;x<11;x++)if((x-5)**2+(y-5)**2<=25){const i=(y*11+x)*4;if(hub.slice(i,i+4).some((v,k)=>v!==expected[i+k]))throw Error(kind+' axle material drift at'+degrees);}
    if(degrees%45===0)c.drawImage(tile,degrees/45*112,row*80);
   }
   receipts.push({kind,pivot,angles:72,stationaryAxleRadius:5,renderer:'production drawSewerWheel'});
  }
  const display=document.createElement('canvas');display.width=1792;display.height=320;const d=display.getContext('2d');d.imageSmoothingEnabled=false;d.drawImage(canvas,0,0,1792,320);
  return{receipts,png:display.toDataURL()};
 });
 assert.equal(result.receipts.length,2);for(const r of result.receipts)assert.equal(r.angles,72);
 fs.writeFileSync('assets/sewer141/rotation-matrix.png',Buffer.from(result.png.split(',')[1],'base64'));
 fs.writeFileSync('assets/sewer141/rotation-check.json',JSON.stringify(result.receipts,null,2)+'\n');
 console.log(JSON.stringify(result.receipts));
}finally{await browser.close();server.close();}
