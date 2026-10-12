import {prepareMotion,integrateMotion} from './movement.js?v=vikings70';
import {ladderAtHero} from './ladder-context.js?v=look58';
import {segmentHit} from './projectile-collision.js?v=arc46';
import {damage} from './health.js?v=arc46';
import {refractionArt} from './refraction-art-layout.js?v=refraction62';
const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
const smooth=t=>t*t*(3-2*t);
export const CLOCK_RADIUS=80;
export const clockworkLevel={name:'INSIDE THE CLOCKWORK',subtitle:'One runner. Two passengers. A machine that learns to let go.',
 story:['A broken balance wheel divides the tower from its escapement. The upper half still hangs in the service gallery.','The clock has no motor left. It has three visitors.'],
 hint:'Climb the watchtower with Olaf and Baleog. Ride the overhead shield across. Shoot the hanging chain from the gallery, then push the arch left into its return guide. Erik boards the lower cup. Run the joined wheel through the lower works and into the launch spring. At the dock, run or brake to ferry the others. The final ratchet exposes a red release pin.',
 mechanic:'clockwork',worldWidth:3300,worldTop:0,worldBottom:1400,deathY:1450,
 floors:[{x:0,y:1260,w:3300}],
 platforms:[{x:0,y:800,w:680},{x:320,y:380,w:240},{x:920,y:650,w:540},{x:1200,y:400,w:200},{x:1720,y:920,w:120},{x:2380,y:920,w:920},{x:2300,y:1002,w:320},{x:2798,y:530,w:502}],
 ladders:[{x:420,top:380,bottom:1260},{x:450,top:300,bottom:380},{x:1320,top:400,bottom:650},{x:1450,top:650,bottom:650},{x:1800,top:920,bottom:1260}],exit:{x:3090,y:530,w:170}};
