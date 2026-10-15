import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),out='assets/orbit121';
const data=file=>'data:image/png;base64,'+fs.readFileSync(file).toString('base64');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage({viewport:{width:1660,height:1400},deviceScaleFactor:1});
 await page.setContent(`<style>body{background:#111d29;color:#d1d7d6;font:16px monospace;margin:24px}h1{font-size:24px}h2{font-size:19px;color:#dfbb78}.grid{display:grid;grid-template-columns:repeat(3,520px);gap:16px}section{background:#172634;padding:6px}canvas,img{image-rendering:pixelated}p{min-height:40px;margin:8px}</style><h1>Scrap Orbit121 · richness and native-grid comparison</h1><p>Same apparent gameplay size in each row. Preferred raw source is a design reference; shipped and replacement are native rasters.<br>World pixel = 2 display pixels here. Gameplay evidence separately verifies all three imagegen90 Vikings.</p><div class="grid" id="grid"></div>`);
 const rows=[
  {title:'Magnetic carrier',width:384,height:192,files:['assets/orbit120/plate-raw-v1.png','assets/orbit120/plate-native.png',out+'/plate-native.png'],cropFirst:true},
  {title:'Majestic gear',width:512,height:512,files:['assets/orbit113/gear-raw-v1.png','assets/orbit113/gear-native.png',out+'/gear-native.png']},
  {title:'Spring switch, fully exposed',width:128,height:128,files:[out+'/hardware-raw-v2.png','assets/orbit120/retry/native/switch-12-0.png',out+'/route/native/switch-12-0.png'],rawKit:true}
 ];
 for(const row of rows)for(let col=0;col<3;col++){
  const file=row.files[col];assert.ok(fs.existsSync(file),file);
  await page.evaluate(async({row,col,url})=>{const section=document.createElement('section'),heading=document.createElement('h2');heading.textContent=row.title+' · '+[row.rawKit?'Authored source':'Preferred earlier design','Shipped 120','Replacement 121'][col];section.append(heading);const canvas=document.createElement('canvas');canvas.width=row.width;canvas.height=row.height;section.append(canvas);const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const image=new Image();image.src=url;await image.decode();
   if(row.cropFirst&&col===0){const scratch=document.createElement('canvas');scratch.width=image.width;scratch.height=image.height;const s=scratch.getContext('2d');s.drawImage(image,0,0);const p=s.getImageData(0,0,image.width,image.height).data;let l=image.width,t=image.height,r=0,b=0;for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)if(p[(y*image.width+x)*4+3]>=220){l=Math.min(l,x);r=Math.max(r,x+1);t=Math.min(t,y);b=Math.max(b,y+1);}c.drawImage(image,l,t,r-l,b-t,20,72,344,(b-t)*344/(r-l));}
   else if(row.rawKit&&col===0){const w=image.width/4,h=image.height/2;c.drawImage(image,0,0,w,h,0,0,128,128);c.save();c.beginPath();c.rect(24,30,80,68);c.clip();c.drawImage(image,w,0,w,h,0,-4,128,128);c.restore();}else c.drawImage(image,0,0,row.width,row.height);
   document.querySelector('#grid').append(section);
  },{row,col,url:data(file)});
 }
 await page.screenshot({path:out+'/comparison.png',fullPage:true});
 // Native state proof comes from actual gameplay-created rasters, not a second renderer.
 const states=['switch-0-0.png','switch-6-0.png','switch-12-0.png','switch-6-3.png','switch-12-6.png'];
 await page.setContent('<body style="background:#152430;color:#d4d4c4;font:18px monospace"><h1>Authored housing, moving shutters, recessed impact and return spring</h1><div id="states" style="display:flex;gap:22px"></div></body>');
 for(const file of states){assert.ok(fs.existsSync(out+'/route/native/'+file),file);await page.evaluate(({file,url})=>{const box=document.createElement('div');box.textContent=file;const image=document.createElement('img');image.src=url;image.width=image.height=256;image.style='display:block;image-rendering:pixelated';box.append(image);document.querySelector('#states').append(box);},{file,url:data(out+'/route/native/'+file)});}
 await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));
 await page.screenshot({path:out+'/switch-states.png',fullPage:true});
 console.log(JSON.stringify({comparison:out+'/comparison.png',states:out+'/switch-states.png'}));
}finally{await browser.close();}
