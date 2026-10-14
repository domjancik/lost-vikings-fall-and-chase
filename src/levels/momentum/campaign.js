import {prepareMotion,integrateMotion} from '../../core/movement.js?v=vikings70';
import {ladderAtHero} from '../../core/ladder-context.js?v=look58';
import {damage} from '../../core/health.js?v=arc46';
import {shieldHit,segmentHit} from '../../core/projectile-collision.js?v=arc46';
import {startBash} from '../../core/bash.js?v=arc46';
import {refractionArt} from '../refraction/art-layout.js?v=refraction62';
const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
export const BALL_RADIUS=56,HIGH_DECK=508;
export const momentumLiftPlacement=c=>({x:c.x,y:c.y-refractionArt.liftRim*2,w:c.w,h:128,rim:refractionArt.liftRim});
export const momentumLevel={name:'THE MOMENTUM WORKS',subtitle:'Give weight a direction. Then keep up.',
 story:['The return circuit crosses a flywheel foundry. Its freight still follows the old rails.','A spring-loaded guide separates waste from work. The upper line reaches a living clock.'],
 hint:'Stage Baleog at the spring guide and Erik on the boarding gallery. Olaf braces his front shield against the flywheel. Strike the guide as the wheel approaches; board its crown and balance. The upper safety crank stops the timing lane and calls a crew lift.',
 mechanic:'momentum',worldWidth:3400,worldTop:0,worldBottom:1280,deathY:1320,
 floors:[{x:0,y:1120,w:3400}],platforms:[{x:0,y:720,w:520},{x:780,y:960,w:150},{x:1080,y:760,w:120},{x:1780,y:508,w:240},{x:2340,y:508,w:570},{x:3090,y:508,w:310}],
 ladders:[{x:320,top:720,bottom:1120},{x:890,top:960,bottom:1120},{x:1140,top:760,bottom:1120}],exit:{x:3260,y:508,w:170}};
export function railPoint(p,branch='upper'){
 let start,end,y0,y1;
 if(p<=520)return {y:720,slope:0};
 if(p<=1000){start=520;end=1000;y0=720;y1=960;}
 else if(branch==='lower'){start=1000;end=1500;y0=960;y1=1120;}
 else {start=1000;end=1800;y0=960;y1=720;}
 const t=Math.max(0,Math.min(1,(p-start)/(end-start)));
 return {y:y0+(y1-y0)*t*t*(3-2*t),slope:(y1-y0)*6*t*(1-t)/(end-start)};
}
export function spherePose(p,branch){const r=railPoint(p,branch),n=Math.hypot(1,r.slope);return {x:p+r.slope*BALL_RADIUS/n,y:r.y-BALL_RADIUS/n};}
export function sphereCrown(b,x){const d=x-b.x;return Math.abs(d)<BALL_RADIUS?b.y-Math.sqrt(BALL_RADIUS**2-d*d):null;}
export function laserPhase(t){const p=((t%4)+4)%4;return p<2.6?'off':p<3.2?'charge':'live';}
export function setupMomentum(s){
 s.level={...momentumLevel,ladders:momentumLevel.ladders.map(l=>({...l}))};s.crate=false;s.turret=false;s.enemies=[];
 for(const h of s.heroes)Object.assign(h,{y:676,ground:true});
 s.machine={ball:{p:480,...spherePose(480,'upper'),v:0,angle:0,mode:'cradle',branch:'upper'},guide:0,guideHold:0,pushStarted:false,steerHit:0,highReached:false,recovery:0,safety:false,clock:0,fireClock:0,bumperAt:-10,tileEvent:0,
  tiles:Array.from({length:4},(_,i)=>({x:2020+i*80,y:508,w:80,t:0,drop:0,vy:0})),carrier:{x:2910,y:1120,w:180,v:0,dir:-1,pause:3,support:'momentum-lift'}};
}
export function requestReturn(s){const b=s.machine.ball;if(b.mode==='return'||b.mode==='cradle')return false;if(s.heroes.some(h=>h.support==='momentum-ball'&&h.ground)){s.machine.returnPending=true;return false;}b.mode='return';b.returnStage=0;b.v=0;return true;}
export function momentumObjects(s){return [
 {id:'cradle-return',x:330,y:676,radius:65,title:'RETURN CRANK',ready:true,done:false,run:()=>{const moved=requestReturn(s);return moved?'Return hoist engaged.':s.machine.returnPending?'Return queued. Leave the wheel first.':'Wheel already in its cradle.';}},
 {id:'catcher-return',x:1350,y:1076,radius:65,title:'RETURN CRANK',ready:true,done:false,run:()=>{const moved=requestReturn(s);return moved?'Return hoist engaged.':s.machine.returnPending?'Return queued. Leave the wheel first.':'Wheel already in its cradle.';}},
 {id:'works-safety',x:2580,y:456,radius:65,title:'SAFETY CRANK',ready:true,done:s.machine.safety,run:()=>{s.machine.safety=true;s.power=true;return 'Clock stopped. Crew lift running.';}}
 ];}
