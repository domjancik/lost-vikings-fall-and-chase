export function createOrbitSounds(){let state=null,previous=null,lastMotor=0,lastStep=[0,0,0];return s=>{
 if(s.level.mechanic!=='orbit'){state=null;return [];}
 const g=s.machine,now={boots:s.heroes.map(h=>h.boots),phases:g.plates.map(p=>p.phase),ropes:[...g.ropeCut],panel:g.panelOpen,clamp:g.hook.plateId,attempts:g.hook.attempts,attached:s.heroes.map(h=>h.magnet?.plateId??null),sequence:g.sequence,dock:g.hookDocked,release:g.releaseAt,reset:g.resetAt,brake:g.ropeCut[4],debris:g.debris.map(d=>d.phase)};
 if(state!==s){state=s;previous=now;lastMotor=s.time;lastStep=[s.time,s.time,s.time];return [];}
 const events=[],add=(name,x,id=0)=>events.push({name,x,id});
 for(let n=0;n<3;n++)if(now.boots[n]!==previous.boots[n])add(now.boots[n]?'magnetOn':'magnetOff',s.heroes[n].x,n);
 for(let n=0;n<3;n++)if(now.attached[n]!==previous.attached[n]&&now.attached[n]!==null)add('magnetGrab',s.heroes[n].x,n);
 if(now.attempts!==previous.attempts)add('shieldLower',g.hook.x);
 if(now.sequence!==previous.sequence&&now.sequence>previous.sequence)add('orbitLatch',[1360,3180,1168,880][g.lastSwitch??0]);
 if(now.reset!==previous.reset)add('orbitReset',1120);
 if(now.release!==previous.release)add('orbitRelease',1120);
 if(now.brake&&!previous.brake)add('chain',2110);
 for(const h of s.heroes)if(h.magnet&&Math.abs(h.magV)>40&&s.time-lastStep[h.id]>(h.id===2?.32:.23)){add('step',h.x,h.id);lastStep[h.id]=s.time;}
 for(let n=0;n<2;n++){
  if(now.phases[n]!==previous.phases[n])add(now.phases[n]==='charge'?'pump':now.phases[n]==='parked'?'land':'chain',g.plates[n].x);
  if(n===1&&now.ropes[n]&&!previous.ropes[n])add('chain',3180,1);
  if(now.debris[n]==='warning'&&previous.debris[n]!=='warning')add('pump',g.debris[n].x);
 }
 if(now.panel&&!previous.panel)add('impact',1730);
 if(now.clamp!==previous.clamp)add('shieldHit',g.hook.x);
 if(now.dock&&!previous.dock)add('land',2900,2);
 if(g.operator!==null&&Math.hypot(g.hook.vx,g.hook.vy)>10&&s.time-lastMotor>.45){add('cart',g.hook.x);lastMotor=s.time;}
 previous=now;return events;
};}
