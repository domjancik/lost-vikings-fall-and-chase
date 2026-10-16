import {prepareMotion,integrateMotion} from '../../core/movement.js?v=vikings70';
import {deviceDone,advanceDeviceVisuals} from './story-visuals.js?v=ground51';
import {startBash,bashImpact} from '../../core/bash.js?v=arc46';
import {shieldHit,segmentHit} from '../../core/projectile-collision.js?v=arc46';
import {giveItem,pickupItem,useItem,message} from '../../core/inventory.js?v=alehall135';
import {damage} from '../../core/health.js?v=arc46';
import {makeEnemy,updateEnemies,hurtEnemy,nearestEnemyHit} from './story-enemies.js?v=arc46';
import {advanceMechanisms,gateWall,liftSurface} from './story-mechanisms.js?v=arc46';
import {storyLevels,makeStoryMachines} from './story-layout.js?v=scale50';
export {storyLevels};
const close=(h,x,y=566,r=64)=>Math.abs(h.x-x)<r&&Math.abs(h.y-y)<60;
export const storyDoors=s=>s.machine.gates;
export const storyWalls=s=>s.machine.gates.map(gateWall);
export const storySurfaces=s=>[...s.level.floors,...s.level.platforms,...s.machine.lifts.map(liftSurface)];
export function setupStory(s){
 s.campaign='story';s.level=storyLevels[s.round];s.crate=false;s.turret=false;Object.assign(s.machine,makeStoryMachines(s.round));const g=s.machine;
 s.items=[];if(s.round===0)s.items.push({id:'wafer',type:'serviceKey',x:1320,y:366});if(s.round===4)s.items.push({id:'weave',type:'archive',x:830,y:366});if(s.round>4)giveItem(s.heroes[2],'archive');
 s.enemies=[];if(![2,6].includes(s.round)){const y=[1,3,5].includes(s.round)?s.level.exit.y:610,left=s.round===0?1920:s.round===4?2350:s.round===7?1760:s.round===5?2200:s.round===3?2350:2420;s.enemies.push(makeEnemy(left+60,y,left,left+160,'crawler'));}
 if(s.round===7)for(const h of s.heroes)h.brass=true;
 s.itemAction=(type,h,slot)=>{
  if(s.round===0&&type==='serviceKey'&&close(h,1500)){g.flags.wafer=true;h.inventory[slot]=null;message(s,'Wafer seats in its matching return socket.');return true;}
  if(s.round===4&&type==='archive'&&close(h,1200)&&!g.flags.copied&&!g.copying){h.inventory[slot]=null;g.copying=true;g.copy=0;message(s,'The weave travels into the preservation dock. Wait for its return.');return true;}
  if(s.round===6&&type==='archive'&&close(h,950)&&!g.archiveMounted){h.inventory[slot]=null;g.archiveMounted=true;message(s,'Archive mounted. Release reset storage to carry it outside.');return true;}
  return false;
 };
}
export function storyObjects(s){const g=s.machine,h=s.heroes[s.active],out=[];
 const device=(id,x,y,title,ready,run,reason='The connected mechanism is still constrained.')=>out.push({id,x,y,title,ready,done:deviceDone(g,id),radius:58,kind:'machine',reason,run});
 for(const [id,x,y] of s.round===0?[['sluice',950,566]]:s.round===4?[['inhabited',2240,566]]:s.round===5?[['sky',2950,86]]:s.round===7?[['rain',2820,566]]:[]){const d=g.gates.find(v=>v.id===id);device('ratchet-'+id,x,y,'SECURE RATCHET',true,()=>{d.secured=true;return 'Ratchet secured. Everyone can leave the tread.';});}
 for(const l of g.lifts)for(const y of [l.low,l.high])device('lift-'+l.id+'-'+y,l.x+72,y-44,'LIFT '+(l.target===l.low?'UP':'DOWN'),s.round===1?g.payloads[0].arrived:l.id==='screen'?g.payloads[0].arrived&&g.targets[0].hit:true,()=>{l.target=l.target===l.low?l.high:l.low;return 'The cradle moves along its track.';},l.id==='screen'?'Release the screen restraint and exposed glass diaphragm first.':'The packet has not reached its landing.');
 if(s.round===1)device('route',700,566,'ROUTE OUT',true,()=>{g.flags.route=true;return 'The return address is disconnected.';});
 if(s.round===2){device('isolate',690,366,'ISOLATE REEDS',true,()=>{g.flags.isolated=true;return 'Deletion channel can now be isolated locally.';});device('work',1500,566,'CLOSE DELETION CHANNEL',g.flags.isolated,()=>{g.operator=h.id;g.work=0;return 'Isolation stroke started. Keep this worker protected.';},'The upper isolation handle is still open.');}
 if(s.round===6){device('confirm',1300,566,'RELEASE RESET COPIES',g.archiveMounted,()=>{g.resetting=true;return 'Reset reservoirs drain into archive storage.';},'Mount the archive in its matching cradle first.');for(const [i,x]of [[0,2000],[1,2300],[2,2600]])device('body'+i,x,566,g.transferred[i]?'STEP OUT':'OUTPUT CRADLE',g.reset>=1,()=>{if(h.transferred){const old=g.transferred.indexOf(h.id+1);g.transferred[old]=false;h.transferred=false;return 'Crossing is not committed. You step out.';}if(g.transferred[i])return 'Cradle occupied.';g.transferred[i]=h.id+1;h.transferred=true;h.x=x;h.vx=h.vy=0;return 'One body waits beyond the glass.';},'Archive storage is not ready.');}
 if(s.round===7)device('escape',1200,286,'UNLOCK OUTSIDE',true,()=>{g.flags.hatch=true;return 'Real wind enters the hatch.';});return out;
}
function goals(s,dt){const g=s.machine;
 for(const d of g.gates){const pads=g.treads.filter(p=>p.gate===d.id);for(const p of pads)p.held=s.heroes.some(h=>!h.transferred&&Math.abs(h.x-p.x)<28&&Math.abs(h.y+44-p.y)<3);if(pads.length)d.target=d.secured||pads.every(p=>p.held);}
 const set=(id,on)=>{const d=g.gates.find(v=>v.id===id);if(d)d.target=!!on;};
 switch(s.round){
 case 0:set('wafer',g.flags.wafer);set('weight',g.payloads[0].arrived);s.power=g.payloads[0].arrived;break;
 case 1:g.payloads[0].released=!!(g.flags.route&&g.targets[0].hit);set('arrival',g.payloads[0].arrived);s.power=g.payloads[0].arrived;break;
 case 2:if(g.operator!==null&&g.work<1){const h=s.heroes[g.operator];if(!close(h,1500)||h.hurt>0){g.operator=null;g.work=0;message(s,'Isolation interrupted. Retry with protection.');}else g.work=Math.min(1,g.work+dt/4);}set('isolation',g.work>=1);set('residents',g.payloads[0].arrived);s.power=g.payloads[0].arrived;break;
 case 3:set('stamp',g.payloads[0].arrived);set('canopy',g.targets[0].hit);s.power=g.payloads[0].arrived&&g.targets[0].hit;break;
 case 4:if(g.copying){g.copy=Math.min(1,g.copy+dt/3);if(g.copy===1){g.copying=false;g.flags.copied=true;s.items.push({id:'returned-weave',type:'archive',x:1200,y:566});}}set('archive',g.flags.copied&&s.heroes.some(h=>h.inventory.includes('archive')));s.power=g.flags.copied&&s.heroes.some(h=>h.inventory.includes('archive'));break;
 case 5:s.power=g.gates[0].secured&&s.heroes.some(h=>h.inventory.includes('archive'));break;
 case 6:if(g.resetting)g.reset=Math.min(1,g.reset+dt/4);set('ownership',g.reset>=1);s.power=g.reset>=1;break;
 case 7:set('hatch',g.flags.hatch);s.power=g.flags.hatch&&g.payloads[0].arrived&&g.gates[1].secured&&s.heroes.some(h=>h.inventory.includes('archive'));break;
 }
}
export function storyStep(s,input,dt){
 const g=s.machine,a=s.heroes[s.active],o=s.heroes[2];s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);
 prepareMotion(s,a.transferred?{}:input,dt);startBash(s,dt);const melee=(x,y)=>(x-a.x)*a.face>0&&Math.abs(x-a.x)<85&&Math.abs(y-a.y)<62;
 if(input.sword&&a.id===1&&!a.transferred&&s.cooldown===0){a.swing=.24;s.cooldown=.3;for(const e of s.enemies)if(melee(e.x,e.y))hurtEnemy(s,e);for(const c of g.cuts)if(!c.cut&&melee(c.x,c.y)){c.cut=true;c.cutAt=s.time;c.payload.released=true;}for(const t of g.targets)if(!t.hit&&melee(t.x,t.y-20)){t.hit=true;t.hitAt=s.time;}}
 if(input.action&&a.id===1&&!a.transferred&&s.cooldown===0){a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580});}
 if(a.id===0&&a.bash>0)for(const e of s.enemies)if(melee(e.x,e.y)){hurtEnemy(s,e);bashImpact(s,e.x,e.y);}
 if(input.interact){const obj=storyObjects(s).filter(v=>close(a,v.x,v.y,v.radius)).sort((u,v)=>Math.abs(a.x-u.x)-Math.abs(a.x-v.x))[0];if(a.transferred)message(s,obj?.run()||'Use your cradle to step out.');else if(!pickupItem(s))message(s,obj?(obj.ready?obj.run():obj.reason):'No reachable handle or loose item here.');}
 if(input.item&&!a.transferred)useItem(s);goals(s,dt);advanceDeviceVisuals(g,dt);g.workPose=(g.workPose||0)+Math.sign(g.work-(g.workPose||0))*Math.min(Math.abs(g.work-(g.workPose||0)),dt/.8);advanceMechanisms(g,s.heroes,dt);
 const frozen=s.heroes.filter(h=>h.transferred).map(h=>({h,x:h.x,y:h.y}));integrateMotion(s,storySurfaces(s),storyWalls(s),dt);for(const p of frozen)Object.assign(p.h,{x:p.x,y:p.y,vx:0,vy:0});
 if(s.round===2&&g.operator!==null&&g.work<1&&Math.floor((s.time-dt)/.9)!==Math.floor(s.time/.9))s.shots.push({kind:'bolt',x:1800,y:586,v:-280});
 if(s.round===5&&Math.floor((s.time-dt)/1.2)!==Math.floor(s.time/1.2))s.shots.push({kind:'drop',x:2530,y:350,v:0,vy:260});
 if(s.round===7&&!g.payloads[0].arrived&&Math.floor((s.time-dt)/1.5)!==Math.floor(s.time/1.5))s.shots.push({kind:'drop',x:2200,y:290,v:0,vy:240});
 updateEnemies(s,dt,storyWalls(s));
 for(const p of s.shots){const px=p.x,py=p.y;p.prevX=px;p.prevY=py;p.x+=p.v*dt;p.y+=(p.vy||0)*dt;
  const solids=[...storyWalls(s).filter(w=>w.on).map(w=>({x:w.x,y:w.top,w:w.w,h:w.bottom-w.top})),...storySurfaces(s).map(f=>({x:f.x,y:f.y,w:f.w,h:22}))];
  const solid=solids.map(b=>segmentHit(px,py,p.x,p.y,b)).filter(Boolean).sort((a,b)=>a.t-b.t)[0],shield=shieldHit(o,p,px,py),enemy=p.kind==='arrow'?nearestEnemyHit(s,p,px,py):null;
  const body=p.kind!=='arrow'?s.heroes.filter(h=>!h.transferred).map(h=>({h,hit:segmentHit(px,py,p.x,p.y,{x:h.x-16,y:h.y,w:32,h:44})})).filter(v=>v.hit).sort((u,v)=>u.hit.t-v.hit.t)[0]:null;
  if(enemy&&enemy.hit.t<Math.min(solid?.t??Infinity,shield?.t??Infinity)){hurtEnemy(s,enemy.e);p.dead=true;continue;}
  if(body&&body.hit.t<Math.min(solid?.t??Infinity,shield?.t??Infinity)){damage(s,body.h);p.dead=true;continue;}
  if(solid||shield){p.dead=true;continue;}if(p.kind==='arrow')for(const t of g.targets)if(!t.hit&&segmentHit(px,py,p.x,p.y,{x:t.x-14,y:t.y-16,w:28,h:32})){t.hit=true;t.hitAt=s.time;p.dead=true;}
 }s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<3200&&p.y<1020);
 for(const i of s.items)if(i.id.startsWith('drop-')){const p=storySurfaces(s).filter(f=>i.x>=f.x&&i.x<=f.x+f.w&&f.y>=i.y+44).sort((a,b)=>a.y-b.y)[0];if(p)i.y=Math.min(p.y-44,i.y+240*dt);}
 s.archiveCustody=g.archiveMounted?'core':s.heroes.some(h=>h.inventory.includes('archive'))?'crew':s.items.some(i=>i.type==='archive')?'world':g.copying?'carrier':null;
 if(s.round===6)s.won=!s.failed&&g.transferred.every(Boolean);else{const e=s.level.exit;s.won=!s.failed&&s.power&&s.heroes.every(h=>Math.abs(h.x-e.x)<e.w/2&&Math.abs(h.y+44-e.y)<4);}
}
