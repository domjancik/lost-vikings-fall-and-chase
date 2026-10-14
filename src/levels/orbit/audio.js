export function createOrbitSounds(){let state=null,previous=null,lastMotor=0,lastStep=[0,0,0];return s=>{
 if(s.level.mechanic!=='orbit'){state=null;return [];}
 const g=s.machine,now={boots:s.heroes.map(h=>h.boots),phases:g.plates.map(p=>p.phase),ropes:[...g.ropeCut],panel:g.panelOpen,clamp:g.hook.plateId,dock:g.hookDocked,debris:g.debris.map(d=>d.phase)};
 if(state!==s){state=s;previous=now;lastMotor=s.time;lastStep=[s.time,s.time,s.time];return [];}
 const events=[],add=(name,x,id=0)=>events.push({name,x,id});
 for(let n=0;n<3;n++)if(now.boots[n]!==previous.boots[n])add('lever',s.heroes[n].x,n);
 for(const h of s.heroes)if(h.magnet&&Math.abs(h.magV)>40&&s.time-lastStep[h.id]>(h.id===2?.32:.23)){add('step',h.x,h.id);lastStep[h.id]=s.time;}
 for(let n=0;n<2;n++){
  if(now.phases[n]!==previous.phases[n])add(now.phases[n]==='charge'?'pump':now.phases[n]==='parked'?'land':'chain',g.plates[n].x);
  if(now.ropes[n]&&!previous.ropes[n])add('chain',[1360,3180][n],1);
  if(now.debris[n]==='warning'&&previous.debris[n]!=='warning')add('pump',g.debris[n].x);
 }
 if(now.panel&&!previous.panel)add('impact',1730);
 if(now.clamp!==previous.clamp)add('shieldHit',g.hook.x);
 if(now.dock&&!previous.dock)add('land',2900,2);
 if(g.operator!==null&&Math.hypot(g.hook.vx,g.hook.vy)>10&&s.time-lastMotor>.45){add('cart',g.hook.x);lastMotor=s.time;}
 previous=now;return events;
};}