export function momentumSurfaces(s){const g=s.machine;return [...s.level.floors,...s.level.platforms,{x:2420,y:414,w:80,support:'furnace-head'},...g.tiles.filter(t=>t.t<.9&&t.drop===0).map(t=>({x:t.x,y:t.y+Math.min(2,t.t*2),w:t.w,support:'tile-'+t.x})),g.carrier];}
function advanceBall(s,input,dt){
 const g=s.machine,b=g.ball,old={x:b.x,y:b.y};
 if(b.mode==='return'){
  const targets=[[b.x,1064],[680,1064],[680,664],[480,664]],target=targets[b.returnStage],dx=target[0]-b.x,dy=target[1]-b.y,d=Math.hypot(dx,dy);
  b.v=approach(b.v,Math.min(200,Math.sqrt(2*360*d)),360*dt);const travel=Math.min(d,b.v*dt);if(d){b.x+=dx/d*travel;b.y+=dy/d*travel;}
  if(travel===d){b.returnStage++;b.v=0;if(b.returnStage===4){b.mode='cradle';b.p=480;b.branch='upper';g.pushStarted=false;}}
 }else if(b.mode==='cradle'){
  const o=s.heroes[2],contact=o.ground&&!o.shieldUp&&o.face===1&&Math.abs(o.y+44-720)<3&&o.x+42>=b.x-BALL_RADIUS-3&&o.x<b.x;
  if(s.active===2&&input.right&&contact){b.v=approach(b.v,70,300*dt);b.p+=b.v*dt;g.pushStarted=true;}
  else b.v=approach(b.v,0,250*dt);
  Object.assign(b,spherePose(b.p,'upper'));if(b.p>=520)b.mode='rolling';
 }else if(b.mode==='rolling'){
  const r=railPoint(b.p,b.branch),arc=Math.hypot(1,r.slope);b.v=Math.max(0,b.v+(40*r.slope/arc-.12)*dt);const prev=b.p;b.p+=b.v/arc*dt;
  if(prev<1000&&b.p>=1000)b.branch=g.guide>.55?'upper':'lower';
  const end=b.branch==='upper'?1800:1500;b.p=Math.min(end,b.p);Object.assign(b,spherePose(b.p,b.branch));
  if(b.p===end){b.mode='caught';b.caughtAt=s.time;g.catchEvent=(g.catchEvent||0)+1;b.v=0;}
 }
 b.angle+=Math.hypot(b.x-old.x,b.y-old.y)/BALL_RADIUS;g.cartX=b.x;
 for(const h of s.heroes)if(h.support==='momentum-ball'&&h.ground){h.x+=b.x-old.x+(b.x-old.x)*.18;h.y+=b.y-old.y;h.prevY+=b.y-old.y;}
 return old;
}
function advanceLift(s,dt){const c=s.machine.carrier;if(!s.machine.safety)return;
 if(c.pause>0){c.pause=Math.max(0,c.pause-dt);return;}const target=c.dir<0?508:1120,d=target-c.y,old=c.y;
 c.v=approach(c.v,Math.min(150,Math.sqrt(480*Math.abs(d))),240*dt);c.y+=Math.sign(d)*Math.min(Math.abs(d),c.v*dt);
 for(const h of s.heroes)if(h.support===c.support&&h.ground&&Math.abs(h.y+44-old)<3){h.y+=c.y-old;h.prevY+=c.y-old;}
 if(c.y===target){c.v=0;c.dir*=-1;c.pause=3;}
}
function hazards(s,dt){const g=s.machine;if(!g.highReached||g.safety)return;
 g.clock+=dt;const before=g.fireClock;g.fireClock+=dt;
 if(Math.floor(before/2.8)!==Math.floor(g.fireClock/2.8))s.shots.push({kind:'fire',x:2428,y:454,v:-220,age:0});
 for(const h of s.heroes)if(laserPhase(g.clock)==='live'&&Math.abs(h.x-2160)<20&&h.y<508&&h.y+44>242){
  const o=s.heroes[2];if(!(o.shieldUp&&Math.abs(o.x-2160)<24&&h.y>=o.y-38&&h.y+44<=508))damage(s,h,1);
 }
}
function advanceShots(s,dt){const g=s.machine;
 for(const p of s.shots){const px=p.x,py=p.y;p.x+=p.v*dt;p.age=(p.age||0)+dt;
  if(p.kind==='arrow'&&segmentHit(px,py,p.x,p.y,{x:958,y:920,w:24,h:24})){p.dead=true;g.guideClink=(g.guideClink||0)+1;}if(p.kind==='fire'){
   const shield=shieldHit(s.heroes[2],p,px,py),body=s.heroes.map(h=>({h,hit:segmentHit(px,py,p.x,p.y,{x:h.x-24,y:h.y-14,w:48,h:72})})).filter(x=>x.hit).sort((a,b)=>a.hit.t-b.hit.t)[0];
   if(shield&&(!body||shield.t<=body.hit.t)){p.dead=true;continue;}if(body){damage(s,body.h,1);p.dead=true;continue;}
   if(p.v<0&&px>=2026&&p.x<=2026){p.x=2026+(2026-p.x);p.v=220;g.bumperAt=s.time;}
  }
 }s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<3400&&p.age<12);
}
export function momentumStep(s,input,dt){
 s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);const g=s.machine,a=s.heroes[s.active];for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);
 prepareMotion(s,input,dt);startBash(s,dt);if(g.returnPending&&!s.heroes.some(h=>h.support==='momentum-ball'&&h.ground)){g.returnPending=false;requestReturn(s);}
 const padFace=2020;
 if(a.id===0&&input.jump&&!a.ground&&a.x>=padFace+14&&a.x<=padFace+24&&a.y+44>440&&a.y<508&&s.time-(a.wallBounceAt??-10)>.25){
  a.vy=-540;a.vx=280;a.moveX=280*dt;a.face=1;a.support=null;a.jumpBuffer=0;a.wallBounceAt=s.time;g.bumperAt=s.time;
 }
 if(input.interact){const obj=momentumObjects(s).find(o=>Math.abs(a.x-o.x)<o.radius&&Math.abs(a.y-o.y)<60);if(obj)s.feedback={message:obj.run(),sequence:(s.feedback?.sequence||0)+1};}
 if(a.id===1&&input.sword&&s.cooldown===0){a.swing=.24;s.cooldown=.3;if((970-a.x)*a.face>=0&&Math.abs(a.x-970)<85&&Math.abs(a.y+20-932)<40){g.guideHold=2;g.steerHit++;}}
 if(a.id===0&&a.bash>.12&&(970-a.x)*a.face>=0&&Math.abs(a.x-970)<60&&Math.abs(a.y+20-932)<40){g.guideHold=2;g.steerHit++;}
 if(a.id===1&&input.action&&s.cooldown===0){a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580});}
 g.guideHold=Math.max(0,g.guideHold-dt);g.guide=approach(g.guide,g.guideHold>0?1:0,dt/.25);
 const riders=new Set(s.heroes.filter(h=>h.support==='momentum-ball'&&h.ground));const oldBall=advanceBall(s,input,dt);
 const liftRiders=s.heroes.filter(h=>h.support==='momentum-lift'&&h.ground);advanceLift(s,dt);
 const climbers=[];for(const h of s.heroes){const l=ladderAtHero(s.level,h);if(h===a){if((input.up||input.down)&&l)h.climbing=true;if(input.left||input.right||input.jump)h.climbing=false;}
  if(h.climbing&&l){climbers.push({h,l,y:Math.max(l.top-44,Math.min(l.bottom-44,h.y+(h===a?Number(!!input.down)-Number(!!input.up):0)*150*dt))});h.moveX=0;h.vy=0;}}
 integrateMotion(s,momentumSurfaces(s),[{x:1964,top:440,bottom:508,w:s.time-g.bumperAt<.1?52:s.time-g.bumperAt<.24?94:56,on:true},{x:2420,top:414,bottom:508,w:80,on:true}],dt);
 const b=g.ball;
 for(const h of s.heroes){if(h.climbing)continue;const crown=sphereCrown(b,h.x),oldCrown=sphereCrown({...b,...oldBall},h.prevX);
  if(crown!==null&&Math.abs(h.x-b.x)<BALL_RADIUS-8&&h.vy>=0&&((riders.has(h)&&h.y+44>=crown-4)||(oldCrown!==null&&h.prevY+44<=oldCrown+4&&h.y+44>=crown))){h.y=crown-44;h.vy=0;h.ground=true;h.support='momentum-ball';}
  else {const side=h.x<b.x?-1:1,reach=h.id===2&&!h.shieldUp&&h.face===1&&side<0?42:16;
   if(Math.abs(h.x-b.x)<BALL_RADIUS+reach&&h.y+44>b.y-10&&h.y<b.y+BALL_RADIUS-4){h.x=b.x+side*(BALL_RADIUS+reach);h.vx=0;}}
 }
 for(const h of liftRiders)if(h.ground&&Math.abs(h.y+44-g.carrier.y)<2&&h.x>g.carrier.x-14&&h.x<g.carrier.x+g.carrier.w+14)h.support=g.carrier.support;
 for(const {h,l,y}of climbers){h.x=l.x;h.y=y;h.vy=0;h.ground=true;h.support='ladder';h.climbMoving=h===a&&(input.up||input.down);}
 if(!g.highReached&&s.heroes.some(h=>h.ground&&h.x>=1780&&h.x<=2020&&Math.abs(h.y+44-508)<4))g.highReached=true;
 if(g.highReached){g.recovery=approach(g.recovery,1,dt/2);const l={x:1900,top:508,bottom:508+612*g.recovery};s.level.ladders=[...momentumLevel.ladders,l];}
 for(const t of g.tiles){
  if(t.restoring){t.drop=approach(t.drop,0,300*dt);t.vy=0;if(t.drop===0){t.t=approach(t.t,0,dt*6);if(t.t===0)t.restoring=false;}}
  else if(t.t>0||s.heroes.some(h=>h.ground&&h.x>t.x-14&&h.x<t.x+t.w+14&&Math.abs(h.y+44-t.y)<5)){
   if(t.t===0)g.tileEvent++;t.t+=dt;if(t.t>=.9){t.vy+=900*dt;t.drop=Math.min(612,t.drop+t.vy*dt);}if(t.t>=4)t.restoring=true;
  }
 }
 hazards(s,dt);advanceShots(s,dt);
 s.won=!s.failed&&g.safety&&s.heroes.every(h=>Math.abs(h.x-3260)<85&&Math.abs(h.y+44-508)<4);
}
