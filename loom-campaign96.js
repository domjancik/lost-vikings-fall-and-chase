import {prepareMotion,integrateMotion} from './movement.js?v=loom96';
import {shieldHit,segmentHit} from './projectile-collision.js?v=loom96';
import {ladderAtHero} from './ladder-context.js?v=loom96';
import {damage} from './health.js?v=loom96';
import {LOOM_ART} from './loom-art-layout96.js?v=loom96';
import {LOOM_GUIDE} from './loom-guide98.js?v=loom98';
import {startBash} from './bash.js?v=loom96';
const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
export const loomGuides=[{x:1640,y:720},{x:2210,y:722}];
export const loomTargets=[{x:1390,y:716},{x:1830,y:716}];
export function loomTargetPose(s,n){const p=loomTargets[n];return{...p,y:p.y-(n===0?s.machine.latchPose*64:0)};}
export const loomLevel={name:'THE STORM LOOM',subtitle:'Three hands mend the sky.',
 story:['The arcade has stopped drawing weather. It weaves it, one sky at a time.','A loose thread has reached the great loom. Its last storm will keep repeating until someone carries the pattern through.'],
 hint:'A shield across the relief exhaust fills the reservoir. Ride the piston to the bow latches. Use Olaf’s raised shield to reach the bobbin deck. Carry the bobbin through both guide apertures, then dock it at the winding drum. The clutch target buys time for the second shuttle. The final ratchet holds the door for everyone.',
 mechanic:'loom',worldWidth:3200,worldTop:0,worldBottom:1320,deathY:1360,
 floors:[{x:0,y:1120,w:3200}],platforms:[{x:720,y:1020,w:220},{x:970,y:880,w:300},{x:1200,y:740,w:390},{x:1690,y:880,w:140},{x:2320,y:880,w:260}],
 ladders:[{x:790,top:1020,bottom:1120}],exit:{x:3050,y:1120,w:180}};
