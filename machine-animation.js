import {animationTime,snapPixel} from './pixel-grid.js?v=far45';
const age=(time,event)=>Number.isFinite(event)?Math.max(0,animationTime(time-event)):Infinity;
export function machinePose(s){
 const g=s.machine,t=animationTime(s.time),mixAge=age(t,g.mixedAt),shotAge=age(t,g.dragonShotAt);
 const ready=g.ore&&age(t,g.oreCutAt)>=4/3&&g.air>0&&g.heat<3;
 return {
  ovenFrame:g.baked?3:age(t,g.ovenDoorAt)<.6?2:g.ovenMode?1:0,
  bowlFrame:mixAge<1.8?2+Math.floor(mixAge*8)%2:g.ingredients?.length?1:0,
  dragonFrame:g.heat>=3?0:shotAge<.34?2:shotAge<.75?3:ready&&t%2.2>1.8?1:0,
  bellowsCompression:snapPixel(Math.sin(Math.min(age(t,g.lastPump)/.5,1)*Math.PI)*18),
  flameFrame:Math.floor(t*12)%8,
  safeOpen:snapPixel(Math.min(age(t,g.safeOpenAt)/.5,1)*38),
 };
}
