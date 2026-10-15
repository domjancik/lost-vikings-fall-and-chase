import {reviewNavigate} from './review-skin.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),live=!!process.env.ORBIT_LIVE,out='assets/orbit119/'+(live?'live':'depth');
fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900},hasTouch:true,isMobile:true}),errors=[],records=[];
page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.addInitScript(()=>{
  localStorage.setItem('last-call-story-cards','off');window.nativeScenery={};const seen=new WeakSet();
  const draw=CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage=function(source,...args){
   if(source instanceof HTMLCanvasElement&&[24,32].includes(source.width)&&source.width===source.height&&!seen.has(source)){seen.add(source);const pixels=source.getContext('2d').getImageData(0,0,source.width,source.height).data;let valid=true,opaque=0;for(let n=0;n<pixels.length;n+=4)if(pixels[n+3]){opaque++;if(pixels[n+3]!==255||pixels[n]>32||pixels[n+1]>51||pixels[n+2]>68||pixels[n+2]<=pixels[n])valid=false;}if(valid&&opaque){
    const key=source.width+':'+source.toDataURL();if(!window.nativeScenery[key]&&Object.keys(window.nativeScenery).length<64)window.nativeScenery[key]={size:source.width,url:source.toDataURL()};
   }}return draw.call(this,source,...args);
  };
 });
 await reviewNavigate(page,(live?'https://united-marsh-6ppd.here.now/':'http://127.0.0.1:'+server.address().port+'/')+'?campaign=cycle&release=orbit119');
 await page.locator('#start-picker .level-card[data-round="8"]').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.cycleArt).ready);
 await page.keyboard.down('ArrowRight');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x>1000);await page.keyboard.up('ArrowRight');await page.keyboard.press('Escape');
 for(const location of ['first-field','upper-gallery']){
 if(location==='upper-gallery'){await page.keyboard.press('Escape');await page.keyboard.down('ArrowRight');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x>1770);await page.keyboard.up('ArrowRight');await page.waitForTimeout(150);await page.keyboard.down('ArrowUp');await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].y+44<=650);await page.keyboard.up('ArrowUp');await page.keyboard.press('Escape');}
 for(const [name,width,height,zoom]of [['wide-1x',1440,900,1],['wide-2x',1440,900,2],['portrait',430,780,2],['landscape',844,390,2]]){
  await page.setViewportSize({width,height});if(await page.locator('#game').evaluate(c=>JSON.parse(c.dataset.camera).zoom)!==zoom)await page.locator('#zoom').click();await page.waitForTimeout(250);
  const state=await page.locator('#game').evaluate(c=>({art:JSON.parse(c.dataset.cycleArt),camera:JSON.parse(c.dataset.camera),heroes:JSON.parse(c.dataset.heroes)}));
  assert.equal(state.art.distantScrap.length,8);assert.equal(state.art.farSilhouettes.length,12);assert.equal(state.art.contacts.filter(p=>p.kind==='floating-debris').length,2);
  records.push({location,name,...state});await page.screenshot({path:out+'/'+location+'-'+name+'.png'});
 }
 }
 const native=await page.evaluate(()=>Object.values(window.nativeScenery));assert.ok(native.length>=5,'actual native scenery cells captured');
 assert.ok(native.some(p=>p.size===24));assert.ok(native.some(p=>p.size===32));
 for(const [n,data]of native.entries())fs.writeFileSync(out+'/native-'+n+'.png',Buffer.from(data.url.split(',')[1],'base64'));
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/evidence.json',JSON.stringify({records,errors,nativeCells:native.length},null,2));console.log(JSON.stringify({captures:records.length,nativeCells:native.length,errors}));
}finally{await browser.close();server?.close();}
