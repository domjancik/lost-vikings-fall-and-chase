import {prepareMotion,integrateMotion} from '../../core/movement.js?v=orbit113';

import {pickupItem,useItem,message} from '../../core/inventory.js?v=alehall135';

import {damage} from '../../core/health.js?v=orbit113';

import {segmentHit,shieldControls} from '../../core/projectile-collision.js?v=orbit113';

import {startBash,bashImpact} from '../../core/bash.js?v=orbit113';

import {ladderAtHero} from '../../core/ladder-context.js?v=orbit113';

import {magneticMotion,resolveSteelCollisions,magneticPoint,localHeroPoint,recoverFreeRotation,magneticRails} from './magnetic.js?v=orbit120';

const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);

// Keep the established travel duration, but start and arrive at rest. Simulation
// stays continuous; the renderer snaps the resulting position to the native grid.
function travel(body,key,target,speed,dt){
 if(body[key]===target)return;
 const tracks=body.travel||(body.travel={});let track=tracks[key];
 if(!track||track.target!==target)track=tracks[key]={start:body[key],target,time:0,duration:Math.abs(target-body[key])/speed};
 track.time=Math.min(track.duration,track.time+dt);const t=Math.min(1,track.time/track.duration);
 body[key]=t>=1-1e-10?target:track.start+(target-track.start)*t*t*(3-2*t);
}
function parkOperator(h){h.vx=0;h.moveX=0;h.magV=0;h.bash=0;h.bashBuffer=0;}
const floor=(x,y,w)=>({x,y,w});

export const orbitMount=p=>({x:p.x+Math.sin(p.angle)*p.h/2,y:p.y-Math.cos(p.angle)*p.h/2});

export const orbitLevel={name:'SCRAP ORBIT',subtitle:'Iron remembers the underside.',mechanic:'orbit',worldWidth:3560,worldTop:80,worldBottom:1240,deathY:1320,

 story:['Rejected storms leave iron behind. A magnetic sorter turns it above the furnace recovery gallery.','Its shoes still cling to the service rails. The departure crane waits behind a cracked cover.'],

 hint:'Pick up magnetic shoes and use their bag slot to wear them. Olaf pushes roller frames into the coils. Shoes follow steel rails around the underside. Strike all three spring switches within one revolution. Cross the open service gap on the overhead rail. Shoot its short cable to release the crane brake, then round the far end to reach the second carrier. Bash the cracked crane cover, use the panel and steer the hook; action clamps, alt releases, use leaves.',

 floors:[floor(0,1180,3560),floor(0,1000,980),floor(1690,650,180),floor(2060,650,380),floor(2860,300,700)],platforms:[],ladders:[{x:260,top:1000,bottom:1180},{x:1780,top:650,bottom:1180}],exit:{x:3440,y:300,w:160}};

export function setupOrbit(s){

 s.campaign='cycle';s.round=8;s.level=orbitLevel;s.crate=false;s.turret=false;s.shots=[];s.items=[0,1,2].map(n=>({id:'magnetic-shoes-'+n,type:'magneticShoes',x:120+n*55,y:956}));

 for(const h of s.heroes)Object.assign(h,{x:100+h.id*55,y:956,vx:0,vy:0,ground:true,support:null,rotation:0,magnet:null,boots:false});

 s.machine={plates:[{id:0,x:780,y:1024,w:344,h:48,capRx:16,angle:0,phase:'ground',charge:0,vx:0,vy:0},{id:1,x:2280,y:674,w:344,h:48,capRx:16,angle:0,phase:'ground',charge:0,vx:0,vy:0}],sequence:0,sequenceUntil:0,sequenceStartAngle:null,sequenceRecoverUntil:0,resetAt:-100,releaseAt:null,releasePose:0,brakePose:0,ropeCut:[false,false,false,false,false],ropePose:[0,0,0,0,0],ropeAperture:[0,0,0,0,1],panelOpen:false,panelPose:0,operator:null,roofs:[{id:2,x:1890,y:552,w:344,h:48,capRx:16,angle:0,phase:'roof',vx:0,vy:0}],hook:{x:2540,y:380,vx:0,vy:0,plateId:null,offset:null,grab:0,attempts:0},hookDocked:false,exitPose:0,ladderPose:0,blocks:0,safety:false,

 debris:[{id:0,cx:1120,cy:674,rx:230,ry:180,clock:0,phase:'rest',x:1510,y:890,angle:0},{id:1,cx:2540,cy:444,rx:220,ry:140,clock:2,phase:'rest',x:2800,y:620,angle:0}]};

 for(const d of s.machine.debris){d.angle=d.clock*Math.PI*2/7.8;d.x=d.cx+Math.cos(d.angle)*d.rx;d.y=d.cy+Math.sin(d.angle)*d.ry;}

 s.itemAction=(type,h)=>{if(type!=='magneticShoes')return false;h.boots=!h.boots;h.bootPulse=.7;message(s,h.boots?'MAGNETS ON · soles lit. Nearby overhead steel pulls you up.':'MAGNETS OFF · free footing.');return true;};

}

