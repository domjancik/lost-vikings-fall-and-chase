import {prepareMotion,integrateMotion} from '../../core/movement.js';
import {pickupItem,useItem,message} from '../../core/inventory.js?v=sewer125';
import {damage} from '../../core/health.js';
import {segmentHit,shieldHit} from '../../core/projectile-collision.js';
import {ladderAtHero} from '../../core/ladder-context.js';
import {magneticMotion,magneticPoint,magneticRails,railContact,railLength,resolveSteelCollisions,recoverFreeRotation,localHeroPoint} from '../orbit/magnetic.js';

const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
const floor=(x,y,w)=>({x,y,w});
export const lodeLevel={name:'THE LODE ENGINE',subtitle:'The weight below is the way above.',mechanic:'lode',worldWidth:4200,worldTop:0,worldBottom:1340,deathY:1380,
 story:['Beyond the scrap field, a cathedral of iron balances the weight of abandoned machines.','Its maintenance routes cling to the stator. Bank a discarded core and let its fall lift the crew.'],
 hint:'Wear magnetic shoes to climb around the stator. Step on the gallery pedal to lower the recovery ladder. Cut the hinge brake cable; Erik can jump onto the folded bridge and reach its winding wheel. Cross to the ballast gallery. Olaf pushes the hanging runner into the fixed receiver. Board the lift, round its free right end, and return left along the top to the exit. The ground call lever retrieves a missed lift.',
 floors:[floor(0,1260,4200),floor(1000,700,880),floor(2320,700,680),floor(2340,316,370)],platforms:[],ladders:[],exit:{x:2480,y:316,w:160}};

export function setupLode(s){
 s.round=9;s.campaign='cycle';s.level=lodeLevel;s.crate=false;s.turret=false;s.enemies=[];s.shots=[];
 s.items=[0,1,2].map(n=>({id:'lode-shoes-'+n,type:'magneticShoes',x:120+n*55,y:1216}));
 for(const h of s.heroes)Object.assign(h,{x:100+h.id*55,y:1216,vx:0,vy:0,ground:true,support:null,rotation:0,boots:false,magnet:null});
 s.machine={plates:[{id:0,x:1000,y:978,w:560,h:556,capRx:280,angle:0,vx:0,vy:0},
  {id:1,x:2100,y:724,w:440,h:48,capRx:16,angle:Math.PI/2,vx:0,vy:0},
  {id:2,x:3040,y:576,w:640,h:48,capRx:16,angle:0,vx:0,vy:0}],roofs:[],brakeCut:false,brakePose:0,bridgeWanted:false,winding:0,bridgeSpeed:0,
  recovery:false,recoveryPose:0,banked:false,bankPose:0,liftWanted:false,liftSpeed:0,liftBlocked:false,pushContact:false,
  ballastU:0,ballastTravel:0,sentry:{x:2620,y:700,dir:-1,hp:2,clock:0,fireAt:2,warning:0,targetId:null},events:[],eventSerial:0};
 s.machine.ballastU=bottomU(s.machine.plates[2],2860);
 s.itemAction=(type,h)=>{if(type!=='magneticShoes')return false;h.boots=!h.boots;h.bootPulse=.7;message(s,h.boots?'MAGNETS ON':'MAGNETS OFF');return true;};
}
const emit=(s,name,x)=>{s.machine.events.push({name,x,id:s.machine.eventSerial++});if(s.machine.events.length>12)s.machine.events.shift();};
export function bottomU(p,x){return(p.w-2*p.capRx)+(railLength(p)-2*(p.w-2*p.capRx))/2+(p.w-2*p.capRx)/2-(x-p.x);}
export function lodeBallastPoint(s){const g=s.machine;if(g.banked)return{x:3160,y:600+g.bankPose*32+2*(576-g.plates[2].y)};return railContact(g.plates[2],g.ballastU);}
export function lodeRequestBridge(s){const g=s.machine;if(!g.brakeCut)return false;g.bridgeWanted=!g.bridgeWanted;emit(s,'cart',2100);return true;}
export function lodeControl(s,id){
 const g=s.machine,p=g.plates[1],q=railContact(p,24),lift=g.plates[2];
 const controls={
  bridge:{id:'lode-bridge',x:q.x+q.nx*28,y:q.y+q.ny*28-22,radius:64,title:'WINDING WHEEL',ready:g.brakeCut,reason:'The visible service brake still holds the hinge.',run:()=>{lodeRequestBridge(s);return g.bridgeWanted?'Ratchet wound. The bridge is lowering.':'The hinge returns to its service position.';}},
  call:{id:'lode-call',x:2660,y:656,radius:64,title:'LIFT CALL',ready:true,run:()=>{g.liftWanted=false;emit(s,'cart',2660);return 'Lift returning to the boarding gallery.';}},
  cabin:{id:'lode-cabin',x:2760,y:lift.y+46-22,radius:60,title:'LIFT LEVER',ready:g.banked,reason:'The runner must be banked in the fixed receiver.',run:()=>{if(g.banked){g.liftWanted=!g.liftWanted;emit(s,'cart',2760);}return g.liftWanted?'Counterweight released. Rising.':'Returning to the boarding gallery.';}}
 };return controls[id];
}
export const lodeObjects=s=>['bridge','call','cabin'].map(id=>lodeControl(s,id));
export function lodeSurfaces(s){return[...s.level.floors,...magneticRails(s).filter(p=>Math.abs(Math.sin(p.angle))<.015).map(p=>({x:p.x-(p.w-2*p.capRx)/2,y:p.y-p.h/2,w:Math.max(1,p.w-2*p.capRx),support:'orbit-'+p.id}))];}

