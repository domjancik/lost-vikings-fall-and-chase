import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright'),live=process.argv.includes('--live'),out=process.env.SEWER_CONTACT_OUT||'assets/sewer145/contact';const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
fs.mkdirSync(out,{recursive:true});
try{const page=await browser.newPage();await page.goto((live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?skin=imagegen90&release=sewer145');const result=await page.evaluate(async()=>{
 const {createState,step}=await import('/engine.js'),{drawSewerWorld,drawSewerDarkness}=await import('/sewer-render.js'),{setHeroSkin,whenHeroesReady}=await import('/hero-art.js'),{drawSprite}=await import('/sprite-render.js');setHeroSkin('imagegen90');await whenHeroesReady();
 const shots=[],checks=[];
 for(const mode of ['contact','shield']){
  const s=createState(10,'cycle');s.time=10;s.machine.introTime=10;s.machine.hatch.open=true;s.machine.hatch.pose=1;s.machine.lamp.hookId='inspection';s.machine.lamp.focused=true;const e=s.machine.lurkers[0];Object.assign(e,{x:1930,y:760,dir:1});const h=s.heroes[mode==='shield'?2:0];Object.assign(h,{x:mode==='shield'?1900:1932,y:716,ground:true,face:1,skin:'imagegen90'});for(const other of s.heroes)other.skin='imagegen90';
  const camera={x:1640,y:480},view={width:640,height:320};
  const native=document.createElement('canvas');native.width=320;native.height=160;const c=native.getContext('2d');c.imageSmoothingEnabled=false;
  async function photo(name){
   c.setTransform(.5,0,0,.5,-camera.x/2,-camera.y/2);let art=drawSewerWorld(c,s,camera,view);const start=performance.now();while(!art.ready){if(performance.now()-start>5000)throw Error('Missing scene art');await new Promise(r=>setTimeout(r,20));art=drawSewerWorld(c,s,camera,view);}
   for(const hero of s.heroes)drawSprite(c,hero,hero.x,hero.y);drawSewerDarkness(c,s,camera,view);
   for(const scale of [2,4]){const out=document.createElement('canvas');out.width=320*scale;out.height=160*scale+32;const g=out.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#152022';g.fillRect(0,0,out.width,out.height);g.drawImage(native,0,32,320*scale,160*scale);g.fillStyle='#eee';g.font='14px monospace';g.fillText('SEEDED DIAGNOSTIC '+mode+' '+name+' HP '+h.hp+' '+(scale/2)+'x / imagegen90',8,21);shots.push({name:mode+'-'+name+'-'+scale/2+'x',png:out.toDataURL()});}
  }
  await photo('before');for(let n=0;n<12;n++)step(s,{},1/120);await photo('after');const hp=h.hp;for(let n=0;n<12;n++)step(s,{},1/120);checks.push({mode,hp,afterImmunity:h.hp,phase:e.phase,blocks:s.machine.blocks,gaitTravel:e.gaitTravel,skin:'imagegen90',seeded:true});await photo('motion');
 }return {shots,checks};
 });for(const c of result.checks){assert.equal(c.hp,c.mode==='contact'?2:3);assert.equal(c.afterImmunity,c.hp);if(c.mode==='shield')assert.ok(c.blocks>0);}for(const shot of result.shots)fs.writeFileSync(out+'/'+shot.name+'.png',Buffer.from(shot.png.split(',')[1],'base64'));fs.writeFileSync(out+'/check.json',JSON.stringify(result.checks,null,2));console.log(JSON.stringify(result.checks));
}finally{await browser.close();server?.close();}