export function orbitSurfaces(s){return[...s.level.floors,...s.level.platforms,...magneticRails(s).filter(p=>Math.abs(Math.sin(p.angle))<.015).map(p=>({x:p.x-(p.w-2*p.capRx)/2,y:p.y-p.h/2,w:p.w-2*p.capRx,support:'orbit-'+p.id}))];}

export function orbitObjects(s){const g=s.machine;return[{id:'orbit-crane-panel',x:1730,y:606,radius:72,title:'DEPARTURE CRANE',reason:!g.panelOpen?'A cracked ceramic cover blocks the panel.':g.brakePose<.999?'BRAKE LOCKED · cut the short tension cable above the gallery.':'Arrows steer the hook. Action clamps, alt releases, use leaves.',ready:g.panelOpen&&g.brakePose>=.999,done:g.hookDocked,

 run:()=>{if(!g.panelOpen)return 'The cracked ceramic cover needs a running bash.';if(g.brakePose<.999)return 'BRAKE LOCKED · Baleog must cut the short tension cable above the gallery.';g.operator=g.operator===s.active?null:s.active;if(g.operator!==null)parkOperator(s.heroes[g.operator]);return g.operator===null?'Crane controls released.':g.brakePose<1?'The gantry brake is still clamped. Its short tension rope hangs above the gallery.':'Crane controls engaged.';}}];}

const restraintOrder=[0,2,3];

function ropeCommand(s,n){const g=s.machine;if(n===4)return true;if(n===1)return g.hookDocked&&s.time%5.4<2.4;const index=restraintOrder.indexOf(n),angle=g.plates[0].angle-index*Math.PI/2;return !g.ropeCut[n]&&g.plates[0].phase==='orbit'&&Math.abs(Math.sin(angle/2))<.28;}

export function orbitRope(s,n){const g=s.machine,[x,y]=[[1360,626],[3180,248],[1168,914],[880,722],[2110,600]][n];return{x,y,w:n===4?16:n===1?36:64,h:n===4?24:n===1?80:64,kind:n===4?'brake-rope':n===1?'exit-rope':'impact-switch',aperture:g.ropeAperture[n],open:g.ropeAperture[n]>=.9999&&ropeCommand(s,n),cut:g.ropeCut[n]};}

function strikeRope(s,n,from,to){const r=orbitRope(s,n);if(r.cut||!segmentHit(from.x,from.y,to.x,to.y,{x:r.x-r.w/2,y:r.y-r.h/2,w:r.w,h:r.h}))return false;

 if(r.open){const g=s.machine;g.ropeCut[n]=true;
  if(n===4){g.brakeReleasedAt=s.time;message(s,'The short cable parts. The crane brake springs open.');}
  else if(n===1)message(s,'Exit restraint released. The reunion ladder descends.');
  else{g.lastPawlAt=s.time;g.lastSwitch=n;if(g.sequence===0)g.sequenceStartAngle=g.plates[0].angle;g.sequence=restraintOrder.filter(id=>g.ropeCut[id]).length;g.sequenceUntil=s.time+(Math.PI*2-(g.plates[0].angle-g.sequenceStartAngle))/(Math.PI/8);if(g.sequence===3){g.releaseAt=s.time;g.plates[0].phase='release';message(s,'Three switches latched. The retaining assembly releases.');}else message(s,g.sequence+'/3 latched · complete the set before one full revolution.');}
 }return true;

}