// Native-sized bodies respect the real floor material while traversing a rail.
export function magneticTerrainDepth(h,floors){
 const points=[[-18,-1],[18,-1],[18,-70],[-18,-70]].map(([x,y])=>localHeroPoint(h,x,y));
 const left=Math.min(...points.map(p=>p.x)),right=Math.max(...points.map(p=>p.x)),top=Math.min(...points.map(p=>p.y)),bottom=Math.max(...points.map(p=>p.y));
 const a=h.rotation||0,axes=[{x:1,y:0},{x:0,y:1},{x:Math.cos(a),y:Math.sin(a)},{x:-Math.sin(a),y:Math.cos(a)}];
 let depth=0;for(const f of floors){
  if(right<=f.x||left>=f.x+f.w||bottom<=f.y||top>=f.y+48)continue;
  const corners=[{x:f.x,y:f.y},{x:f.x+f.w,y:f.y},{x:f.x+f.w,y:f.y+48},{x:f.x,y:f.y+48}];
  let overlap=Infinity;for(const v of axes){const hp=points.map(p=>p.x*v.x+p.y*v.y),fp=corners.map(p=>p.x*v.x+p.y*v.y);const d=Math.min(Math.max(...hp)-Math.min(...fp),Math.max(...fp)-Math.min(...hp));overlap=Math.min(overlap,d);}depth=Math.max(depth,overlap);
 }return Math.max(0,depth);
}
export const magneticTerrainHit=(h,floors)=>magneticTerrainDepth(h,floors)>.05;
function mechanisms(s,dt){
 const g=s.machine,p=g.plates[1];
 if(!g.recovery&&s.heroes.some(h=>Math.abs(h.x-1140)<40&&Math.abs(h.y+44-700)<3&&!h.magnet)){g.recovery=true;emit(s,'chain',1140);}
 g.recoveryPose=approach(g.recoveryPose,g.recovery?1:0,dt/1.4);g.brakePose=approach(g.brakePose,g.brakeCut?1:0,dt/.6);
 if(g.bridgeWanted)g.winding=Math.min(1,g.winding+dt/1.1);
 const target=g.bridgeWanted&&g.winding===1?0:Math.PI/2,error=target-p.angle;
 g.bridgeSpeed=approach(g.bridgeSpeed,Math.sign(error)*Math.min(.5,Math.sqrt(1.3*Math.abs(error))),1.1*dt);
 const travel=Math.sign(error)*Math.min(Math.abs(error),Math.abs(g.bridgeSpeed)*dt);p.angle+=travel;if(Math.abs(error)<.00001){p.angle=target;g.bridgeSpeed=0;}
 const lift=g.plates[2],old=lift.y;g.bankPose=approach(g.bankPose,g.banked?1:0,dt/.5);
 const wanted=g.banked&&g.bankPose===1&&g.liftWanted?340:576,delta=wanted-lift.y;
 g.liftSpeed=approach(g.liftSpeed,Math.sign(delta)*Math.min(90,Math.sqrt(180*Math.abs(delta))),120*dt);
 const next=lift.y+Math.sign(delta)*Math.min(Math.abs(delta),Math.abs(g.liftSpeed)*dt);g.liftBlocked=false;
 lift.y=next;
 for(const h of s.heroes)if(h.magnet?.plateId===2&&h.magnet.pull===1){const probe={...h,magnet:{...h.magnet}};magneticPoint(probe,lift);if(magneticTerrainHit(probe,s.level.floors)){g.liftBlocked=true;break;}}
 if(g.liftBlocked){lift.y=old;g.liftSpeed=0;}lift.vy=(lift.y-old)/dt;
 for(const h of s.heroes)if(!h.magnet&&h.support==='orbit-2')h.y+=lift.y-old;
 s.level={...lodeLevel,ladders:g.recoveryPose>0?[{x:1780,top:700,bottom:700+560*g.recoveryPose}]:[]};
}
function pushBallast(s,previous){
 const g=s.machine,p=g.plates[2];g.pushContact=false;if(g.banked)return;
 for(const h of s.heroes){if(h.magnet?.plateId!==2||h.magnet.pull<1)continue;
  const old=previous.get(h.id)?.u??h.magnet.u,next=h.magnet.u,du=next-old,diff=old-g.ballastU;
  if(Math.abs(diff)>64&&Math.abs(next-g.ballastU)>=64&&Math.sign(next-g.ballastU)===Math.sign(diff))continue;
  if(h.id===2&&s.active===2&&du<0&&diff>=60){const dock=bottomU(p,3160),travel=Math.min(-du,Math.max(0,g.ballastU-dock));g.ballastU-=travel;g.ballastTravel+=travel;h.magnet.u=g.ballastU+64;g.pushContact=true;
   if(g.ballastU<=dock+.001){g.banked=true;g.liftWanted=true;g.bankedAt=s.time;emit(s,'orbitLatch',3160);message(s,'Ballast banked. The opposing weight lifts the rail.');}
  }else h.magnet.u=g.ballastU+(diff>=0?64:-64);
  magneticPoint(h,p);
 }
}
const steelHit=(p,a,b)=>{if(p.id===0){const dx=b.x-a.x,dy=b.y-a.y,ox=a.x-p.x,oy=a.y-p.y,rx=p.w/2,ry=p.h/2,A=dx*dx/(rx*rx)+dy*dy/(ry*ry),B=2*(ox*dx/(rx*rx)+oy*dy/(ry*ry)),C=ox*ox/(rx*rx)+oy*oy/(ry*ry)-1,D=B*B-4*A*C;if(C<0)return 0;if(D<0||!A)return null;const t=(-B-Math.sqrt(D))/(2*A);return t>=0&&t<=1?t:null;}
 const c=Math.cos(p.angle),sn=Math.sin(p.angle),local=q=>({x:(q.x-p.x)*c+(q.y-p.y)*sn,y:-(q.x-p.x)*sn+(q.y-p.y)*c}),x=local(a),y=local(b);return segmentHit(x.x,x.y,y.x,y.y,{x:-p.w/2,y:-p.h/2,w:p.w,h:p.h})?.t??null;};
