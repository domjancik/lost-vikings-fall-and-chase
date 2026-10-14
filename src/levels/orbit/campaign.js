import {prepareMotion,integrateMotion} from '../../core/movement.js?v=orbit113';
import {pickupItem,useItem,message} from '../../core/inventory.js?v=orbit113';
import {damage} from '../../core/health.js?v=orbit113';
import {segmentHit,shieldControls} from '../../core/projectile-collision.js?v=orbit113';
import {startBash,bashImpact} from '../../core/bash.js?v=orbit113';
import {ladderAtHero} from '../../core/ladder-context.js?v=orbit113';
import {magneticMotion,magneticPoint,localHeroPoint,recoverFreeRotation} from './magnetic.js?v=orbit113';
const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
const floor=(x,y,w)=>({x,y,w});
export const orbitMount=p=>({x:p.x+Math.sin(p.angle)*p.h/2,y:p.y-Math.cos(p.angle)*p.h/2});
export const orbitLevel={name:'SCRAP ORBIT',subtitle:'Iron remembers the underside.',mechanic:'orbit',worldWidth:3560,worldTop:80,worldBottom:1240,deathY:1320,
 story:['Rejected storms leave iron behind. A magnetic sorter turns it above the furnace recovery gallery.','Its shoes still cling to the service rails. The departure crane waits behind a cracked cover.'],
 hint:'Pick up magnetic shoes and use their bag slot to wear them. Olaf pushes roller frames into the coils. Shoes follow steel rails around the underside. Cut exposed ropes with arrows. Bash the cracked crane cover, use the panel and steer the hook; action clamps, alt releases, use leaves.',
 floors:[floor(0,1180,3560),floor(0,1000,980),floor(1690,650,750),floor(2860,300,700)],platforms:[],ladders:[{x:260,top:1000,bottom:1180},{x:1780,top:650,bottom:1180}],exit:{x:3440,y:300,w:160}};
export function setupOrbit(s){
 s.campaign='cycle';s.round=8;s.level=orbitLevel;s.crate=false;s.turret=false;s.shots=[];s.items=[0,1,2].map(n=>({id:'magnetic-shoes-'+n,type:'magneticShoes',x:120+n*55,y:956}));
 for(const h of s.heroes)Object.assign(h,{x:100+h.id*55,y:956,vx:0,vy:0,ground:true,support:null,rotation:0,magnet:null,boots:false});
 s.machine={plates:[{id:0,x:780,y:1024,w:344,h:48,capRx:16,angle:0,phase:'ground',charge:0,vx:0,vy:0},{id:1,x:2150,y:674,w:344,h:48,capRx:16,angle:0,phase:'ground',charge:0,vx:0,vy:0}],ropeCut:[false,false],ropePose:[0,0],ropeAperture:[0,0],panelOpen:false,panelPose:0,operator:null,hook:{x:2540,y:380,vx:0,vy:0,plateId:null,offset:null},hookDocked:false,exitPose:0,ladderPose:0,blocks:0,safety:false,
 debris:[{id:0,cx:1380,cy:890,rx:130,ry:100,clock:0,phase:'rest',x:1510,y:890,angle:0},{id:1,cx:2690,cy:620,rx:110,ry:85,clock:2,phase:'rest',x:2800,y:620,angle:0}]};
 s.itemAction=(type,h)=>{if(type!=='magneticShoes')return false;h.boots=!h.boots;message(s,h.boots?'Magnetic shoes grip continuous steel rails.':'Magnetic shoes released.');return true;};
}
export function orbitSurfaces(s){return[...s.level.floors,...s.level.platforms,...s.machine.plates.filter(p=>Math.abs(Math.sin(p.angle))<.015).map(p=>({x:p.x-(p.w-2*p.capRx)/2,y:p.y-p.h/2,w:p.w-2*p.capRx,support:'orbit-'+p.id}))];}
export function orbitObjects(s){const g=s.machine;return[{id:'orbit-crane-panel',x:1730,y:606,radius:72,title:'DEPARTURE CRANE',reason:g.panelOpen?'Arrows steer the hook. Action clamps, alt releases, use leaves.':'A cracked ceramic cover blocks the panel.',ready:g.panelOpen,done:g.hookDocked,
 run:()=>{if(!g.panelOpen)return 'The cracked ceramic cover needs a running bash.';g.operator=g.operator===s.active?null:s.active;return g.operator===null?'Crane controls released.':'Crane controls engaged.';}}];}