function mechanisms(s,input,dt){const g=s.machine,o=s.heroes[2];



 g.pushContact=null;g.hook.grab=Math.max(0,(g.hook.grab||0)-dt);for(const h of s.heroes)h.bootPulse=Math.max(0,(h.bootPulse||0)-dt);

 for(const p of g.plates){const old={x:p.x,y:p.y},target=p.id===0?1120:2540,base=p.id===0?1024:674;

  if(p.phase==='ground'&&s.active===2&&!o.boots&&input.right&&o.x<p.x-p.w/2&&o.x+32+Math.max(0,o.moveX)>=p.x-p.w/2-2&&Math.abs(o.y+44-(base-p.h/2))<12){const dx=Math.min(target-p.x,Math.max(0,o.moveX));o.x=p.x-p.w/2-32+dx;p.x+=dx;o.moveX=0;g.pushContact=p.id;if(p.x>=target-.01){p.x=target;p.phase='charge';}}

  if(p.phase==='charge'){p.charge=Math.min(1,p.charge+dt/2);if(p.charge===1)p.phase='lift';}

  if(p.phase==='lift'){const y=p.id===0?674:444;travel(p,'y',y,120,dt);if(p.y===y)p.phase=p.id===0?'orbit':'float';}

  if(p.phase==='orbit'){p.spinV=approach(p.spinV||0,Math.PI/8,Math.PI/8*2.5*dt);p.angle+=p.spinV*dt;}
  if(p.id===0)if(g.sequence>0&&g.sequence<3&&g.plates[0].angle-g.sequenceStartAngle>=Math.PI*2){for(const n of restraintOrder)g.ropeCut[n]=false;g.sequence=0;g.sequenceStartAngle=null;g.sequenceUntil=0;g.resetAt=s.time;message(s,'One revolution elapsed. The three spring switches return.');}
  if(p.phase==='release'){g.releasePose=Math.min(1,g.releasePose+dt/1.1);if(g.releasePose===1)p.phase='dock';}

  if(p.phase==='float'&&g.hook.plateId!==p.id)p.angle=approach(p.angle,Math.sin(s.time*.45)*.18,.2*dt);

  if(p.phase==='dock'){travel(p,'angle',Math.round(p.angle/(Math.PI*2))*Math.PI*2,.75,dt);if(Math.abs(Math.sin(p.angle/2))<.001){p.angle=0;travel(p,'x',1610,150,dt);if(p.x===1610)p.phase='parked';}}

  p.vx=(p.x-old.x)/dt;p.vy=(p.y-old.y)/dt;

  for(const h of s.heroes)if(!h.magnet&&h.support==='orbit-'+p.id){h.x+=p.x-old.x;h.y+=p.y-old.y;}

 }

 const operator=g.operator===null?null:s.heroes[g.operator];

 if(operator&&(g.operator!==s.active||operator.dead||operator.hurt>0||Math.abs(operator.x-1730)>76||Math.abs(operator.y+44-650)>18))g.operator=null;

 if(g.operator!==null&&g.brakePose>=.999){const k=g.hook,kx=k.x,ky=k.y;k.vx=approach(k.vx,(Number(!!input.right)-Number(!!input.left))*170,500*dt);k.vy=approach(k.vy,(Number(!!input.down)-Number(!!input.up))*140,500*dt);k.x=Math.max(2100,Math.min(3040,k.x+k.vx*dt));k.y=Math.max(260,Math.min(600,k.y+k.vy*dt));

  if(input.action){k.grab=.42;k.attempts=(k.attempts||0)+1;}

  if(input.action&&k.plateId===null){const p=g.plates[1],eye=orbitMount(p);if(['float','hooked'].includes(p.phase)&&Math.hypot(k.x-eye.x,k.y-eye.y)<30){k.plateId=p.id;k.offset={x:p.x-k.x,y:p.y-k.y};p.phase='hooked';message(s,'CARRIER CLAMPED · steer UP and RIGHT to the illuminated receiving socket.');}}

  if(k.plateId!==null){const p=g.plates[k.plateId];p.x=k.x+k.offset.x;p.y=k.y+k.offset.y;p.vx=(k.x-kx)/dt;p.vy=(k.y-ky)/dt;p.angle=approach(p.angle,0,.3*dt);

   if(Math.abs(p.x-2900)<52&&Math.abs(p.y-324)<46){p.phase='seating';g.hookDocked=true;k.plateId=null;message(s,'CARRIER SEATED · leave controls with USE. Cut the pulsing exit restraint on the right.');}}

  if(input.sword||input.alt){if(k.plateId!==null){g.plates[k.plateId].phase='float';k.plateId=null;}k.offset=null;}

 }else{g.hook.vx=approach(g.hook.vx,0,500*dt);g.hook.vy=approach(g.hook.vy,0,500*dt);}

 const p=g.plates[1];if(p.phase==='seating'){travel(p,'x',2900,70,dt);travel(p,'y',324,70,dt);travel(p,'angle',0,.3,dt);if(p.x===2900&&p.y===324)p.phase='parked';}

 g.brakePose=approach(g.brakePose,g.ropeCut[4]?1:0,dt/.7);g.panelPose=approach(g.panelPose,g.panelOpen?1:0,dt/.65);for(let n=0;n<5;n++){g.ropePose[n]=approach(g.ropePose[n],g.ropeCut[n]?1:0,dt/.65);g.ropeAperture[n]=approach(g.ropeAperture[n],ropeCommand(s,n)?1:0,dt/.2);}g.exitPose=approach(g.exitPose,g.ropeCut[1]?1:0,dt);g.ladderPose=approach(g.ladderPose,g.ropeCut[1]?1:0,dt/1.2);

 s.level={...orbitLevel,ladders:[...orbitLevel.ladders,...(g.ladderPose>0?[{x:2980,top:300,bottom:300+880*g.ladderPose}]:[])]};

}

