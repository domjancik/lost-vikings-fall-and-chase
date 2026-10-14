import {prepareMotion,integrateMotion} from '../../core/movement.js?v=warden89';
import {startBash,bashImpact} from '../../core/bash.js?v=warden89';
import {segmentHit} from '../../core/projectile-collision.js?v=warden89';
import {ladderAtHero} from '../../core/ladder-context.js?v=warden89';
import {stepWardenCombat} from './combat.js?v=warden91';
import {damage} from '../../core/health.js?v=warden89';
const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
const smooth=t=>{const p=Math.max(0,Math.min(1,t));return p*p*(3-2*p);};
export const wardenLevel={name:'THE FOURFOLD WARDEN',subtitle:'A shield under a step. A shoulder on a latch. An arrow through an eye.',
 story:['The archive has kept its cargo guardian awake for centuries. Its maintenance cradle is still locked beneath its optical engine.','The front knee was designed to yield, the eye to be serviced, and the cradle to carry people. It remembers none of this until someone makes it.'],
 hint:'Brace the descending fork with Olaf’s overhead shield. Jump from the left service stage onto the lowered spine; run into the spring plunger with Erik’s bash. Shoot the open eye from the right ledge. Board the released cradle by its short ladder and use its wheel. Either landing can recall it.',
 mechanic:'warden',worldWidth:3000,worldTop:100,worldBottom:1200,deathY:1230,
 floors:[{x:0,y:940,w:2200},{x:0,y:1120,w:3000}],
 platforms:[{x:500,y:760,w:400},{x:1880,y:700,w:130},{x:2200,y:500,w:800}],
 ladders:[{x:650,top:760,bottom:940},{x:1940,top:700,bottom:940},{x:400,top:940,bottom:1120},{x:2180,top:940,bottom:1120}],exit:{x:2800,y:500,w:160}};
