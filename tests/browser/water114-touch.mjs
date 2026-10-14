import fs from 'node:fs';import {createRequire} from 'node:module';import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const skin=process.env.WATER_SKIN||'imagegen90',live=process.env.WATER_LIVE==='1',out='assets/water114/'+(live?'live-touch-evidence':skin==='imagegen90'?'touch-evidence':'touch-evidence-'+skin);fs.mkdirSync(out,{recursive:true});const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:2}),errors=[],evidence={};page.on('pageerror',e=>errors.push(String(e)));
const read=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),animations:JSON.parse(c.dataset.animations),resources:JSON.parse(c.dataset.worldResources),camera:JSON.parse(c.dataset.camera),time:+c.dataset.simTime,failed:c.dataset.failed==='true',coarse:matchMedia('(pointer:coarse)').matches}));
const cdp=await page.context().newCDPSession(page);
async function hold(key,condition,limit=6000){const b=await page.locator('[data-key="'+key+'"]').boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2,id:1}]});
 try{await page.waitForFunction(condition,{},{timeout:limit});}finally{await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}}
async function variants(name){await page.locator('#pause').tap();for(const zoom of [1,2]){if((await read()).camera.zoom!==zoom)await page.locator('#zoom').tap();await page.waitForTimeout(250);await page.screenshot({path:out+'/'+name+'-'+zoom+'x.png'});evidence[name+'-'+zoom+'x']=await read();}await page.locator('#pause').tap();}
try{
 await page.addInitScript(()=>localStorage.setItem('last-call-story-cards','off'));await page.goto((live?'https://united-marsh-6ppd.here.now/':'http://127.0.0.1:'+server.address().port+'/')+'?campaign=cycle&skin='+skin+'&release=water114');await page.locator('#start-picker .level-card[data-round="4"]').tap();await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroArt).ready);await variants('three-crew-meters');
 await hold('right',()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].x>520);
 await hold('down',()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].y>720);await page.waitForTimeout(150);await variants('swimming');
 const phases=new Set();for(let n=0;n<40&&phases.size<8;n++){
  await page.locator('#pause').tap();const s=await read(),f=s.animations[0].frame;if(s.animations[0].pose!=='swim')throw Error('Lost swim pose');
  if(!phases.has(f)){await page.screenshot({path:out+'/stroke-'+f+'.png'});evidence['stroke-'+f]=await read();phases.add(f);}
  await page.locator('#pause').tap();await page.waitForTimeout(70);
 }if(phases.size!==8)throw Error('Incomplete actual stroke cycle '+[...phases]);
 await hold('left',()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].face===-1);await variants('mirrored');
 await hold('down',()=>JSON.parse(document.querySelector('#game').dataset.heroes)[0].y+44===1000);await variants('basin-floor');const s=await read();if(!s.coarse||s.failed||s.heroes[0].ground||!s.heroes[0].swimming||s.animations[0].pose!=='swim'||s.heroes[0].hp!==3)throw Error('Touch swimmer failed '+JSON.stringify(s));
 await page.locator('#pause').tap();const fallbacks=[];
 for(const option of ['current','imagegen88','native85','imagegen81','reworked70','previous']){
  await page.locator('#help').tap();await page.locator('#hero-skin').selectOption(option);await page.waitForFunction(()=>JSON.parse(document.querySelector('#game').dataset.heroArt).ready);await page.locator('#close-help').tap();await page.locator('#pause').tap();
  const f=await read();if(f.animations[0].pose!=='fall'||!f.heroes[0].swimming||f.heroes[0].ground)throw Error('Broken falling fallback '+option);fallbacks.push({skin:option,pose:f.animations[0].pose});
 }
 if(errors.length)throw Error(errors.join(';'));fs.writeFileSync(out+'/evidence.json',JSON.stringify({errors,evidence,fallbacks},null,2));console.log('True coarse touch swimming, mirror, floor, three-crew meters and6 skin fallbacks pass');
}finally{await browser.close();await new Promise(r=>server.close(r));}