function arrows(s,dt){for(const p of s.shots){const ox=p.x,oy=p.y;p.x+=(p.vx??p.v??0)*dt;p.y+=(p.vy||0)*dt;p.life=(p.life??4)-dt;

 for(const steel of magneticRails(s)){const c=Math.cos(steel.angle),sn=Math.sin(steel.angle),local=(x,y)=>({x:(x-steel.x)*c+(y-steel.y)*sn,y:-(x-steel.x)*sn+(y-steel.y)*c}),a=local(ox,oy),b=local(p.x,p.y);if(segmentHit(a.x,a.y,b.x,b.y,{x:-steel.w/2+(steel.capRx||0),y:-steel.h/2,w:steel.w-2*(steel.capRx||0),h:steel.h})){p.dead=true;break;}}
 if(p.dead)continue;for(let n=0;n<5;n++)if(strikeRope(s,n,{x:ox,y:oy},p)){p.dead=true;break;}

 }s.shots=s.shots.filter(p=>!p.dead&&p.life>0&&p.x>0&&p.x<3560&&p.y>0&&p.y<1300);}

function debris(s,dt){for(const d of s.machine.debris){const oldX=d.x,oldY=d.y;d.clock+=dt;d.escape=approach(d.escape||0,(d.id===0?s.machine.sequence===3:s.machine.hookDocked)?320:0,100*dt);d.phase='active';d.deflectGrace=Math.max(0,(d.deflectGrace||0)-dt);d.angle+=(d.direction||1)*dt*Math.PI*2/7.8;const released=d.id===0?s.machine.sequence===3:s.machine.hookDocked;
 if(released&&!d.release){const length=Math.hypot(oldX-d.cx,oldY-d.cy);d.release={at:s.time,x:oldX,y:oldY,vx:(oldX-d.cx)/length*280+(d.vx||0)*.2,vy:(oldY-d.cy)/length*280+(d.vy||0)*.2};}
 if(d.release){const t=s.time-d.release.at;d.x=d.release.x+d.release.vx*t;d.y=d.release.y+d.release.vy*t-t*t*40;}
 else{d.x=d.cx+Math.cos(d.angle)*d.rx;d.y=d.cy+Math.sin(d.angle)*d.ry;}
 d.vx=(d.x-oldX)/dt;d.vy=(d.y-oldY)/dt;

 if(d.phase==='active'&&!s.machine.safety)for(const h of s.heroes){if(h.dead||d.deflector===h.id&&d.deflectGrace>0||Math.hypot(h.x-d.x,h.y+22-d.y)>42)continue;const local=localHeroPoint(h,h.face*24,-24),c=Math.cos(h.rotation||0),sn=Math.sin(h.rotation||0),front=((d.x-h.x)*c+(d.y-h.y-22)*sn)*h.face,approach=(d.vx*c+d.vy*sn)*h.face;

  if(h.id===2&&!h.shieldUp&&front>0&&approach<0&&Math.hypot(local.x-d.x,local.y-d.y)<50){s.machine.blocks++;d.direction=-(d.direction||1);d.deflectGrace=.3;d.deflector=h.id;continue;}damage(s,h,1);}

 }}