function ropeCommand(s,n){const g=s.machine;return n===0?g.plates[0].phase==='orbit'&&Math.abs(Math.sin(g.plates[0].angle/2))<.23:g.hookDocked&&s.time%5.4<1.5;}
export function orbitRope(s,n){const g=s.machine;return{x:n===0?1360:3180,y:n===0?626:248,w:28,h:72,aperture:g.ropeAperture[n],open:g.ropeAperture[n]>=.9999&&ropeCommand(s,n),cut:g.ropeCut[n]};}
function strikeRope(s,n,from,to){const r=orbitRope(s,n);if(r.cut||!segmentHit(from.x,from.y,to.x,to.y,{x:r.x-r.w/2,y:r.y-r.h/2,w:r.w,h:r.h}))return false;
 if(r.open){s.machine.ropeCut[n]=true;if(n===0)s.machine.plates[0].phase='dock';message(s,'The exposed rope parts; its retaining pawl releases.');}return true;
}
function mechanisms(s,input,dt){const g=s.machine,o=s.heroes[2];
 for(const p of g.plates){const old={x:p.x,y:p.y},target=p.id===0?1120:2540,base=p.id===0?1024:674;
  if(p.phase==='ground'&&s.active===2&&!o.boots&&input.right&&Math.abs(o.x-(p.x-p.w/2-20))<45&&Math.abs(o.y+44-(base-p.h/2))<12){const dx=Math.min(target-p.x,Math.max(0,o.moveX));p.x+=dx;o.x+=dx;o.moveX=0;if(p.x>=target-.01){p.x=target;p.phase='charge';}}
  if(p.phase==='charge'){p.charge=Math.min(1,p.charge+dt/2);if(p.charge===1)p.phase='lift';}
  if(p.phase==='lift'){const y=p.id===0?674:444;p.y=approach(p.y,y,120*dt);if(p.y===y)p.phase=p.id===0?'orbit':'float';}
  if(p.phase==='orbit')p.angle+=Math.PI/8*dt;
  if(p.phase==='float'&&g.hook.plateId!==p.id)p.angle=approach(p.angle,Math.sin(s.time*.45)*.18,.2*dt);
  if(p.phase==='dock'){p.angle=approach(p.angle,Math.round(p.angle/(Math.PI*2))*Math.PI*2,.75*dt);if(Math.abs(Math.sin(p.angle/2))<.001){p.angle=0;p.x=approach(p.x,1610,150*dt);if(p.x===1610)p.phase='parked';}}
  p.vx=(p.x-old.x)/dt;p.vy=(p.y-old.y)/dt;
  for(const h of s.heroes)if(!h.magnet&&h.support==='orbit-'+p.id){h.x+=p.x-old.x;h.y+=p.y-old.y;}
 }
 const operator=g.operator===null?null:s.heroes[g.operator];
 if(operator&&(g.operator!==s.active||operator.dead||operator.hurt>0||Math.abs(operator.x-1730)>76||Math.abs(operator.y+44-650)>18))g.operator=null;
 if(g.operator!==null){const k=g.hook,kx=k.x,ky=k.y;k.vx=approach(k.vx,(Number(!!input.right)-Number(!!input.left))*170,500*dt);k.vy=approach(k.vy,(Number(!!input.down)-Number(!!input.up))*140,500*dt);k.x=Math.max(2100,Math.min(3040,k.x+k.vx*dt));k.y=Math.max(260,Math.min(600,k.y+k.vy*dt));
  if(input.action&&k.plateId===null){const p=g.plates[1],eye=orbitMount(p);if(['float','hooked'].includes(p.phase)&&Math.hypot(k.x-eye.x,k.y-eye.y)<12){k.plateId=p.id;k.offset={x:p.x-k.x,y:p.y-k.y};p.phase='hooked';message(s,'The crane jaw closes around the carrier eye.');}}
  if(k.plateId!==null){const p=g.plates[k.plateId];p.x=k.x+k.offset.x;p.y=k.y+k.offset.y;p.vx=(k.x-kx)/dt;p.vy=(k.y-ky)/dt;p.angle=approach(p.angle,0,.3*dt);
   if(Math.abs(p.x-2900)<12&&Math.abs(p.y-324)<12){p.phase='seating';g.hookDocked=true;k.plateId=null;}}
  if(input.sword||input.alt){if(k.plateId!==null){g.plates[k.plateId].phase='float';k.plateId=null;}k.offset=null;}
 }else{g.hook.vx=approach(g.hook.vx,0,500*dt);g.hook.vy=approach(g.hook.vy,0,500*dt);}
 const p=g.plates[1];if(p.phase==='seating'){p.x=approach(p.x,2900,70*dt);p.y=approach(p.y,324,70*dt);p.angle=approach(p.angle,0,.3*dt);if(p.x===2900&&p.y===324)p.phase='parked';}
 g.panelPose=approach(g.panelPose,g.panelOpen?1:0,dt/.65);for(let n=0;n<2;n++){g.ropePose[n]=approach(g.ropePose[n],g.ropeCut[n]?1:0,dt/.65);g.ropeAperture[n]=approach(g.ropeAperture[n],ropeCommand(s,n)?1:0,dt/.2);}g.exitPose=approach(g.exitPose,g.ropeCut[1]?1:0,dt);g.ladderPose=approach(g.ladderPose,g.ropeCut[1]?1:0,dt/1.2);
 s.level={...orbitLevel,ladders:[...orbitLevel.ladders,...(g.ladderPose>0?[{x:2980,top:300,bottom:300+880*g.ladderPose}]:[])]};
}
function arrows(s,dt){for(const p of s.shots){const ox=p.x,oy=p.y;p.x+=(p.vx??p.v??0)*dt;p.y+=(p.vy||0)*dt;p.life=(p.life??4)-dt;
 for(let n=0;n<2;n++)if(strikeRope(s,n,{x:ox,y:oy},p)){p.dead=true;break;}
 }s.shots=s.shots.filter(p=>!p.dead&&p.life>0&&p.x>0&&p.x<3560&&p.y>0&&p.y<1300);}