export const WARDEN_PERIOD=6.5;
export const WARDEN_TRACK=[[1740,870],[2040,870],[2040,500],[2080,500]];
const knots=[0,300,670,710];
export function wardenCargoPose(distance){const d=Math.max(0,Math.min(710,distance));return d<=300?{x:1740+d,y:870}:d<=670?{x:2040,y:870-(d-300)}:{x:2040+d-670,y:500};}
export function setupWarden(s){
 s.level=wardenLevel;s.crate=false;s.turret=false;s.enemies=[];
 for(const h of s.heroes)Object.assign(h,{y:896,ground:true});
 s.machine={cycle:0,activeLeg:3,braceAge:0,fatigue:0,waves:[],laser:{phase:'cooldown',age:4,target:null},footY:940,footX:1490,kneel:0,braced:false,disabled:false,shutdown:0,release:0,
  exposure:0,shutter:0,stroke:0,capTimer:0,stampAt:-10,impactAt:-10,disabledAt:-10,
  cargo:{x:1740,y:830,w:300,support:'warden-lift',distance:0,target:0,speed:0,pause:0},lastShot:'',lensHit:0};
}
export function wardenSpineY(s,x){const g=s.machine;return 560+100*g.kneel+20*g.kneel*(x-920)/640;}
export function wardenLegJoint(hip,ankle,bend=1){
 const dx=ankle.x-hip.x,dy=ankle.y-hip.y,d=Math.max(.01,Math.hypot(dx,dy)),half=Math.min(147.99,d/2),off=Math.sqrt(148*148-half*half)*bend;
 return{x:(hip.x+ankle.x)/2+dy/d*off,y:(hip.y+ankle.y)/2-dx/d*off};
}
export function wardenGeometry(s){
 const g=s.machine,hips=[1028,1136,1488,1520],feet=[{x:980,y:940},{x:1120,y:940},{x:1660,y:940},{x:g.footX,y:g.footY}];
 for(let i=0;i<feet.length;i++)feet[i]={x:[980,1120,1660,1490][i],y:940};feet[g.activeLeg??3]={x:g.footX,y:g.footY};
 const legs=hips.map((x,i)=>{const hip={x,y:wardenSpineY(s,x)+112},foot=feet[i],ankle={x:foot.x,y:foot.y-48};return{id:i,far:i%2===0,hip,knee:wardenLegJoint(hip,ankle,i===2?1:-1),ankle,foot};});
 const spine=Array.from({length:8},(_,i)=>{const x=950+i*70;return{x,y:wardenSpineY(s,x),w:72,support:'warden-spine'};});
 return{legs,spine,body:{x:920,y:wardenSpineY(s,920),angle:Math.atan2(20*g.kneel,640)},
  eye:{x:1724,y:wardenSpineY(s,1560)-4},emitter:{x:1648,y:wardenSpineY(s,1560)-118},plunger:{x:1398+g.stroke*16,y:wardenSpineY(s,1380)-24},
  cargo:{...g.cargo},telegraph:!g.disabled&&!g.braced&&g.cycle%WARDEN_PERIOD<1.2};
}
export function wardenSurfaces(s){return[...s.level.floors,...s.level.platforms,...wardenGeometry(s).spine,...(s.machine.release===1?[s.machine.cargo]:[])];}
const feedback=(s,message)=>{s.feedback={message,sequence:(s.feedback?.sequence||0)+1};};
export function wardenObjects(s){const g=s.machine,c=g.cargo,ready=g.release===1;return[
 {id:'warden-lift-wheel',x:c.x+158,y:c.y-18,radius:100,title:'CRADLE HANDWHEEL',ready,done:false,reason:'The guardian’s cargo clamps are closed.',run:()=>{c.target=c.target===710?0:710;return c.target?'Cradle travelling to the upper landing.':'Cradle returning to the service floor.';}},
 {id:'warden-lower-call',x:1720,y:896,radius:65,title:'LOWER CRADLE CALL',ready,done:c.distance===0,run:()=>{c.target=0;return 'Lower landing requested.';}},
 {id:'warden-upper-call',x:2310,y:456,radius:65,title:'UPPER CRADLE CALL',ready,done:c.distance===710,run:()=>{c.target=710;return 'Upper landing requested.';}}
];}
function liftStep(s,dt){const c=s.machine.cargo;if(s.machine.release!==1)return;
 if(c.pause>0){c.pause=Math.max(0,c.pause-dt);return;}
 const dir=Math.sign(c.target-c.distance);if(!dir){c.speed=0;return;}
 const next=dir>0?knots.find(k=>k>c.distance+1e-7):[...knots].reverse().find(k=>k<c.distance-1e-7);
 const stop=dir>0?Math.min(next,c.target):Math.max(next,c.target),remaining=Math.abs(stop-c.distance);
 c.speed=approach(c.speed,Math.min(130,Math.sqrt(440*remaining)),220*dt);
 const travel=remaining<.12?remaining:Math.min(remaining,c.speed*dt);c.distance+=dir*travel;
 if(travel===remaining){c.distance=stop;c.speed=0;if(stop!==c.target)c.pause=.35;}
 Object.assign(c,wardenCargoPose(c.distance));
}
export function advanceWarden(s,dt){
 const g=s.machine,o=s.heroes[2],oldFoot=g.footY;g.fatigue=Math.max(0,(g.fatigue||0)-dt);
 if(g.disabled){g.braced=false;g.shutdown=Math.min(1,g.shutdown+dt/1.5);g.release=Math.min(1,g.release+dt/1.25);
  g.releaseFootY??=g.footY;g.footX=[980,1120,1660,1490][g.activeLeg??3]+64*smooth(g.shutdown*2);g.footY=g.releaseFootY+(940-g.releaseFootY)*smooth((g.shutdown-.35)/.65);
 }else{
  const holding=o.shieldUp&&o.shield&&!o.dead&&o.ground&&Math.abs(o.x-g.footX)<=24&&Math.abs(o.y+44-940)<3;
  if(g.braced)g.braceAge+=dt;
  if(g.braced&&(!holding||g.braceAge>=14)){g.braced=false;g.cycle=Math.floor(g.cycle/WARDEN_PERIOD)*WARDEN_PERIOD+4.5;g.fatigue=2;g.unload=.45;feedback(s,'Olaf cannot hold the load. Clear the foot!');}
  if(!g.braced){g.cycle+=dt;const p=g.cycle%WARDEN_PERIOD;g.activeLeg=[3,1,2,0][Math.floor(g.cycle/WARDEN_PERIOD)%4];g.footX=[980,1120,1660,1490][g.activeLeg];
   const lift=p<1.2?0:p<2.2?smooth((p-1.2)/1):p<4.5?1:p<5.2?1-smooth((p-4.5)/.7):0;
   g.unload=Math.max(0,(g.unload||0)-dt);if(g.unload===0)g.footY=approach(g.footY,940-180*lift,600*dt);
   const plane=o.y-36;
   if(holding&&g.fatigue===0&&g.footY>oldFoot&&oldFoot<=plane+2&&g.footY>=plane-2){g.footY=plane;g.braced=true;g.braceAge=0;feedback(s,'The fork caught the shield. The knee is yielding.');}
   else if(g.footY>oldFoot)for(const h of s.heroes)if(!h.dead&&Math.abs(h.x-g.footX)<42&&Math.abs(h.y+44-940)<5&&oldFoot<h.y+28&&g.footY>=h.y+28){damage(s,h,1);g.stampAt=s.time;}
   if(oldFoot<939&&g.footY>=939){g.slamAt=s.time;g.waves.push({x:g.footX,dir:-1,age:0},{x:g.footX,dir:1,age:0});}
  }
 }
 g.kneel=approach(g.kneel,g.disabled||g.braced?1:0,dt/(g.disabled||g.braced?1:1.4));
 g.capTimer=Math.max(0,g.capTimer-dt);g.stroke=approach(g.stroke,g.capTimer>0?1:0,dt/.3);
 g.exposure=Math.max(0,g.exposure-dt);g.shutter=approach(g.shutter,g.disabled||g.exposure>0?1:0,dt/.5);
 const c=g.cargo,old={x:c.x,y:c.y};
 if(g.disabled&&g.release<1)c.y=830+40*smooth(g.release);
 else if(g.disabled&&g.release===1&&c.distance===0&&c.target===0)c.y=870;
 liftStep(s,dt);
 for(const h of s.heroes)if(h.support==='warden-lift'&&h.ground&&!h.climbing){h.x+=c.x-old.x;h.y+=c.y-old.y;}
}
export function wardenArrow(s,p,oldX,newX){
 const g=s.machine,eye=wardenGeometry(s).eye;
 const head={x:1550,y:eye.y-92,w:190,h:184};if(!segmentHit(oldX,p.y,newX,p.y,head))return null;
 if(p.v<0&&Math.abs(p.y-eye.y)<=24){
  if(g.shutter>.97&&!g.disabled&&segmentHit(oldX,p.y,newX,p.y,{x:1716,y:eye.y-24,w:24,h:48})){
   g.disabled=true;g.disabledAt=s.time;g.lensHit=s.time;g.exposure=0;g.lastShot='lens';feedback(s,'Lens fractured. The cargo clamps are releasing.');return 'lens';
  }
 }
 g.lastShot='armor';g.impactAt=s.time;return 'armor';
}
export function wardenStep(s,input,dt){
 s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);const g=s.machine,a=s.heroes[s.active];
 for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);
 prepareMotion(s,input,dt);const oldSpine=s.heroes.filter(h=>h.support==='warden-spine'&&h.ground&&!h.climbing).map(h=>({h,y:wardenSpineY(s,h.x)}));
 advanceWarden(s,dt);for(const {h,y}of oldSpine)h.y+=wardenSpineY(s,h.x)-y;
 startBash(s,dt);const mechanism=wardenGeometry(s).plunger;
 if(a.bash>0&&!g.disabled&&a.face===1&&a.x+26+(a.moveX||0)>=mechanism.x&&a.prevX<mechanism.x&&Math.abs(a.y+20-mechanism.y)<38){
  g.capTimer=.8;g.exposure=8.5;g.impactAt=s.time;a.x=mechanism.x-26;a.vx=0;a.moveX=0;a.bash=0;bashImpact(s,mechanism.x,mechanism.y);feedback(s,'Impact latch held. The shutters are retracting.');
 }
 if(a.id===1&&input.sword&&s.cooldown===0){a.swing=.24;s.cooldown=.3;g.impactAt=s.time;}
 if(a.id===1&&input.action&&s.cooldown===0){a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580});}
 for(const p of s.shots){const old=p.x;p.x+=p.v*dt;const hit=wardenArrow(s,p,old,p.x);if(hit)p.dead=true;}
 s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<3000);
 if(input.interact){const object=wardenObjects(s).find(o=>o.ready&&Math.abs(a.x-o.x)<o.radius&&Math.abs(a.y-o.y)<65);if(object)feedback(s,object.run());}
 s.level={...wardenLevel,ladders:[...wardenLevel.ladders,...(g.release===1&&g.cargo.distance<1?[{x:g.cargo.x+20,top:870,bottom:940}]:[])]};
 const climbers=[];for(const h of s.heroes){if(h.id===s.active){const l=ladderAtHero(s.level,h);if((input.up||input.down)&&l)h.climbing=true;if(input.left||input.right||input.jump)h.climbing=false;}
  if(h.climbing){const l=ladderAtHero(s.level,h);if(!l){h.climbing=false;continue;}const dir=h.id===s.active?Number(!!input.down)-Number(!!input.up):0;climbers.push({h,l,y:Math.max(l.top-44,Math.min(l.bottom-44,h.y+dir*150*dt))});h.moveX=0;h.vy=0;}}
 const passengers=s.heroes.filter(h=>h.support==='warden-lift'),floor=wardenSurfaces(s);
 integrateMotion(s,floor,[{x:mechanism.x,w:22,top:mechanism.y-34,bottom:mechanism.y+34,on:!g.disabled}],dt);
 for(const {h,l,y}of climbers){h.x=l.x;h.y=y;h.vy=0;h.ground=true;h.support='ladder';h.climbMoving=h.id===s.active&&(input.up||input.down);}
 // The pitched walking rim is authoritative; preserve smooth carried contact.
 for(const {h}of oldSpine)if(!h.climbing&&h.vy>=0&&h.x>950&&h.x<1510&&Math.abs(h.y+44-wardenSpineY(s,h.x))<7){h.y=wardenSpineY(s,h.x)-44;h.ground=true;h.vy=0;h.support='warden-spine';}
 for(const h of passengers)if(h.ground&&!h.climbing&&h.x+14>g.cargo.x&&h.x-14<g.cargo.x+300&&Math.abs(h.y+44-g.cargo.y)<3)h.support='warden-lift';
 stepWardenCombat(s,dt);
 s.power=g.disabled;s.won=!s.failed&&g.disabled&&s.heroes.every(h=>Math.abs(h.x-2800)<80&&Math.abs(h.y+44-500)<4);
}
