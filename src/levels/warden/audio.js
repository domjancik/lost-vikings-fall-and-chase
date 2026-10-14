// Sounds follow physical state transitions, never held controls.
export function createWardenSounds(){let state=null,previous=null,lastMotion=-10;return s=>{
 if(s.level.mechanic!=='warden'){state=null;previous=null;return [];}
 const g=s.machine,current={drop:!g.disabled&&!g.braced&&g.cycle%6.5>=4.5&&g.cycle%6.5<5.2,braced:g.braced,disabled:g.disabled,exposure:g.exposure,shutter:g.shutter,foot:g.footY,release:g.release,distance:g.cargo.distance,target:g.cargo.target,slam:g.slamAt,warning:g.laserWarnAt,fire:g.laserFireAt,block:g.blockAt},events=[];
 if(state!==s){state=s;previous=current;lastMotion=s.time;return events;}
 const old=previous,add=(name,x,id=0)=>events.push({name,x,id});
 if(!old.braced&&current.braced)add('shieldHit',1490,2);
 if(current.exposure>old.exposure+.1)add('plunger',1380);
 if(!old.disabled&&current.disabled)add('lens',1724,1);
 if(!old.drop&&current.drop)add('wardenDrop',g.footX,2);
 if(current.slam!==old.slam&&!g.braced&&!g.disabled)add('wardenStomp',g.footX,2);
 if(current.warning!==old.warning)add('wardenCharge',1648);
 if(current.fire!==old.fire)add('wardenLaser',g.laser.target?.x??1648);
 if(current.block!==old.block)add('shieldHit',s.heroes[2].x,2);
 if(old.release<1&&current.release===1)add('chain',g.cargo.x);
 if(current.target!==old.target)add('lever',g.cargo.x);
 if(old.distance!==current.distance&&current.distance===current.target)add('bell',g.cargo.x);
 if(s.time-lastMotion>.35&&(Math.abs(current.distance-old.distance)>.01||Math.abs(current.shutter-old.shutter)>.01)){add(current.shutter!==old.shutter?'chain':'cart',g.cargo.x);lastMotion=s.time;}
 previous=current;return events;
 };}
