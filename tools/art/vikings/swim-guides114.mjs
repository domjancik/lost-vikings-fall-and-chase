import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createDevServer} from '../../dev/server.mjs';
import {swimMotion} from '../../../src/heroes/swim-motion.js';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const dir='assets/water114';fs.mkdirSync(dir,{recursive:true});const server=await createDevServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
fs.writeFileSync(dir+'/swim-joints.json',JSON.stringify({nativeCell:[80,80],origin:[40,48],core:[40,58],armSegments:[10,10],legSegments:[9,9],nearDepth:'front of torso',farDepth:'behind torso',frames:Array.from({length:8},(_,i)=>swimMotion(i))},null,2));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port+'/');
 const data=await page.evaluate(async()=>{const {proceduralSwimFrame}=await import('/src/heroes/swim-procedural.js?v=water114');const c=document.createElement('canvas');c.width=320;c.height=160;const g=c.getContext('2d');for(let n=0;n<8;n++)g.drawImage(proceduralSwimFrame(n),n%4*80,Math.floor(n/4)*80);const big=document.createElement('canvas');big.width=2560;big.height=1280;const b=big.getContext('2d');b.imageSmoothingEnabled=false;b.drawImage(c,0,0,2560,1280);return{native:c.toDataURL(),enlarged:big.toDataURL()};});
 for(const [name,url]of Object.entries(data))fs.writeFileSync(dir+'/swim-guide-'+name+'.png',Buffer.from(url.split(',')[1],'base64'));
}finally{await browser.close();await new Promise(r=>server.close(r));}
