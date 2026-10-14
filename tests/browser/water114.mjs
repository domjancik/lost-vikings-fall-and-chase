import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
import {playWaterControls} from '../routes/water-browser-controls.js';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const skin=process.env.WATER_SKIN||'imagegen90',out='assets/water114/evidence-'+skin;fs.mkdirSync(out,{recursive:true});
const server=await createDevServer({built:process.argv.includes('--dist')});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage(),extra={};
const snapshot=()=>page.locator('#game').evaluate(c=>({heroes:JSON.parse(c.dataset.heroes),animations:JSON.parse(c.dataset.animations),camera:JSON.parse(c.dataset.camera),active:+c.dataset.activeHero,worldResources:JSON.parse(c.dataset.worldResources||'[]'),time:+c.dataset.simTime}));
async function shot(name){await page.screenshot({path:out+'/'+name+'.png'});extra[name]=await snapshot();}
async function variants(name){
 await page.keyboard.press('Escape');const original=await snapshot();
 for(const [size,label]of [[{width:1440,height:900},'desktop'],[{width:844,height:390},'mobile'],[{width:430,height:780},'portrait']]){
  await page.setViewportSize(size);for(const zoom of [1,2]){if((await snapshot()).camera.zoom!==zoom)await page.locator('#zoom').click();await page.waitForTimeout(180);await shot(name+'-'+label+'-'+zoom+'x');}
 }
 await page.setViewportSize({width:1440,height:900});if((await snapshot()).camera.zoom!==original.camera.zoom)await page.locator('#zoom').click();await page.waitForTimeout(180);await page.keyboard.press('Escape');
}
try{
 await page.addInitScript(()=>localStorage.setItem('last-call-story-cards','off'));
 await page.goto('http://127.0.0.1:'+server.address().port+'/?campaign=cycle&skin='+skin);
 const result=await playWaterControls(page,{out,onShot:async name=>{
  if(name==='valve-before'){
   await variants('swimming');const phases=new Set();
   for(let n=0;n<40&&phases.size<8;n++){const s=await snapshot(),f=s.animations[0].frame;
    if(s.animations[0].pose==='swim'&&!phases.has(f)){await shot('stroke-'+f);phases.add(f);}await page.waitForTimeout(70);
   }
   if(phases.size!==8)throw Error('Incomplete actual swim cycle '+[...phases]);
   await page.keyboard.press('ArrowLeft',{delay:40});await variants('swimming-mirrored');
  }
  if(name==='valve-after')await variants('outside-pocket');
  if(name==='fixed-air')await variants('supported-pocket');
  if(name==='drained')await variants('inactive-air');
  if(name==='erik-basin-floor'){
   const s=await snapshot();if(!s.heroes[0].swimming||s.heroes[0].ground||s.heroes[0].y+44!==1000||s.animations[0].pose!=='swim')throw Error('Floor forced walking '+JSON.stringify(s));
   await variants('basin-floor');
  }
  if(name==='right-dock-before-exit')await variants('dry-ladder-exit');
 }});
 if(!result.won||result.hp.some(h=>h!==3)||result.errors.length)throw Error('Unhealthy water route '+JSON.stringify(result));
 fs.writeFileSync(out+'/route.json',JSON.stringify({...result,extra},null,2));console.log(JSON.stringify({skin,won:result.won,hp:result.hp,time:result.time,errors:result.errors}));
}catch(error){await page.screenshot({path:out+'/failure.png'});fs.writeFileSync(out+'/failure.json',JSON.stringify({error:String(error),state:await snapshot()},null,2));throw error;}
finally{await browser.close();await new Promise(r=>server.close(r));}