function projectiles(s,dt){
 const g=s.machine,e=g.sentry;
 if(e.hp>0){e.clock+=dt;e.x+=e.dir*46*dt;if(e.x<2500||e.x>2790){e.x=Math.max(2500,Math.min(2790,e.x));e.dir*=-1;}
  const target=s.heroes.filter(h=>!h.dead&&Math.abs(h.y+44-700)<54&&Math.abs(h.x-e.x)<700).sort((a,b)=>Math.abs(a.x-e.x)-Math.abs(b.x-e.x))[0];
  if(target&&e.targetId===null)e.fireAt=e.clock+.9;e.targetId=target?.id??null;
  e.warning=target?Math.max(0,1-(e.fireAt-e.clock)/.7):0;
  if(target&&e.clock>=e.fireAt){e.dir=target.x<e.x?-1:1;s.shots.push({kind:'bolt',x:e.x+e.dir*60,y:e.y-44,vx:e.dir*280,vy:0,life:3});e.fireAt=e.clock+2.6;emit(s,'shoot',e.x);}
 }
 for(const shot of s.shots){const a={x:shot.x,y:shot.y};shot.x+=shot.vx*dt;shot.y+=(shot.vy||0)*dt;shot.life-=dt;
  const hits=[];for(const f of s.level.floors){const hit=segmentHit(a.x,a.y,shot.x,shot.y,{...f,h:48});if(hit)hits.push({t:hit.t,type:'solid'});}
  for(const p of g.plates){const t=steelHit(p,a,shot);if(t!==null)hits.push({t,type:'solid'});}
  if(shot.kind==='arrow'){
   if(!g.brakeCut){const hit=segmentHit(a.x,a.y,shot.x,shot.y,{x:1988,y:654,w:16,h:44});if(hit)hits.push({t:hit.t,type:'brake'});}
   if(e.hp>0){const hit=segmentHit(a.x,a.y,shot.x,shot.y,{x:e.x-42,y:e.y-88,w:84,h:88});if(hit)hits.push({t:hit.t,type:'enemy'});}
  }else{
   const o=s.heroes[2];if(!o.magnet){const hit=shieldHit(o,shot,a.x,a.y);if(hit)hits.push({t:hit.t,type:'shield'});}
   for(const h of s.heroes){const hit=segmentHit(a.x,a.y,shot.x,shot.y,{x:h.x-16,y:h.y,w:32,h:44});if(hit)hits.push({t:hit.t,type:'hero',hero:h});}
  }
  const hit=hits.sort((x,y)=>x.t-y.t||Number(x.type==='hero')-Number(y.type==='hero'))[0];if(hit){shot.dead=true;if(hit.type==='brake'){g.brakeCut=true;emit(s,'chain',1996);message(s,'The hinge brake is free.');}if(hit.type==='enemy'){e.hp--;emit(s,e.hp?'shieldHit':'impact',e.x);}if(hit.type==='hero')damage(s,hit.hero,1);if(hit.type==='shield'){g.blocks=(g.blocks||0)+1;emit(s,'shieldHit',s.heroes[2].x);}}
 }
 s.shots=s.shots.filter(p=>!p.dead&&p.life>0&&p.x>=0&&p.x<=4200&&p.y>=0&&p.y<=1340);
}
export function lodeStep(s,input,dt){
 const g=s.machine,h=s.heroes[s.active];s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);
 for(const a of s.heroes){a.swing=Math.max(0,(a.swing||0)-dt);a.bootPulse=Math.max(0,(a.bootPulse||0)-dt);}
 prepareMotion(s,input,dt);
 if(input.item)useItem(s);
 if(input.interact&&!pickupItem(s)){const o=lodeObjects(s).filter(o=>Math.abs(h.x-o.x)<=o.radius&&Math.abs(h.y-o.y)<64).sort((a,b)=>Math.hypot(h.x-a.x,h.y-a.y)-Math.hypot(h.x-b.x,h.y-b.y))[0];if(o)message(s,o.ready?o.run():o.reason);}
 if(h.id===1&&input.action&&s.cooldown===0){const muzzle=localHeroPoint(h,h.face*25,-24),a=h.rotation||0;s.shots.push({kind:'arrow',...muzzle,vx:Math.cos(a)*h.face*580,vy:Math.sin(a)*h.face*580,life:4});h.bow=.28;s.cooldown=.35;}
 if(h.id===1&&input.sword&&s.cooldown===0){h.swing=.24;s.cooldown=.3;const from=localHeroPoint(h,h.face*18,-24),to=localHeroPoint(h,h.face*84,-24);if(!g.brakeCut&&segmentHit(from.x,from.y,to.x,to.y,{x:1988,y:654,w:16,h:44})){g.brakeCut=true;emit(s,'chain',1996);}}
 mechanisms(s,dt);
 const previous=new Map(s.heroes.filter(h=>h.magnet).map(h=>[h.id,{...h.magnet}]));
 const attached=magneticMotion(s,input,dt);pushBallast(s,previous);
 for(const a of attached)if(a.magnet.pull===undefined||a.magnet.pull===1){if(magneticTerrainHit(a,s.level.floors)&&previous.has(a.id)){const prior={...a,magnet:{...a.magnet,u:previous.get(a.id).u}};magneticPoint(prior,g.plates[a.magnet.plateId]);if(magneticTerrainDepth(a,s.level.floors)>magneticTerrainDepth(prior,s.level.floors)+.01){a.magnet.u=previous.get(a.id).u;a.magV=0;magneticPoint(a,g.plates[a.magnet.plateId]);}}}
 const walk=new Map(attached.map(a=>[a,a.walk])),climbs=[];
 for(const a of s.heroes)if(!a.magnet){const l=ladderAtHero(s.level,a),active=a.id===s.active;if(active){if((input.up||input.down)&&l)a.climbing=true;if(input.left||input.right||input.jump)a.climbing=false;}if(a.climbing&&l){const dir=active?Number(!!input.down)-Number(!!input.up):0;climbs.push({a,x:l.x,y:Math.max(l.top-44,Math.min(l.bottom-44,a.y+dir*150*dt))});a.moveX=0;a.vy=-1250*dt;}}
 const up=s.heroes[2].shieldUp;if(Math.abs(s.heroes[2].rotation||0)>.05)s.heroes[2].shieldUp=false;
 integrateMotion(s,lodeSurfaces(s),[],dt);s.heroes[2].shieldUp=up;resolveSteelCollisions(s);
 for(const a of attached){a.walk=walk.get(a);magneticPoint(a,g.plates[a.magnet.plateId]);}
 for(const {a,x,y}of climbs){a.x=x;a.y=y;a.vy=0;a.ground=true;a.support='ladder';a.climbMoving=a.id===s.active&&(input.up||input.down);}
 for(const a of s.heroes)recoverFreeRotation(a,dt);
 projectiles(s,dt);s.power=g.banked&&g.plates[2].y===340;
 s.won=!s.failed&&s.power&&s.heroes.every(a=>Math.abs(a.x-2480)<80&&Math.abs(a.y+44-316)<4);
}
