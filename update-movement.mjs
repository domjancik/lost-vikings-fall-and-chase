import fs from 'node:fs';
for(const file of ['engine.js','campaign.js']){
 let e=fs.readFileSync(file,'utf8');e="import {prepareMotion,integrateMotion} from './movement.js?v=motion5';\n"+e;
 if(file==='engine.js'){
  e=e.replace(' const a=s.heroes[s.active];a.vx=(input.right?1:0)-(input.left?1:0);if(a.vx)a.face=a.vx;\n if(input.jump&&a.ground&&a.id===0){a.vy=-570;a.ground=false;}', ' prepareMotion(s,input,dt);const a=s.heroes[s.active];');
  const start=e.indexOf(' for(const h of s.heroes){const prev=h.y;');const end=e.indexOf(' if(s.turret&&s.latch',start);
  e=e.slice(0,start)+" integrateMotion(s,floors,[{x:440,w:34,on:s.crate},{x:650,w:22,on:!s.power}],dt,true);\n"+e.slice(end);
 }else{
  e=e.replace(' a.vx=(input.right?1:0)-(input.left?1:0);if(a.vx)a.face=a.vx;\n if(input.jump&&a.id===0&&a.ground){a.vy=l.mechanic===\'bumper\'&&Math.abs(a.x-335)<48?-800:-570;a.ground=false;}', ' prepareMotion(s,input,dt);');
  const start=e.indexOf(' for(const h of s.heroes){const prev=h.y;');const end=e.indexOf(' const interval=',start);
  e=e.slice(0,start)+" integrateMotion(s,floors,[{x:438,w:36,on:s.crate}],dt);\n"+e.slice(end);
 }
 e=e.replace("if(a.id===1)s.shots.push", "if(a.id===1){a.bow=.28;s.shots.push");if(file==='campaign.js')e=e.replace("kind:'arrow'});}","kind:'arrow'});}}");
 if(file==='engine.js')e=e.replace("s.shots.push({x:a.x+a.face*25", "a.bow=.28;s.shots.push({x:a.x+a.face*25");
 fs.writeFileSync(file,e);
}