export function clockRail(p){
 if(p<=680)return{y:800,slope:0};if(p>=1640)return{y:920,slope:0};
 if(p>=1050&&p<=1250)return{y:1120,slope:0};
 const [a,b,y0,y1]=p<1050?[680,1050,800,1120]:[1250,1640,1120,920],t=(p-a)/(b-a);
 return{y:y0+(y1-y0)*smooth(t),slope:(y1-y0)*6*t*(1-t)/(b-a)};
}
export function clockWheelPose(p){const r=clockRail(p),n=Math.hypot(1,r.slope);return{x:p+r.slope*CLOCK_RADIUS/n,y:r.y-CLOCK_RADIUS/n};}
export function clockCarrierPose(drive){const d=Math.max(0,Math.min(1,drive));return d<.75?{x:1640+(2700-1640)*d/.75,y:920}:{x:2700,y:920-(d-.75)/.25*390};}
export const clockLiftPlacement=c=>({x:c.x,y:c.y-refractionArt.liftRim*2,w:c.w,h:128});
export function clockCatchPose(g){const stroke=g.half.mode==='catch'?Math.max(0,Math.min(25,(g.half.y-640)/2)):['waiting','join','joined'].includes(g.half.mode)?0:25;return{stroke,hook:650+stroke*2,base:778,released:['join','joined'].includes(g.half.mode)};}
export function setupClockwork(s){
 s.level={...clockworkLevel,ladders:clockworkLevel.ladders.map(l=>({...l}))};s.crate=false;s.turret=false;s.enemies=[];
 for(const h of s.heroes)Object.assign(h,{y:756,ground:true});
 s.machine={half:{x:1080,y:500,vy:0,vx:0,mode:'hanging'},wheel:{p:560,x:560,y:720,v:0,angle:0,mode:'cup',occupied:false},chainCut:false,joined:false,pinBroken:false,collapse:0,exitLatched:false,drive:0,driveV:0,carrier:{...clockCarrierPose(0),w:180,v:0,support:'clock-carriage'},counter:{x:3060,y:530,w:140,support:'clock-counter'},steamClock:0,launchAt:-20,dockAt:-20,returnAt:-20,joinAt:-20,ladder:0,serviceLadder:0,serviceReached:false};
}
export function clockObjects(s){const g=s.machine,b=g.wheel;return[{id:'entry-catch',x:b.x,y:b.y+12,radius:90,title:'ENTRY CATCH',ready:b.occupied&&b.mode==='rolling'&&b.p<680,done:false,reason:'The launch pawl locks the catch beyond the starting rail.',run:()=>{b.mode='opening';b.open=0;b.v=0;return 'Entry catch reopening. Step out before the roof seats again.';}},{id:'clock-recall',x:1560,y:876,radius:70,title:'SAFETY WINCH',ready:b.mode==='stranded',done:false,reason:'The launch cradle is clear.',run:()=>{b.mode='recall';b.returnStage=0;g.returnAt=s.time;return 'Safety winch returning the occupied wheel.';}}];}
export function clockSurfaces(s){const g=s.machine,b=g.wheel;return [...s.level.floors,...s.level.platforms,g.carrier,g.counter,...(['cup','released'].includes(b.mode)?[{x:b.x-40,y:b.y+56,w:80,support:'clock-cup'}]:[])];}
function feedback(s,message){s.feedback={message,sequence:(s.feedback?.sequence||0)+1};}
function advanceHalf(s,input,dt){const g=s.machine,h=g.half,o=s.heroes[2];
 g.pushContact=false;
 if(h.mode==='fall'){h.vy+=700*dt;h.y+=h.vy*dt;if(h.y>=640){h.y=640;h.vy=0;h.mode='shelf';g.halfLanded=true;}}
 else if(h.mode==='shelf'){
  const contact=s.active===2&&input.left&&!o.shieldUp&&o.face===-1&&o.ground&&Math.abs(o.y+44-650)<3&&o.x-42<=h.x+80+4&&o.x>h.x;
  g.pushContact=contact;h.vx=approach(h.vx,contact?-65:0,240*dt);h.x+=h.vx*dt;if(h.x<=920){h.x=920;h.mode='chute';h.vx=-100;g.halfPushed=true;}
 }else if(h.mode==='chute'){
  h.vx=Math.max(-240,h.vx-160*dt);h.x=Math.max(560,h.x+h.vx*dt);h.y=640+50*smooth((920-h.x)/360);
  if(h.x===560){h.mode='catch';h.vx=0;}
 }else if(h.mode==='catch'){
  // A spring catch lifts the arch clear of the entry gap before it seats.
  h.y=approach(h.y,640,70*dt);if(h.y===640)h.mode='waiting';
 }else if(h.mode==='waiting'){
  // Visible guide catches safely hold the roof until the runner has boarded.
  const e=s.heroes.find(e=>Math.abs(e.x-g.wheel.x)<35&&Math.abs(e.y+44-(g.wheel.y+56))<4&&e.ground);
  if(e&&!g.entryHold){h.mode='join';g.wheel.occupied=true;g.wheel.occupant=e.id;}if(!e)g.entryHold=false;
 }else if(h.mode==='join'){
  h.vy=Math.min(120,h.vy+280*dt);h.y=Math.min(720,h.y+h.vy*dt);
  if(h.y===g.wheel.y){h.mode='joined';g.joined=true;g.joinAt=s.time;g.wheel.mode='rolling';feedback(s,'The catches seated. The balance wheel is occupied.');}
 }
}
function advanceWheel(s,input,dt){const g=s.machine,b=g.wheel,old={x:b.x,y:b.y};
 if(b.mode==='opening'){
  b.open=Math.min(1,b.open+dt);g.half.x=b.x;g.half.y=b.y-b.open*80;
  if(b.open===1){b.mode='cup';b.occupied=false;g.half.mode='waiting';g.joined=false;g.entryHold=true;}
 }else if(b.mode==='rolling'){
  const r=clockRail(b.p),n=Math.hypot(1,r.slope),dir=s.active===(b.occupant??0)?Number(!!input.right)-Number(!!input.left):0;
  b.v+=((650*r.slope+dir*220)/n-b.v*.025)*dt;b.v=Math.max(-160,Math.min(700,b.v));
  b.p=Math.max(560,Math.min(1640,b.p+b.v/n*dt));Object.assign(b,clockWheelPose(b.p));if(b.p===560&&b.v<0)b.v=0;
  if(b.p===1640&&b.v>240){b.mode='loading';b.load=0;b.launchSpeed=Math.max(470,Math.min(530,b.v*1.25));g.launchAt=s.time;}
 }else if(b.mode==='loading'){
  b.load+=dt;b.y=840+Math.sin(Math.min(1,b.load/.6)*Math.PI)*12;
  if(b.load>=.6){b.mode='flight';b.vx=b.launchSpeed;
   b.vy=-700*820/(2*b.vx);b.y=840;b.flightT=0;g.launchAt=s.time;}
 }else if(b.mode==='flight'){
  b.flightT+=dt;b.x+=b.vx*dt;b.y=840+b.vy*b.flightT+350*b.flightT*b.flightT;
  if(old.x<2460&&b.x>=2460&&b.flightT>0){b.x=2460;b.y=840;b.v=0;b.mode='docking';b.dockT=0;g.dockAt=s.time;}
  else if(b.y>=1180){b.y=1180;b.mode='stranded';b.v=0;}
 }else if(b.mode==='docking'){
  b.dockT+=dt;if(b.dockT>=.75){b.mode='docked';feedback(s,'Wheel meshed. Run to drive the carriage; release to brake.');}
 }else if(b.mode==='recall'){
  const target=b.returnStage===0?{x:b.x,y:840}:{x:1640,y:840},dx=target.x-b.x,dy=target.y-b.y,d=Math.hypot(dx,dy),travel=Math.min(d,200*dt);
  if(d){b.x+=dx/d*travel;b.y+=dy/d*travel;}if(travel===d){b.returnStage++;if(b.returnStage===2){b.p=1640;b.mode='loading';b.load=0;b.launchSpeed=500;}}
 }
 const travelled=Math.hypot(b.x-old.x,b.y-old.y);b.angle+=(b.x>=old.x?1:-1)*travelled/CLOCK_RADIUS;g.cartX=b.x;
}
function advanceTrain(s,input,dt){const g=s.machine,c=g.carrier,old={x:c.x,y:c.y},counterOld=g.counter.y,b=g.wheel;
 if(b.mode==='docked'&&!g.pinBroken){
  const dir=s.active===(b.occupant??0)?Number(!!input.right)-Number(!!input.left):0;
  g.driveV=approach(g.driveV,dir*.045,(dir?.12:.4)*dt);g.drive=Math.max(0,Math.min(1,g.drive+g.driveV*dt));b.angle+=g.driveV*dt*36;
  if(g.drive===1){if(!g.exitLatched)feedback(s,'Upper ratchet locked. The red retaining pin is exposed.');g.exitLatched=true;g.driveV=0;s.power=true;}
 }else g.driveV=0;
 Object.assign(c,clockCarrierPose(g.drive));c.v=Math.hypot(c.x-old.x,c.y-old.y)/dt;g.counter.y=530+390*g.drive;
 for(const h of s.heroes){const p=h.support==='clock-carriage'?{dx:c.x-old.x,dy:c.y-old.y}:h.support==='clock-counter'?{dx:0,dy:g.counter.y-counterOld}:null;if(p&&h.ground&&!h.climbing){h.x+=p.dx;h.y+=p.dy;}}
 if(g.pinBroken){g.collapse=Math.min(1,g.collapse+dt/1.6);if(g.collapse===1&&b.occupied){b.occupied=false;b.mode='released';const e=s.heroes[b.occupant??0];e.support=null;e.ground=false;feedback(s,'The housing is open. The runner can leave.');}}
 if(g.exitLatched){g.ladder=Math.min(g.pinBroken?730:390,g.ladder+dt*260);s.level.ladders=s.level.ladders.filter(l=>!l.release);s.level.ladders.push({x:2900,top:530,bottom:530+g.ladder,release:true});}
 s.level.ladders=s.level.ladders.filter(l=>!l.entry);if(b.mode==='cup')s.level.ladders.push({x:b.x-40,top:b.y,bottom:b.y+56,entry:true});
 if(s.heroes.some(h=>h.ground&&h.x>=920&&h.x<=1460&&Math.abs(h.y+44-650)<3))g.serviceReached=true;
 if(g.serviceReached){g.serviceLadder=Math.min(610,g.serviceLadder+260*dt);s.level.ladders.find(l=>l.x===1450).bottom=650+g.serviceLadder;}
}
export function steamPhase(t){const p=((t%5)+5)%5;return p<3.2?'off':p<4?'charge':'live';}
export function clockworkStep(s,input,dt){
 s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);const g=s.machine,b=g.wheel,a=s.heroes[s.active];for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);
 const captive=b.occupied&&b.mode!=='released';prepareMotion(s,captive&&s.active===(b.occupant??0)?{}:input,dt);
 if(a.id===1&&input.action&&s.cooldown===0){a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580});}
 if(a.id===1&&input.sword&&s.cooldown===0){a.swing=.24;s.cooldown=.3;if(g.exitLatched&&!g.pinBroken&&(2830-a.x)*a.face>=0&&Math.abs(a.x-2830)<75&&Math.abs(a.y+20-510)<45){g.pinBroken=true;g.pinAt=s.time;feedback(s,'Retaining stem broken. The ratchet holds the lift.');}}
 for(const p of s.shots){const old=p.x;p.x+=p.v*dt;if(!g.chainCut&&segmentHit(old,p.y,p.x,p.y,{x:1070,y:360,w:20,h:48})){g.chainCut=true;g.half.mode='fall';g.cutAt=s.time;p.dead=true;feedback(s,'Chain severed. The upper half is falling to the service shelf.');}}
 s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<3300);
 if(input.interact){const o=clockObjects(s).find(o=>Math.abs(a.x-o.x)<o.radius&&Math.abs(a.y-o.y)<66&&o.ready);if(o)feedback(s,o.run());}
 const climbers=[];for(const h of s.heroes){if(h.id===s.active&&!(h.id===0&&captive)){const l=ladderAtHero(s.level,h);if((input.up||input.down)&&l)h.climbing=true;if(input.left||input.right||input.jump)h.climbing=false;}
  if(h.climbing){const l=ladderAtHero(s.level,h);if(!l){h.climbing=false;continue;}const dir=h.id===s.active?Number(!!input.down)-Number(!!input.up):0;climbers.push({h,l,y:Math.max(l.top-44,Math.min(l.bottom-44,h.y+dir*150*dt))});h.moveX=0;h.vy=0;}}
 advanceHalf(s,input,dt);advanceWheel(s,input,dt);advanceTrain(s,input,dt);
 const riders=s.heroes.filter(h=>['clock-carriage','clock-counter'].includes(h.support));
 const cupWalls=['cup','released'].includes(b.mode)?[{x:b.x-80,w:16,top:b.y,bottom:b.y+80,on:true},{x:b.x+64,w:16,top:b.y,bottom:b.y+80,on:true}]:[];
 integrateMotion(s,clockSurfaces(s),cupWalls,dt);
 if(g.pushContact){const o=s.heroes[2];o.x=Math.max(o.x,g.half.x+122);o.vx=g.half.vx;}
 for(const {h,l,y}of climbers){h.x=l.x;h.y=y;h.vy=0;h.ground=true;h.support='ladder';h.climbMoving=h.id===s.active&&(input.up||input.down);}
 for(const h of riders){const c=h.support==='clock-counter'?g.counter:g.carrier;if(h.ground&&h.x+14>c.x&&h.x-14<c.x+c.w&&Math.abs(h.y+44-c.y)<3&&!h.climbing)h.support=c.support;}
 if(b.occupied){const e=s.heroes[b.occupant??0];e.x=b.x;e.y=b.y+12;e.vy=0;e.vx=s.active===e.id?(Number(!!input.right)-Number(!!input.left))*160:0;e.ground=true;e.climbing=false;e.support='clock-wheel';e.walk=(e.walk||0)+Math.abs(e.vx)*dt/9;}
 g.steamClock+=dt;if(b.mode==='docked'&&!g.exitLatched&&steamPhase(g.steamClock)==='live')for(const h of s.heroes)if(h.id!==(b.occupant??0)&&Math.abs(h.x-2140)<38&&h.y+44>800&&h.y<930){const o=s.heroes[2];if(!(o.shieldUp&&Math.abs(o.x-2140)<24&&h.y>=o.y-36&&h.y+44<=o.y+44))damage(s,h,1);}
 s.won=!s.failed&&g.pinBroken&&g.collapse===1&&s.heroes.every(h=>Math.abs(h.x-3090)<85&&Math.abs(h.y+44-530)<4);
}
