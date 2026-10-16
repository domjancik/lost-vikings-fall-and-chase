import {alehallLevel,setupAlehall,alehallStep,alehallObjects,alehallSurfaces} from '../../levels/pub/campaign.js?v=alehall135';
import {sewerLevel,setupSewer,sewerStep,sewerObjects,sewerSurfaces} from '../../levels/sewer/campaign.js?v=alehall135';
import {lodeLevel,setupLode,lodeStep,lodeObjects,lodeSurfaces} from '../../levels/lode/campaign.js?v=alehall135';
import {orbitLevel,setupOrbit,orbitStep,orbitObjects,orbitSurfaces} from "../../levels/orbit/campaign.js?v=alehall135";
import {loomLevel,setupLoom,loomStep,loomObjects,loomSurfaces} from '../../levels/loom/campaign.js?v=loom96';
import {freightLevel,setupFreight,freightStep,freightObjects,freightSurfaces} from '../../levels/freight/campaign.js?v=alehall135';
import {wardenLevel,setupWarden,wardenStep,wardenObjects,wardenSurfaces} from '../../levels/warden/campaign.js?v=warden89';
import {clockworkLevel,setupClockwork,clockworkStep,clockObjects,clockSurfaces} from '../../levels/clockwork/campaign.js?v=clockwork71';
import {waterLevel,setupWater,waterStep,waterObjects,waterSurfaces} from '../../levels/water/campaign.js?v=orbit116';
import {momentumLevel,setupMomentum,momentumStep,momentumObjects,momentumSurfaces} from '../../levels/momentum/campaign.js?v=momentum72';
import {prepareMotion,integrateMotion} from '../../core/movement.js?v=vikings70';
import {segmentHit} from '../../core/projectile-collision.js?v=arc46';
import {damage} from '../../core/health.js?v=arc46';
import {ladderAtHero} from '../../core/ladder-context.js?v=look58';
import {refractionLevel,setupRefraction,refractionObjects,refractionStep} from '../../levels/refraction/campaign.js?v=vikings70';
const floor=(x,y,w)=>({x,y,w});
export const cycleLevels=[{
 name:'THE CYCLE OF DEPTHS',subtitle:'Change the circulation. Bring everyone back together.',
 story:['Below the archive, a passenger circuit still runs its rounds. Its upper rail is disconnected.','A maintenance ladder reaches the wind brake. The vent can carry a raised shield to the routing gallery.'],
 hint:'Cut the drive restraint. Release the brake on the loft and the glass damper catch from the gallery. Olaf catches the draft; the selector changes the next circuit at its dock.',
 mechanic:'cycle',worldWidth:2800,worldTop:0,worldBottom:1200,deathY:1170,
 floors:[floor(0,940,850),floor(1280,940,160),floor(1700,940,350),floor(2210,940,590),floor(0,1120,2800)],
 platforms:[floor(500,500,350),floor(1000,390,180),floor(1460,260,220),floor(2210,260,590)],
 ladders:[{x:650,top:500,bottom:1120}],exit:{x:2600,y:260,w:170}
},refractionLevel,momentumLevel,clockworkLevel,waterLevel,wardenLevel,loomLevel,freightLevel,orbitLevel,lodeLevel,sewerLevel,alehallLevel];
export function setupCycle(s){
 if(s.round===11){setupAlehall(s);return;}
 if(s.round===10){setupSewer(s);return;}
 if(s.round===9){setupLode(s);return;}
 if(s.round===8){setupOrbit(s);return;}
 if(s.round===7){setupFreight(s);return;}
 if(s.round===6){setupLoom(s);return;}
 if(s.round===5){setupWarden(s);return;}
 if(s.round===4){setupWater(s);return;}
 if(s.round===3){setupClockwork(s);return;}
 if(s.round===2){setupMomentum(s);return;}
 if(s.round===1){setupRefraction(s);return;}
 s.level=cycleLevels[0];s.crate=false;s.turret=false;s.enemies=[];
 for(const h of s.heroes){h.y=896;h.ground=true;}
 s.machine={released:false,cutAt:-1,brake:false,brakePose:0,damper:0,damperReleased:false,selector:false,selectorPose:0,
  carrier:{x:850,y:940,w:160,segment:0,high:500,v:0,pause:1.5,laps:0,support:'cycle-carrier'},highArrival:false};
}
export function cycleSurfaces(s){if(s.level.mechanic==='alehall')return alehallSurfaces(s);if(s.level.mechanic==='sewer')return sewerSurfaces(s);if(s.level.mechanic==='lode')return lodeSurfaces(s);if(s.level.mechanic==="orbit")return orbitSurfaces(s);if(s.level.mechanic==='freight')return freightSurfaces(s);if(s.level.mechanic==='loom')return loomSurfaces(s);if(s.level.mechanic==='warden')return wardenSurfaces(s);if(s.level.mechanic==='water')return waterSurfaces(s);if(s.level.mechanic==='clockwork')return clockSurfaces(s);if(s.level.mechanic==='momentum')return momentumSurfaces(s);return [s.machine.carrier,...s.level.floors,...s.level.platforms];}
export function cycleObjects(s){if(s.level.mechanic==='alehall')return alehallObjects(s);if(s.level.mechanic==='sewer')return sewerObjects(s);if(s.level.mechanic==='lode')return lodeObjects(s);if(s.level.mechanic==="orbit")return orbitObjects(s);if(s.level.mechanic==='freight')return freightObjects(s);if(s.level.mechanic==='loom')return loomObjects(s);if(s.level.mechanic==='warden')return wardenObjects(s);if(s.level.mechanic==='water')return waterObjects(s);if(s.level.mechanic==='clockwork')return clockObjects(s);if(s.level.mechanic==='momentum')return momentumObjects(s);if(s.level.mechanic==='refraction')return refractionObjects(s);return [
 {id:'wind-brake',x:1070,y:346,radius:65,title:'WIND BRAKE',ready:true,done:s.machine.brake,run:()=>{s.machine.brake=true;return 'Brake pin withdrawn.';}},
 {id:'routing',x:1600,y:216,radius:65,title:'RAIL SELECTOR',ready:true,done:s.machine.selector,run:()=>{s.machine.selector=!s.machine.selector;return 'Route queued for the bottom dock.';}}
];}
function feedback(s,message){s.feedback={message,sequence:(s.feedback?.sequence||0)+1};}
const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
export function advanceCycleCarrier(s,dt){
 const g=s.machine,c=g.carrier;if(!g.released)return;
 if(c.pause>0){c.pause=Math.max(0,c.pause-dt);return;}
 if(c.segment===0&&c.y===940)c.high=g.selector?260:500;
 const destinations=[[850,c.high],[2050,c.high],[2050,940],[850,940]],target=destinations[c.segment];
 const oldX=c.x,oldY=c.y,dx=target[0]-c.x,dy=target[1]-c.y,d=Math.hypot(dx,dy);
 c.v=approach(c.v,Math.min(180,Math.sqrt(2*300*d)),300*dt);
 const travel=Math.min(d,c.v*dt);if(d){c.x+=dx/d*travel;c.y+=dy/d*travel;}
 for(const h of s.heroes)if(h.support==='cycle-carrier'&&h.x+14>oldX&&h.x-14<oldX+c.w&&Math.abs(h.y+44-oldY)<3&&h.vy>=0&&!h.climbing){h.x+=c.x-oldX;h.y+=c.y-oldY;h.vy=0;}
 if(travel>=d){c.x=target[0];c.y=target[1];c.v=0;c.segment=(c.segment+1)%4;c.pause=1.5;
  if(c.segment===2&&c.high===260)g.highArrival=true;if(c.segment===0)c.laps++;
 }
}
export function cycleStep(s,input,dt){
 if(s.level.mechanic==='alehall'){alehallStep(s,input,dt);return;}
 if(s.level.mechanic==='sewer'){sewerStep(s,input,dt);return;}
 if(s.level.mechanic==='lode'){lodeStep(s,input,dt);return;}
 if(s.level.mechanic==="orbit"){orbitStep(s,input,dt);return;}
 if(s.level.mechanic==='freight'){freightStep(s,input,dt);return;}
 if(s.level.mechanic==='loom'){loomStep(s,input,dt);return;}
 if(s.level.mechanic==='warden'){wardenStep(s,input,dt);return;}
 if(s.level.mechanic==='water'){waterStep(s,input,dt);return;}
 if(s.level.mechanic==='clockwork'){clockworkStep(s,input,dt);return;}
 if(s.level.mechanic==='momentum'){momentumStep(s,input,dt);return;}
 if(s.level.mechanic==='refraction'){refractionStep(s,input,dt);return;}
 s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);const g=s.machine,a=s.heroes[s.active];
 for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);
 prepareMotion(s,input,dt);
 if(input.interact){const o=cycleObjects(s).find(o=>Math.abs(a.x-o.x)<o.radius&&Math.abs(a.y-o.y)<60);if(o)feedback(s,o.run());}
 if(a.id===1&&input.sword&&s.cooldown===0){a.swing=.24;s.cooldown=.3;
  if(!g.released&&Math.abs(a.x-450)<75&&Math.abs(a.y-896)<60){g.released=true;g.cutAt=s.time;feedback(s,'Shipping restraint cut. The passenger circuit is moving.');}
  if(!g.damperReleased&&(1324-a.x)*a.face>=0&&Math.abs(a.x-1324)<75&&Math.abs(a.y+20-476)<35){g.damperReleased=true;feedback(s,'Damper catch released.');}
 }
 if(a.id===1&&input.action&&s.cooldown===0){a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580});}
 for(const p of s.shots){const px=p.x;p.x+=p.v*dt;
  if(!g.damperReleased&&segmentHit(px,p.y,p.x,p.y,{x:1312,y:464,w:24,h:24})){g.damperReleased=true;p.dead=true;}
 }s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<2800);
 g.brakePose=approach(g.brakePose,g.brake?1:0,dt/.6);
 g.damper=approach(g.damper,g.damperReleased?1:0,dt/1.2);
 g.selectorPose=approach(g.selectorPose,g.selector?1:0,dt/.6);
 const climbers=[];
 for(const h of s.heroes){
  if(h.id===s.active){const l=ladderAtHero(s.level,h);
   if((input.up||input.down)&&l)h.climbing=true;
   if(input.left||input.right||input.jump)h.climbing=false;
  }
  if(h.climbing){const l=s.level.ladders[0],dir=h.id===s.active?Number(!!input.down)-Number(!!input.up):0;
   climbers.push({h,y:Math.max(l.top-44,Math.min(l.bottom-44,h.y+dir*150*dt))});h.moveX=0;h.vy=0;
  }
 }
 const riders=s.heroes.filter(h=>h.support==='cycle-carrier');
 advanceCycleCarrier(s,dt);
 const o=s.heroes[2],draft=g.brakePose===1&&g.damper===1&&o.shieldUp&&o.x>=1280&&o.x<=1440&&o.y+44>220&&o.y+44<=960;
 if(draft){o.vy=Math.max(-200,o.vy-2200*dt);o.ground=false;}
 integrateMotion(s,cycleSurfaces(s),[],dt);
 // Existing passengers stay aboard while passing a deck; stationary deck
 // occupants keep their own support and must step aboard at its edge.
 const c=g.carrier;
 for(const h of riders)if(h.ground&&Math.abs(h.y+44-c.y)<2&&h.x+15>c.x&&h.x-15<c.x+c.w&&!h.climbing)h.support='cycle-carrier';
 for(const {h,y}of climbers){h.x=650;h.y=y;h.vy=0;h.ground=true;h.support='ladder';h.climbMoving=h.id===s.active&&(input.up||input.down);}
 // Missed boarding remains a real fall; never relocate a hero or the cradle.
 for(const h of s.heroes)if(h.y>1170)damage(s,h,3,true);
 s.power=g.highArrival;s.won=!s.failed&&s.power&&s.heroes.every(h=>Math.abs(h.x-2600)<85&&Math.abs(h.y+44-260)<4);
}
