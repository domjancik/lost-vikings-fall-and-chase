import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const live=process.argv.includes('--live'),out=process.env.SEWER149_OUT||'assets/sewer149/diagnostic';fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();await page.goto((live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?skin=imagegen90&release=sewer149');
 const result=await page.evaluate(async()=>{
  const {createState,step}=await import('/engine.js'),{drawSewerWorld,drawSewerDarkness}=await import('/sewer-render.js'),{setHeroSkin,whenHeroesReady}=await import('/hero-art.js'),{drawSprite}=await import('/sprite-render.js');setHeroSkin('imagegen90');await whenHeroesReady();
  const shots=[],checks=[];
  const make=()=>{const s=createState(10,'cycle');s.time=10;s.machine.introTime=10;s.machine.lamp.lit=false;for(const l of s.machine.lamps)l.lit=false;for(const h of s.heroes)Object.assign(h,{x:1000,y:716,ground:true,skin:'imagegen90'});return s;};
  async function photo(s,name){
   const inspection=s.machine.lamps.filter(l=>l.id.startsWith('diagnostic-'));for(const l of inspection)l.lit=true;
   const native=document.createElement('canvas');native.width=360;native.height=180;const c=native.getContext('2d'),camera={x:1760,y:440},view={width:720,height:360};
   c.setTransform(.5,0,0,.5,-camera.x/2,-camera.y/2);c.imageSmoothingEnabled=false;
   let art=drawSewerWorld(c,s,camera,view),start=performance.now();while(!art.ready){if(performance.now()-start>10000)throw Error('Missing art');await new Promise(r=>setTimeout(r,20));art=drawSewerWorld(c,s,camera,view);}
   for(const h of s.heroes)drawSprite(c,h,h.x,h.y);drawSewerDarkness(c,s,camera,view);
   for(const scale of [2,4]){const image=document.createElement('canvas');image.width=360*scale;image.height=180*scale+32;const g=image.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#162025';g.fillRect(0,0,image.width,image.height);g.drawImage(native,0,32,360*scale,180*scale);g.fillStyle='#eee';g.font='14px monospace';g.fillText('SEEDED PRODUCTION DIAGNOSTIC '+name+' '+scale/2+'x / imagegen90',8,21);shots.push({name:name+'-'+scale/2+'x',png:image.toDataURL()});}
   checks.push({name,seeded:true,heroes:s.heroes.map(h=>({id:h.id,hp:h.hp,skin:h.skin})),enemy:JSON.parse(JSON.stringify(s.machine.lurkers[0])),art:art.contacts.find(a=>a.kind==='lurker')});
   for(const l of inspection)l.lit=false;
  }
  for(const shield of [false,true]){
   const s=make(),e=s.machine.lurkers[0],h=s.heroes[shield?2:0];s.machine.hatch.open=true;s.machine.hatch.pose=1;Object.assign(e,{x:2150,dir:-1});Object.assign(h,{x:2050,face:1});
   // Local inspection lighting exposes a bite that has already committed.
   // This is explicit seeded art evidence, separate from the normal-input route.
   s.machine.lamps.push({id:'diagnostic',x:2190,y:700,lit:true,oil:1,fill:1});
   e.phase='warning';e.warning=.1;
   for(let n=0;n<48;n++)step(s,{},1/120);await photo(s,shield?'shield-brace':'bite-warning');
   for(let n=0;n<34;n++)step(s,{},1/120);await photo(s,shield?'shield-block':'bite-active');
  }
  const s=make(),e=s.machine.lurkers[0];s.noHazards=true;Object.assign(e,{x:2090,dir:-1});
  s.machine.lamps.push({id:'diagnostic-right',x:2190,y:650,lit:false,oil:1,fill:1},{id:'diagnostic-left',x:1910,y:600,lit:false,oil:1,fill:1},{id:'diagnostic-low',x:1910,y:724,lit:false,oil:1,fill:1});
  let elapsed=0;for(const [t,name]of [[.6,'wall-turn'],[1.4,'wall-ascent'],[3.3,'upper-corner'],[4.1,'shutter-top'],[5.7,'wall-descent'],[8.9,'floor-return']]){while(elapsed<t){step(s,{},1/120);elapsed+=1/120;}await photo(s,name);}
  Object.assign(e,{x:2060,y:680,hp:1,rotation:Math.PI/2,crawl:{wallX:2020,top:600,dir:-1,stage:1}});
  s.shots=[{kind:'arrow',x:2120,y:680,vx:-580,life:2}];for(let n=0;n<24;n++)step(s,{},1/120);await photo(s,'wall-death');
  for(let n=0;n<120;n++)step(s,{},1/120);await photo(s,'corpse-grounded');
  return{shots,checks,skin:'imagegen90',sheets:['assets/vikings90/erik-native.png','assets/vikings90/baleog-native.png','assets/olaf111/olaf-native.png']};
 });
 assert.equal(result.checks.find(c=>c.name==='bite-active').heroes[0].hp,2);assert.equal(result.checks.find(c=>c.name==='shield-block').heroes[2].hp,3);
 assert.ok(result.checks.some(c=>c.enemy.phase==='climb'));
 assert.equal(result.checks.find(c=>c.name==='floor-return').enemy.crawl,null);
 assert.equal(result.checks.find(c=>c.name==='wall-descent').enemy.crawl.stage,5);
 for(const shot of result.shots)fs.writeFileSync(out+'/'+shot.name+'.png',Buffer.from(shot.png.split(',')[1],'base64'));
 fs.writeFileSync(out+'/check.json',JSON.stringify({...result,shots:result.shots.map(s=>s.name)},null,2));console.log(JSON.stringify({checks:result.checks.length,shots:result.shots.length,biteHp:2,shieldHp:3}));
}finally{await browser.close();server?.close();}