export function orbitStep(s,input,dt){const g=s.machine,a=s.heroes[s.active];s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);if(a.id===2)shieldControls(a,input);

 for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);

 const operating=g.operator!==null&&g.operator===s.active;prepareMotion(s,operating?{}:input,dt);startBash(s,dt);

 if(a.id===0&&a.bash>.12&&!g.panelOpen&&Math.abs(a.x-1730)<75&&Math.abs(a.y+44-650)<12){g.panelOpen=true;bashImpact(s,1730,614);message(s,'The cracked ceramic cover breaks, revealing the crane controls.');}

 if(input.item)useItem(s);

 if(input.interact){if(g.operator===s.active)g.operator=null;else if(!pickupItem(s)){const object=orbitObjects(s).find(o=>Math.abs(a.x-o.x)<o.radius&&Math.abs(a.y-o.y)<60);if(object)message(s,object.run());}}

 if(!operating&&a.id===1&&input.sword&&s.cooldown===0){a.swing=.24;s.cooldown=.3;const from=localHeroPoint(a,a.face*18,-24),to=localHeroPoint(a,a.face*84,-24);for(let n=0;n<5;n++)strikeRope(s,n,from,to);}

 if(!operating&&a.id===1&&input.action&&s.cooldown===0){const muzzle=localHeroPoint(a,a.face*25,-24),angle=a.rotation||0;a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:muzzle.x,y:muzzle.y,v:Math.cos(angle)*a.face*580,vx:Math.cos(angle)*a.face*580,vy:Math.sin(angle)*a.face*580,life:4});}

 if(g.operator!==null)parkOperator(s.heroes[g.operator]);
 mechanisms(s,input,dt);const attached=magneticMotion(s,operating?{}:input,dt),attachedWalk=new Map(attached.map(h=>[h,h.walk])),climbs=[];

 for(const h of s.heroes)if(!h.magnet){const ladder=ladderAtHero(s.level,h),active=h.id===s.active;if(active&&!operating){if((input.up||input.down)&&ladder)h.climbing=true;if(input.left||input.right||input.jump)h.climbing=false;}

  if(h.climbing&&ladder){const dir=active&&!operating?Number(!!input.down)-Number(!!input.up):0;climbs.push({h,x:ladder.x,y:Math.max(ladder.top-44,Math.min(ladder.bottom-44,h.y+dir*150*dt))});h.moveX=0;h.vy=-1250*dt;}}

 const shieldUp=s.heroes[2].shieldUp;if(Math.abs(s.heroes[2].rotation||0)>.05)s.heroes[2].shieldUp=false;

 integrateMotion(s,orbitSurfaces(s),[{x:3310,w:60,top:200,bottom:300,on:g.exitPose<.99}],dt);s.heroes[2].shieldUp=shieldUp;resolveSteelCollisions(s);

 for(const h of attached){h.walk=attachedWalk.get(h);magneticPoint(h,magneticRails(s).find(p=>p.id===h.magnet.plateId));}for(const {h,x,y}of climbs){h.x=x;h.y=y;h.vy=0;h.ground=true;h.support='ladder';h.climbMoving=h.id===s.active&&(input.up||input.down);}

 for(const h of s.heroes)recoverFreeRotation(h,dt);

 arrows(s,dt);debris(s,dt);if(g.operator!==null&&(s.heroes[g.operator].dead||s.heroes[g.operator].hurt>0))g.operator=null;s.power=g.exitPose===1;s.won=!s.failed&&s.power&&s.heroes.every(h=>Math.abs(h.x-3440)<80&&Math.abs(h.y+44-300)<5);

}
