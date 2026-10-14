import fs from 'node:fs';import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port+'/');
 const sounds=await page.evaluate(async()=>{
  const {renderEffect}=await import('/sound-effects.js');const result=[];
  for(const name of ['wardenCharge','wardenLaser','wardenDrop','wardenStomp']){
   const rate=44100,ctx=new OfflineAudioContext(2,rate*2.2,rate),gain=ctx.createGain(),compressor=ctx.createDynamicsCompressor();
   gain.gain.value=.65;compressor.threshold.value=-20;compressor.ratio.value=5;compressor.attack.value=.003;gain.connect(compressor);compressor.connect(ctx.destination);
   renderEffect(ctx,gain,name);const buffer=await ctx.startRendering(),left=buffer.getChannelData(0),right=buffer.getChannelData(1),bytes=new Uint8Array(left.length*4),view=new DataView(bytes.buffer);let peak=0,energy=0;
   for(let i=0;i<left.length;i++){peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));energy+=left[i]*left[i];view.setInt16(i*4,Math.max(-32767,Math.min(32767,Math.round(left[i]*32767))),true);view.setInt16(i*4+2,Math.max(-32767,Math.min(32767,Math.round(right[i]*32767))),true);}
   let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));
   result.push({name,rate,peak,rms:Math.sqrt(energy/left.length),pcm:btoa(binary)});
  }return result;
 });
 const receipt=[];
 for(const {pcm,...s}of sounds){
  const data=Buffer.from(pcm,'base64'),header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(data.length+36,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(2,22);header.writeUInt32LE(s.rate,24);header.writeUInt32LE(s.rate*4,28);header.writeUInt16LE(4,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(data.length,40);
  fs.writeFileSync('output/warden102/'+s.name+'.wav',Buffer.concat([header,data]));if(s.peak>=1||s.rms<.002)throw Error('Clipped/silent sound '+s.name);receipt.push(s);
 }
 fs.writeFileSync('output/warden102/audio.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
}finally{await browser.close();await new Promise(r=>server.close(r));}