function debris(s,dt){for(const d of s.machine.debris){const oldX=d.x,oldY=d.y;d.clock+=dt;const t=d.clock%7.8;d.phase=t<1.2?'warning':t<4.8?'active':'rest';const q=Math.max(0,Math.min(1,(t-1.2)/3.6));d.angle=(3*q*q-2*q*q*q)*Math.PI*2;d.x=d.cx+Math.cos(d.angle)*d.rx;d.y=d.cy+Math.sin(d.angle)*d.ry;d.vx=(d.x-oldX)/dt;d.vy=(d.y-oldY)/dt;
 if(d.phase==='active'&&!s.machine.safety)for(const h of s.heroes){if(h.dead||Math.hypot(h.x-d.x,h.y+22-d.y)>42)continue;const local=localHeroPoint(h,h.face*24,-24),c=Math.cos(h.rotation||0),sn=Math.sin(h.rotation||0),front=((d.x-h.x)*c+(d.y-h.y-22)*sn)*h.face,approach=(d.vx*c+d.vy*sn)*h.face;
  if(h.id===2&&!h.shieldUp&&front>0&&approach<0&&Math.hypot(local.x-d.x,local.y-d.y)<50){s.machine.blocks++;continue;}damage(s,h,1);}
 }}
export function orbitStep(s,input,dt){const g=s.machine,a=s.heroes[s.active];s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);if(a.id===2)shieldControls(a,input);
 for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);
 const operating=g.operator!==null&&g.operator===s.active;prepareMotion(s,operating?{}:input,dt);startBash(s,dt);
 if(a.id===0&&a.bash>.12&&!g.panelOpen&&Math.abs(a.x-1730)<75&&Math.abs(a.y+44-650)<12){g.panelOpen=true;bashImpact(s,1730,614);message(s,'The cracked ceramic cover breaks, revealing the crane controls.');}
 if(input.item)useItem(s);
 if(input.interact){if(g.operator===s.active)g.operator=null;else if(!pickupItem(s)){const object=orbitObjects(s).find(o=>Math.abs(a.x-o.x)<o.radius&&Math.abs(a.y-o.y)<60);if(object)message(s,object.run());}}
 if(!operating&&a.id===1&&input.sword&&s.cooldown===0){a.swing=.24;s.cooldown=.3;const from=localHeroPoint(a,a.face*18,-24),to=localHeroPoint(a,a.face*84,-24);for(let n=0;n<2;n++)strikeRope(s,n,from,to);}
 if(!operating&&a.id===1&&input.action&&s.cooldown===0){const muzzle=localHeroPoint(a,a.face*25,-24),angle=a.rotation||0;a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:muzzle.x,y:muzzle.y,v:Math.cos(angle)*a.face*580,vx:Math.cos(angle)*a.face*580,vy:Math.sin(angle)*a.face*580,life:4});}
 mechanisms(s,input,dt);const attached=magneticMotion(s,operating?{}:input,dt),attachedWalk=new Map(attached.map(h=>[h,h.walk])),climbs=[];
 for(const h of s.heroes)if(!h.magnet){const ladder=ladderAtHero(s.level,h),active=h.id===s.active;if(active&&!operating){if((input.up||input.down)&&ladder)h.climbing=true;if(input.left||input.right||input.jump)h.climbing=false;}
  if(h.climbing&&ladder){const dir=active&&!operating?Number(!!input.down)-Number(!!input.up):0;climbs.push({h,x:ladder.x,y:Math.max(ladder.top-44,Math.min(ladder.bottom-44,h.y+dir*150*dt))});h.moveX=0;h.vy=-1250*dt;}}
 const shieldUp=s.heroes[2].shieldUp;if(Math.abs(s.heroes[2].rotation||0)>.05)s.heroes[2].shieldUp=false;
 integrateMotion(s,orbitSurfaces(s),[{x:3310,w:60,top:200,bottom:300,on:g.exitPose<.99}],dt);s.heroes[2].shieldUp=shieldUp;
 for(const h of attached){h.walk=attachedWalk.get(h);magneticPoint(h,g.plates.find(p=>p.id===h.magnet.plateId));}for(const {h,x,y}of climbs){h.x=x;h.y=y;h.vy=0;h.ground=true;h.support='ladder';h.climbMoving=h.id===s.active&&(input.up||input.down);}
 for(const h of s.heroes)recoverFreeRotation(h,dt);
 arrows(s,dt);debris(s,dt);if(g.operator!==null&&(s.heroes[g.operator].dead||s.heroes[g.operator].hurt>0))g.operator=null;s.power=g.exitPose===1;s.won=!s.failed&&s.power&&s.heroes.every(h=>Math.abs(h.x-3440)<80&&Math.abs(h.y+44-300)<5);
}
