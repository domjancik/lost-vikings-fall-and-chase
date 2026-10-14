import {createRequire} from 'node:module';import fs from 'node:fs';import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port+'/');
 const proof=await page.evaluate(async()=>{
  const {CART_ART:A,createCartPieces,cartWheelPlacement}=await import('/warden-cart-art.js?v=warden105');
  const image=new Image();image.src='/assets/warden105/cart-native.png';await image.decode();const parts=createCartPieces(image);
  const c=document.createElement('canvas');c.width=192;c.height=128;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(image,0,0);const source=g.getImageData(0,0,192,128).data;g.clearRect(0,0,192,128);g.drawImage(parts.body,0,0);
  for(const [name,{center:[x,y],radius}]of Object.entries(A.pieces))g.drawImage(parts[name],x-radius,y-radius);
  const rebuilt=g.getImageData(0,0,192,128).data;let mismatches=0;for(let n=0;n<source.length;n++)if(source[n]!==rebuilt[n])mismatches++;
  if(mismatches)throw Error('Native extraction lost/duplicated material pixels:'+mismatches);
  const [sx,sy,sw,sh]=A.sourceBounds;g.clearRect(0,0,192,128);g.drawImage(parts.body,0,0);const fullBody=g.getImageData(0,0,192,128).data;g.clearRect(0,0,192,128);g.drawImage(parts.body,sx,sy,sw,sh,sx,sy,sw,sh);const croppedBody=g.getImageData(0,0,192,128).data;
  let croppedMismatches=0;for(let n=0;n<fullBody.length;n++)if(fullBody[n]!==croppedBody[n])croppedMismatches++;if(croppedMismatches)throw Error('Body padding crop changed visible pixels');
  const contacts=[];for(const name of ['wheelNear','wheelFar']){
   const part=parts[name],r=A.pieces[name],t=part.getContext('2d'),pixels=t.getImageData(0,0,part.width,part.height).data;let bottom=0;
   for(let y=0;y<part.height;y++)for(let x=0;x<part.width;x++)if(pixels[(y*part.width+x)*4+3])bottom=Math.max(bottom,y+1);
   const pose=cartWheelPlacement({x:1740,y:870},name),visibleBottom=pose.y+(bottom-r.radius)*2;if(visibleBottom!==940)throw Error('Wrong actual material wheel sole '+name+':'+visibleBottom);contacts.push({name,bottom,visibleBottom});
  }
  return{mismatches,croppedMismatches,nativeSize:[image.naturalWidth,image.naturalHeight],contacts};
 });fs.mkdirSync('output/warden105',{recursive:true});fs.writeFileSync('output/warden105/art-pixels.json',JSON.stringify(proof,null,2));console.log(JSON.stringify(proof));
}finally{await browser.close();await new Promise(r=>server.close(r));}
