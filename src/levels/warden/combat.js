import {segmentHit,shieldHit} from '../../core/projectile-collision.js?v=warden91';
import {damage} from '../../core/health.js?v=warden91';
import {wardenGeometry} from './campaign.js?v=warden91';

// Both beams and low shockwaves stop at their first physical contact.
export function laserTrace(s,origin,target){
 const dx=target.x-origin.x,dy=target.y-origin.y,length=Math.hypot(dx,dy)||1;
 const end={x:origin.x+dx/length*2400,y:origin.y+dy/length*2400};
 let first={...end,t:1,kind:'air'};
 const consider=(hit,kind,hero)=>{if(hit&&hit.t<first.t)first={...hit,x:origin.x+(end.x-origin.x)*hit.t,y:origin.y+(end.y-origin.y)*hit.t,kind,hero};};
 const o=s.heroes[2];if(!o.dead)consider(shieldHit(o,{...end},origin.x,origin.y),'shield',o);
 for(const p of [...s.level.floors,...s.level.platforms])consider(segmentHit(origin.x,origin.y,end.x,end.y,{x:p.x,y:p.y,w:p.w,h:20}),'terrain');
 for(const h of s.heroes)if(!h.dead)consider(segmentHit(origin.x,origin.y,end.x,end.y,{x:h.x-13,y:h.y,w:26,h:44}),'hero',h);
 return first;
}
export function stepWardenCombat(s,dt){
 const g=s.machine;g.waves??=[];g.laser??={phase:'cooldown',age:0,target:null};
 for(const wave of g.waves){
  const old=wave.x;wave.x+=wave.dir*260*dt;wave.age+=dt;
  const contacts=[];const o=s.heroes[2];
  for(const platform of s.level.platforms)for(const x of [platform.x+20,platform.x+platform.w-24]){const hit=segmentHit(old,924,wave.x,924,{x:x-8,y:platform.y,w:16,h:940-platform.y});if(hit)contacts.push({...hit,shield:true,h:null});}
  if(!o.dead&&!o.shieldUp){const hit=shieldHit(o,{x:wave.x,y:924},old,924);if(hit)contacts.push({...hit,shield:true,h:o});}
  for(const h of s.heroes)if(!h.dead&&h.y+44>926&&h.y<940){const hit=segmentHit(old,924,wave.x,924,{x:h.x-15,y:h.y,w:30,h:44});if(hit)contacts.push({...hit,h});}
  contacts.sort((a,b)=>a.t-b.t);for(const hit of contacts){if(hit.shield){wave.dead=true;if(hit.h)g.blockAt=s.time;break;}damage(s,hit.h);}
 }
 g.waves=g.waves.filter(w=>!w.dead&&w.age<2.8);
 const laser=g.laser;if(g.disabled){laser.phase='cooldown';laser.age=0;return;}
 const a=s.heroes[s.active];if(a.x>=900&&!a.dead)g.engaged=true;
 if(!g.engaged)return;
 laser.age+=dt;
 if(laser.phase==='cooldown'&&laser.age>4){laser.phase='track';laser.age=0;g.laserWarnAt=s.time;}
 if(laser.phase==='track'){
  // No selected intruder in the chamber: keep the lens scanning, not spawn-sniping.
  if(a.x<900||a.dead){laser.phase='cooldown';laser.age=0;return;}
  laser.target={x:a.x,y:a.y+22};
  if(laser.age>=.85){laser.phase='lock';laser.age=0;}
 }else if(laser.phase==='lock'&&laser.age>=.7){laser.phase='fire';laser.age=0;g.laserFireAt=s.time;}
 else if(laser.phase==='fire'){
  const hit=laserTrace(s,wardenGeometry(s).emitter,laser.target);laser.hit={x:hit.x,y:hit.y,kind:hit.kind};
  if(hit.kind==='hero')damage(s,hit.hero);
  if(laser.age>=.35){laser.phase='cooldown';laser.age=0;}
 }
}
