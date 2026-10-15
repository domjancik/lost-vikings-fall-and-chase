import fs from 'node:fs';import {createRequire} from 'node:module';import {createDevServer} from '../../dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const out='assets/water115';fs.mkdirSync(out,{recursive:true});const server=await createDevServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port+'/');const data=await page.evaluate(async()=>{
 const {drawHeroArt,setHeroSkin,whenHeroesReady}=await import('/src/heroes/hero-art.js?v=water115');const canvas=document.createElement('canvas');canvas.width=720;canvas.height=160;const g=canvas.getContext('2d'),metrics=[];
 for(const [row,skin]of ['imagegen90','procedural'].entries()){setHeroSkin(skin);await whenHeroesReady();
  for(let n=0;n<9;n++){const c=document.createElement('canvas');c.width=c.height=80;const ctx=c.getContext('2d');ctx.scale(.5,.5);drawHeroArt(ctx,{id:0,skin,face:1},80,96,n?'swim':'idle',n?n-1:0);const p=c.getContext('2d').getImageData(0,0,80,80).data;let count=0;for(let i=3;i<p.length;i+=4)if(p[i]>128)count++;metrics.push({skin,pose:n?'swim':'idle',frame:n?n-1:0,opaqueArea:count});g.drawImage(c,n*80,row*80);}
 }
 const large=document.createElement('canvas');large.width=2160;large.height=480;const l=large.getContext('2d');l.fillStyle='#192c36';l.fillRect(0,0,large.width,large.height);l.imageSmoothingEnabled=false;l.drawImage(canvas,0,0,2160,480);return{native:canvas.toDataURL(),enlarged:large.toDataURL(),metrics};});
 for(const name of ['native','enlarged'])fs.writeFileSync(out+'/render-comparison-'+name+'.png',Buffer.from(data[name].split(',')[1],'base64'));fs.writeFileSync(out+'/render-metrics.json',JSON.stringify(data.metrics,null,2));
 for(const skin of ['imagegen90','procedural']){const own=data.metrics.filter(m=>m.skin===skin),standing=own.find(m=>m.pose==='idle').opaqueArea;for(const pose of own.filter(m=>m.pose==='swim'))if(pose.opaqueArea>standing*1.2||pose.opaqueArea<standing*.7)throw Error('Standing/swim mass mismatch '+JSON.stringify(pose));}
 console.log(JSON.stringify(data.metrics));
}finally{await browser.close();await new Promise(r=>server.close(r));}
