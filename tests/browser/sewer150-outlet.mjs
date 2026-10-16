import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'),{chromium}=require('playwright');
const live=process.argv.includes('--live'),out=process.env.SEWER150_OUT||'assets/sewer150/diagnostic';fs.mkdirSync(out,{recursive:true});
const server=live?null:await createDevServer({built:true});if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();await page.goto((live?'https://united-marsh-6ppd.here.now':'http://127.0.0.1:'+server.address().port)+'/?skin=imagegen90&release=sewer150');
 const result=await page.evaluate(async()=>{
  const {createState,step}=await import('/engine.js'),{drawSewerWorld,drawSewerDarkness}=await import('/sewer-render.js'),{setHeroSkin,whenHeroesReady}=await import('/hero-art.js'),{drawSprite}=await import('/sprite-render.js'),{drawMagneticHero}=await import('/magnetic-render.js'),{sweptHeroPose}=await import('/sewer-water-transit.js');
  setHeroSkin('imagegen90');await whenHeroesReady();const shots=[],checks=[];
  for(const id of [0,1,2]){
   const s=createState(10,'cycle');s.time=10;s.machine.introTime=10;s.machine.lurkers=[];s.machine.rope.cut=true;s.machine.rope.pose=1;s.machine.gates[0].pose=1;
   for(const h of s.heroes)Object.assign(h,{x:2500,y:716,ground:true,skin:'imagegen90'});s.active=id;const hero=s.heroes[id];hero.x=2790;
   let elapsed=0;
   for(const t of [0,.55,1.25,1.7,1.95,2.3]){
    while(elapsed<t){step(s,{},1/120);elapsed+=1/120;}
    const native=document.createElement('canvas');native.width=360;native.height=210;const c=native.getContext('2d'),camera={x:2640,y:600},view={width:720,height:420};
    c.setTransform(.5,0,0,.5,-camera.x/2,-camera.y/2);c.imageSmoothingEnabled=false;
    let art=drawSewerWorld(c,s,camera,view),start=performance.now();while(!art.ready){if(performance.now()-start>10000)throw Error('Missing source art');await new Promise(r=>setTimeout(r,20));art=drawSewerWorld(c,s,camera,view);}
    if(!hero.sweptAway){const pose=sweptHeroPose(hero,s.machine.captured[id]?s.machine.escapeTravel[id]:null);if(pose)drawMagneticHero(c,{...hero,...pose},pose.scale??1);else drawSprite(c,hero,hero.x,hero.y);}
    drawSewerDarkness(c,s,camera,view);
    for(const scale of [2,4]){const image=document.createElement('canvas');image.width=360*scale;image.height=210*scale+32;const g=image.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#162025';g.fillRect(0,0,image.width,image.height);g.drawImage(native,0,32,360*scale,210*scale);g.fillStyle='#eee';g.font='14px monospace';g.fillText('SEEDED PRODUCTION FLOW / hero'+id+' t'+t+' '+scale/2+'x / imagegen90',8,21);shots.push({name:'hero'+id+'-'+t+'-'+scale/2+'x',png:image.toDataURL()});}
    checks.push({id,t,hero:{x:hero.x,y:hero.y,hp:hero.hp,sweptAway:!!hero.sweptAway,pose:hero.escapePose},outlet:art.contacts.find(a=>a.kind==='water-outlet')});
   }
  }
  return{shots,checks,seeded:true,skin:'imagegen90',sheets:['assets/vikings90/erik-native.png','assets/vikings90/baleog-native.png','assets/olaf111/olaf-native.png']};
 });
 assert.ok(result.checks.every(c=>c.outlet.foregroundCover===false));
 for(const id of [0,1,2]){const poses=result.checks.filter(c=>c.id===id);assert.ok(poses.some(c=>c.hero.pose?.depth>0&&!c.hero.sweptAway));assert.equal(poses.at(-1).hero.sweptAway,true);assert.ok(poses.every(c=>c.hero.hp===3));}
 for(const shot of result.shots)fs.writeFileSync(out+'/'+shot.name+'.png',Buffer.from(shot.png.split(',')[1],'base64'));
 fs.writeFileSync(out+'/check.json',JSON.stringify({...result,shots:result.shots.map(s=>s.name)},null,2));console.log(JSON.stringify({checks:result.checks.length,shots:result.shots.length,allThreeInside:true,foregroundCover:false}));
}finally{await browser.close();server?.close();}
