import {onPlunger} from './plunger.js?v=arc46';
import {damage} from './health.js?v=arc46';
import {SHIELD} from './hero-geometry.js?v=arc46';
// World units / second. Fast acceleration, short stopping distances, distinct weight.
export const motionProfiles=[{speed:230,accel:1650,brake:2600,air:1250},{speed:175,accel:1150,brake:2300,air:950},{speed:150,accel:900,brake:2100,air:750}];
const approach=(value,target,amount)=>value<target?Math.min(target,value+amount):Math.max(target,value-amount);
export function prepareMotion(s,input,dt){
 for(const h of s.heroes){
  const active=h.id===s.active,p=motionProfiles[h.id],dir=active?Number(!!input.right)-Number(!!input.left):0;
  h.prevX=h.x;h.prevY=h.y;h.animTime=(h.animTime||0)+dt;h.land=Math.max(0,(h.land||0)-dt);h.bow=Math.max(0,(h.bow||0)-dt);h.bash=Math.max(0,(h.bash||0)-dt);h.coyote=h.ground?.085:Math.max(0,(h.coyote||0)-dt);h.jumpBuffer=Math.max(0,(h.jumpBuffer||0)-dt);
  h.shieldPose=approach(h.shieldPose||0,h.shieldUp?1:h.shield?.4:0,dt*8);
  if(active&&h.id===0&&input.jump)h.jumpBuffer=.11;
  const before=h.vx;if(!active)h.vx=0;else{const rate=dir?(h.ground?p.accel:p.air):(h.ground?p.brake:p.air*1.5);h.vx=approach(h.vx,dir*p.speed,rate*dt);}
  h.turn=!!dir&&before*dir<0;if(dir)h.face=dir;
  h.bashBuffer=Math.max(0,(h.bashBuffer||0)-dt);if(active&&h.id===0&&input.action)h.bashBuffer=.18;
  if(h.bash>.12){h.face=h.bashFace||h.face;h.vx=h.face*320;}
  h.moveX=active?(before+h.vx)*.5*dt:0;
  if(active&&h.id===0&&h.jumpBuffer>0&&(h.ground||h.coyote>0)){const boosted=s.level?.mechanic==='bankshot'&&onPlunger(h);if(boosted)s.machine.plungerAt=s.time;h.vy=boosted?-800:-570;h.ground=false;h.support=null;h.coyote=0;h.jumpBuffer=0;h.takeoff=.1;}
  h.takeoff=Math.max(0,(h.takeoff||0)-dt);
 }
}
export function integrateMotion(s,floors,walls,dt,pub=false){
 // Include displacement already applied by a moving platform this frame.
 // prepareMotion records this origin before platforms carry their passengers.
 const o=s.heroes[2],ox=o.prevX??o.x;
 for(const h of [o,s.heroes[0],s.heroes[1]]){
  if(h.id!==2&&h.support===2&&o.shieldUp){h.x+=o.x-ox;h.y=o.y+SHIELD.upTop-44;}
  const prev=h.y,impact=h.vy;h.x+=h.moveX||0;const right=(s.level.worldWidth??1440)-25;if(h.x<20||h.x>right)h.vx=0;h.x=Math.max(20,Math.min(right,h.x));
  for(const wall of walls)if(wall.on&&h.y+44>(wall.top??510)&&h.y<(wall.bottom??Infinity)&&h.x+16>wall.x&&h.x-16<wall.x+wall.w){h.x=h.x<wall.x+wall.w/2?wall.x-16:wall.x+wall.w+16;h.vx=0;}
  h.vy=Math.min(900,h.vy+1250*dt);if(h.id===2&&h.shieldUp)h.vy=Math.min(100,h.vy);h.y+=h.vy*dt;h.ground=false;h.support=null;
  const surfaces=h.id!==2&&o.shieldUp?[{x:o.x-SHIELD.upWidth/2,y:o.y+SHIELD.upTop,w:SHIELD.upWidth,support:2},...floors]:floors;
  for(const p of surfaces)if(h.x+15>p.x&&h.x-15<p.x+p.w&&prev+44<=p.y+2&&h.y+44>=p.y&&h.vy>=0){if(impact>130)h.land=.12;h.y=p.y-44;h.vy=0;h.ground=true;h.support=p.support??null;}
  if(h.ground)h.walk=(h.walk||0)+Math.abs(h.x-h.prevX)/9;
  if(h.y>(s.level.deathY??700))damage(s,h,3,true);
 }
}