export function setupLoom(s){
 s.campaign='cycle';s.level=loomLevel;s.crate=false;s.turret=false;s.enemies=[];
 for(const h of s.heroes){h.y=1076;h.ground=true;h.shield=h.id===2?h.shield:undefined;}
 s.machine={pressure:0,blocked:0,jetEnd:900,drive:0,phase:0,released:false,latchPose:0,clutchUntil:-1,clutchPose:0,
  lift:{x:1040,y:1120,w:(LOOM_ART.lift.right-LOOM_ART.lift.left)*2,v:0,support:'loom-lift'},shuttle:{x:1260,y:880,w:(LOOM_ART.shuttle.right-LOOM_ART.shuttle.left)*2,support:'loom-shuttle'},shuttle2:{x:1960,y:860,w:(LOOM_ART.shuttle.right-LOOM_ART.shuttle.left)*2,support:'loom-shuttle2'},
  owner:null,bobbin:{x:1190,y:824},guides:0,docked:false,weave:0,exitLatched:false,exitPose:0,ladderPose:0};
}
const feedback=(s,message)=>{s.feedback={message,sequence:(s.feedback?.sequence||0)+1};};
export function loomExhaust(s){
 const o=s.heroes[2];let blocked=0,end=900;
 if(!o.dead&&!o.shieldUp)for(let n=-3;n<=3;n++){
  const y=1094+n*4,hit=shieldHit(o,{x:900,y,kind:'air'},500,y);
  if(hit){blocked++;end=Math.min(end,hit.x);}
 }
 return{blocked:blocked/7,end};
}
export const bobbinHand=h=>({x:h.x+h.face*22,y:h.y+12});
export function threadSweep(s,from,to){
 const g=s.machine,p=loomGuides[g.guides];if(!p||g.owner===null||g.docked||to.x<=from.x)return;
 if(from.x<=p.x&&to.x>=p.x){const t=(p.x-from.x)/(to.x-from.x),y=from.y+(to.y-from.y)*t;
  const accepted=Math.abs(y-p.y)<=LOOM_GUIDE.threadTolerance;
  g.threadAttempt={guide:g.guides,x:p.x,y,error:y-p.y,time:s.time,accepted};
  // Clearance is measured from the authored transparent opening eroded by
  // the full bobbin envelope. Four times the old tolerance, no rim cheating.
  if(accepted){g.guides++;feedback(s,g.guides===1?'The first thread is seated.':'The pattern has reached the winding drum.');}
  else feedback(s,'Thread missed the eyelet. Pass the bobbin through its opening.');
 }
}
export function loomObjects(s){const g=s.machine;return[
 {id:'loom-bobbin',x:1190,y:836,radius:60,title:g.owner===null?'THREAD BOBBIN':'BOBBIN TAKEN',ready:g.released&&g.latchPose===1&&g.owner===null,done:g.owner!==null,
  run:()=>{if(!g.released||g.latchPose!==1||g.owner!==null)return 'The bobbin is held by its shipping pawl.';g.owner=s.active;return 'Thread in hand.';}},
 {id:'loom-drum',x:2450,y:836,radius:70,title:'WINDING DRUM',ready:g.owner===s.active&&g.guides===2&&!g.docked,done:g.docked,
  run:()=>{if(g.owner!==s.active||g.guides!==2)return 'The thread has not reached both guides.';g.docked=true;return 'The drum is taking up the repaired sky.';}}
];}
export function loomSurfaces(s){return[s.machine.lift,s.machine.shuttle,s.machine.shuttle2,...s.level.floors,...s.level.platforms];}
export function loomBeater(s,n){
 const t=((s.machine.phase+n*.8)%(Math.PI*2))/(Math.PI*2)*4.8,smooth=t=>t*t*(3-2*t);let bottom=610;
 if(t>=2.8&&t<3.25)bottom=610+270*smooth((t-2.8)/.45);
 else if(t>=3.25&&t<3.55)bottom=880;
 else if(t>=3.55&&t<4.2)bottom=880-270*smooth((t-3.55)/.65);
 return{x:[1620,2140][n],bottom,warning:t>=2.2&&t<2.8,active:t>=2.8&&t<3.55};
}
function carry(s,p,old){for(const h of s.heroes)if(h.support===p.support&&h.ground&&!h.climbing){h.x+=p.x-old.x;h.y+=p.y-old.y;}}
export function loomStep(s,input,dt){
 const g=s.machine,a=s.heroes[s.active];s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);
 for(const h of s.heroes){h.swing=Math.max(0,(h.swing||0)-dt);h.bash=Math.max(0,(h.bash||0)-dt);}
 prepareMotion(s,input,dt);startBash(s,dt);const handBefore={...g.bobbin};
 const exhaust=loomExhaust(s);g.blocked=exhaust.blocked;g.jetEnd=exhaust.end;
 g.pressure=Math.max(0,Math.min(1,g.pressure+dt*(g.blocked*.34-(1-g.blocked)*.065)));
 g.drive=approach(g.drive,g.released&&g.pressure>.18?.62*g.pressure:0,dt*.6);g.phase+=g.drive*dt;
 const oldLift={...g.lift},target=1120-380*Math.min(1,g.pressure/.7),d=target-g.lift.y;
 g.lift.v=approach(g.lift.v,Math.sign(d)*Math.min(110,Math.sqrt(240*Math.abs(d))),dt*180);
 const travel=g.lift.v*dt;
 if(d*travel>=0&&Math.abs(travel)>=Math.abs(d)){g.lift.y=target;g.lift.v=0;}else g.lift.y+=travel;
 if(g.lift.y<=740||g.lift.y>=1120){g.lift.y=Math.max(740,Math.min(1120,g.lift.y));g.lift.v=0;}
 carry(s,g.lift,oldLift);
 const old={...g.shuttle},old2={...g.shuttle2};g.shuttle.x=1260+240*(1-Math.cos(g.phase));
 g.shuttle2.x=1960+175*(1-Math.cos(g.phase+.8));g.shuttle2.y=860+20*Math.sin(g.phase+.8);
 carry(s,g.shuttle,old);carry(s,g.shuttle2,old2);
 if(a.id===1&&input.sword&&s.cooldown===0){a.swing=.24;s.cooldown=.3;}
 if(a.id===1&&input.action&&s.cooldown===0){a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580});}
 for(const shot of s.shots){const x=shot.x;shot.x+=shot.v*dt;for(const n of [0,1]){const p=loomTargetPose(s,n);if(segmentHit(x,shot.y,shot.x,shot.y,{x:p.x-14,y:p.y-14,w:28,h:28})){
  shot.dead=true;if(n===0&&!g.released){g.released=true;feedback(s,'The bobbin pawl is withdrawn.');}if(n===1){g.clutchUntil=s.time+12;feedback(s,'The clutch is held open.');}break;
 }}}s.shots=s.shots.filter(p=>!p.dead&&p.x>=0&&p.x<3200);
 g.latchPose=approach(g.latchPose,g.released?1:0,dt*1.5);g.clutchPose=approach(g.clutchPose,s.time<g.clutchUntil?1:0,dt/.65);
 if(input.interact){const obj=loomObjects(s).find(o=>o.ready&&Math.abs(a.x-o.x)<o.radius&&Math.abs(a.y-o.y)<60);if(obj)feedback(s,obj.run());}
 const climbers=[];
 for(const h of s.heroes){const ladder=ladderAtHero(s.level,h);
  if(h.id===s.active){if((input.up||input.down)&&ladder)h.climbing=true;if(input.left||input.right||input.jump)h.climbing=false;}
  if(h.climbing&&ladder){const dir=h.id===s.active?Number(!!input.down)-Number(!!input.up):0;climbers.push({h,x:ladder.x,y:Math.max(ladder.top-44,Math.min(ladder.bottom-44,h.y+dir*150*dt))});h.moveX=0;h.vy=0;}
 }
 const riders=s.heroes.filter(h=>typeof h.support==='string'&&h.support.startsWith('loom-'));
 integrateMotion(s,loomSurfaces(s),[{x:1840,w:120,top:680,bottom:940-g.clutchPose*280,on:g.clutchPose<1},{x:2780,w:168,top:928,bottom:1120-g.exitPose*192,on:g.exitPose<1}],dt);
 for(const h of riders){const p=loomSurfaces(s).find(p=>p.support===h.support);if(p&&h.ground&&Math.abs(h.y+44-p.y)<2&&h.x+15>p.x&&h.x-15<p.x+p.w)h.support=p.support;}
 for(const {h,x,y}of climbers){h.x=x;h.y=y;h.vy=0;h.ground=true;h.support='ladder';h.climbMoving=h.id===s.active&&(input.up||input.down);}
 if(g.owner!==null&&!g.docked){const hand=bobbinHand(s.heroes[g.owner]),dx=hand.x-g.bobbin.x,dy=hand.y-g.bobbin.y,d=Math.hypot(dx,dy),move=Math.min(d,900*dt);
  if(d){g.bobbin.x+=dx/d*move;g.bobbin.y+=dy/d*move;}threadSweep(s,handBefore,g.bobbin);
 }
 if(g.docked){const dx=2450-g.bobbin.x,dy=794-g.bobbin.y,d=Math.hypot(dx,dy),move=Math.min(d,220*dt);if(d){g.bobbin.x+=dx/d*move;g.bobbin.y+=dy/d*move;}
  if(d<2)g.weave=Math.min(1,g.weave+dt*.35*g.pressure);if(g.weave===1)g.exitLatched=true;
 }
 g.exitPose=approach(g.exitPose,g.exitLatched?1:0,dt*.6);
 g.ladderPose=approach(g.ladderPose,g.exitLatched?1:0,dt*.8);
 s.level={...loomLevel,ladders:[...loomLevel.ladders,...(g.ladderPose>0?[{x:2520,top:880,bottom:880+240*g.ladderPose},{x:1550,top:740,bottom:740+380*g.ladderPose}]:[])]};
 for(let n=0;n<2;n++){const b=loomBeater(s,n);if(b.active)for(const h of s.heroes)if(!h.dead&&!(h.invulnerable>0)&&Math.abs(h.x-b.x)<(LOOM_ART.head.right-LOOM_ART.head.left)&&h.y+44>b.bottom-(LOOM_ART.head.bottom-LOOM_ART.head.top)*2&&h.y-22<b.bottom){damage(s,h,1);if(!h.dead){h.vy=140;h.x+=h.x<b.x?-18:18;h.ground=false;h.support=null;}}}
 s.power=g.exitLatched&&g.exitPose===1;s.won=!s.failed&&s.power&&s.heroes.every(h=>Math.abs(h.x-3050)<85&&Math.abs(h.y+44-1120)<4);
}
