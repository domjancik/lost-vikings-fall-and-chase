import {prepareMotion,integrateMotion} from '../../core/movement.js?v=vikings70';
import {segmentHit} from '../../core/projectile-collision.js?v=vikings70';
import {damage} from '../../core/health.js?v=arc46';
import {ladderAtHero} from '../../core/ladder-context.js?v=look58';
import {waterBellPocket} from './bell-geometry.js?v=water87';
import {waterPontoonDeck,WATER_CARRIER_HALF,WATER_CRADLE_SEAT,WATER_CRADLE_WIDTH} from './pontoon-geometry.js?v=water87';
const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
const floor=(x,y,w)=>({x,y,w});
export const waterLevel={name:'THE DROWNED REGULATOR',subtitle:'Borrow a breath. Bring the surface to the depths.',
 story:['The pressure district has drowned its own maintenance crew. One inlet still pours into a chamber with no working drain.','An old compressor floats above a wheeled diving bell. Someone must move the air; someone must work beneath it.'],
 hint:'Shelter the intake with Olaf’s raised shield. Swim below the bulkhead to close its valve. Push the compressor over the drain crank to bring its air bell. Cut the chain, USE to grip, RIGHT to wind. USE releases. All three climb the right ladder.',
 mechanic:'water',worldWidth:2400,worldTop:120,worldBottom:1120,deathY:1160,
 floors:[floor(0,1000,2400),floor(0,540,320),floor(2056,540,344)],platforms:[floor(860,900,320)],
 ladders:[{x:950,top:900,bottom:1000},{x:2080,top:540,bottom:1000}],exit:{x:2300,y:540,w:160}};
export const WATER_BASIN={left:320,right:2100,bottom:1000,bankTop:540};
export function waterBanks(){return[{x:0,w:320,top:540,bottom:1000,on:true},{x:2100,w:300,top:540,bottom:1000,on:true}];}
export const WATER_AIR=12;
export function setupWater(s){
 s.level=waterLevel;s.crate=false;s.turret=false;s.enemies=[];
 for(const h of s.heroes)Object.assign(h,{y:496,ground:true,air:WATER_AIR,airDamage:0});
 s.machine={waterY:540,valveClosed:false,valvePose:0,chainCut:false,chainAt:-1,wound:0,drainPose:0,operator:null,shelter:0,
  float:{x:1020,y:528,w:180,vx:0,support:'water-pontoon'},pushContact:false,drainStarted:false};
}
export const waterJet=s=>({x:682,y:s.machine.waterY,w:56,h:1000-s.machine.waterY,strength:1-s.machine.valvePose,shelter:s.machine.shelter||0,shieldY:s.heroes[2].y-36});
export function waterShelterTarget(s){
 const o=s.heroes[2],plane=o.y-36;
 if(!o.shieldUp||o.dead||plane<444||plane>=1000)return 0;
 // Real projected shield/stream overlap replaces a privileged location box.
 const overlap=Math.max(0,Math.min(1,1-Math.abs(o.x-710)/48));
 return overlap*overlap*(3-2*overlap);
}
export function waterSheltered(s){return waterShelterTarget(s)>.95;}
export function waterAirPockets(s){return[waterBellPocket(940,900),waterBellPocket(s.machine.float.x,1000,true)];}
export function waterSurfaces(s){return [...s.level.floors,...s.level.platforms,{x:s.machine.float.x-WATER_CRADLE_WIDTH/2,y:WATER_CRADLE_SEAT,w:WATER_CRADLE_WIDTH,support:'water-cradle'},{...s.machine.float,x:s.machine.float.x-s.machine.float.w/2}];}
const feedback=(s,message)=>{s.feedback={message,sequence:(s.feedback?.sequence||0)+1};};
export function waterObjects(s){const g=s.machine;return[
 {id:'intake-wheel',x:1100,y:856,radius:56,title:'INLET SHUTOFF',ready:true,done:g.valveClosed,run:()=>{g.valveClosed=true;feedback(s,'The inlet closes. The service gate rises.');return s.feedback.message;}},
 {id:'drain-crank',x:1660,y:956,radius:62,title:g.operator===s.active?'CRANK · RIGHT TO WIND · USE TO RELEASE':'DRAIN CRANK',ready:g.chainCut,done:false,
  reason:'The rusty retaining chain holds the wheel. Cut the chain with a sword.',run:()=>{if(!g.chainCut){feedback(s,'The rusty retaining chain holds the wheel.');return s.feedback.message;}
   const h=s.heroes[s.active];if(!h.ground){feedback(s,'Stand on the maintenance floor to grip the crank.');return s.feedback.message;}
   g.operator=g.operator===s.active?null:s.active;feedback(s,g.operator===null?'Crank released; ratchet holds its position.':'Crank gripped. RIGHT winds; LEFT unwinds; USE releases.');return s.feedback.message;}}
 ];}
function pushPontoon(s,input,dt){
 const g=s.machine,f=g.float,o=s.heroes[2],half=f.w/2,oldX=f.x,oldY=f.y,dir=Number(!!input.right)-Number(!!input.left);
 const contact=s.active===2&&o.waterFloat&&Math.abs(o.y-(f.y-12))<12&&!o.shieldUp&&dir!==0&&
  (dir>0?o.x<f.x&&o.x+42+(o.moveX||0)>=f.x-half-5:o.x>f.x&&o.x-42+(o.moveX||0)<=f.x+half+5);
 g.pushContact=contact;
 f.vx=approach(f.vx,contact?dir*110:0,contact?260*dt:450*dt);f.x+=f.vx*dt;
 const left=g.valvePose<.98&&oldX>796?796+WATER_CARRIER_HALF+8:336+WATER_CARRIER_HALF,right=g.valvePose<.98&&oldX<752?752-WATER_CARRIER_HALF-8:2100-WATER_CARRIER_HALF;
 f.x=Math.max(left,Math.min(right,f.x));if(f.x===left||f.x===right)f.vx=0;
 f.y=waterPontoonDeck(g.waterY);
 if(contact){o.moveX=f.x-oldX;o.vx=f.vx;o.x=dir>0?oldX-half-42:oldX+half+42;}
 for(const h of s.heroes)if(!h.climbing){if(h.support==='water-pontoon'){h.x+=f.x-oldX;h.y+=f.y-oldY;}else if(h.support==='water-cradle')h.x+=f.x-oldX;}
}
function breathing(s,dt){
 const pockets=waterAirPockets(s);
 for(const h of s.heroes){const headY=h.y-20,under=h.x>=320&&h.x<=2100&&headY>s.machine.waterY+2;
  const refuge=pockets.some(p=>h.x>p.x+10&&h.x<p.x+p.w-10&&headY>p.y&&headY<p.y+p.h);
  h.underwater=under&&!refuge;h.inAirPocket=under&&refuge;
  if(h.underwater){h.air=Math.max(0,h.air-dt);if(h.air===0){h.airDamage+=dt;if(h.airDamage>=1){h.airDamage-=1;damage(s,h,1);if(s.failed)s.failure=['Erik','Baleog','Olaf'][h.id]+' ran out of air. Reach the surface or an open-bottom bell.';}}}
  else{h.air=Math.min(WATER_AIR,h.air+dt*8);h.airDamage=0;}
 }
}
export function waterStep(s,input,dt){
 s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);const g=s.machine,a=s.heroes[s.active];
 for(const h of s.heroes){h.swing=Math.max(0,(h.swing||0)-dt);h.bow=Math.max(0,(h.bow||0)-dt);}
 g.valvePose=approach(g.valvePose,g.valveClosed?1:0,dt);
 g.drainPose=approach(g.drainPose,g.wound===1&&g.chainCut?1:0,dt/2);
 const oldWaterY=g.waterY;
 if(g.drainPose>0){g.waterY=Math.min(950,g.waterY+40*g.drainPose*dt);g.drainStarted=true;}
 const surfaceVelocity=(g.waterY-oldWaterY)/dt;
 for(const h of s.heroes){h.waterFloat=h.id===2&&h.x>320&&h.x<2100&&h.y+44>=g.waterY-8;
  h.breach=Math.max(0,(h.breach||0)-dt);h.swimming=h.id===0&&h.x>320&&h.x<2100&&h.y+44>g.waterY+4&&h.breach===0;
 }
 prepareMotion(s,input,dt);
 // The flow retains a short physical response when the shield enters/leaves.
 // Both downstream rendering and force consume this same continuous amount.
 g.shelter+=(waterShelterTarget(s)-g.shelter)*(1-Math.exp(-6*dt));
 if(input.interact){const object=waterObjects(s).find(o=>Math.abs(a.x-o.x)<o.radius&&Math.abs(a.y-o.y)<65);if(object)object.run();}
 if(input.sword&&a.id===1&&s.cooldown===0){a.swing=.24;s.cooldown=.3;if(!g.chainCut&&Math.abs(a.x-1660)<82&&Math.abs(a.y-956)<65&&(1660-a.x)*a.face>=-12){g.chainCut=true;g.chainAt=s.time;feedback(s,'Retaining chain cut. The drain wheel is free.');}}
 if(input.action&&a.id===1&&s.cooldown===0){a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580});}
 for(const p of s.shots){const px=p.x;p.x+=p.v*dt*(p.y>g.waterY?.5:1);if(g.valvePose<.999&&segmentHit(px,p.y,p.x,p.y,{x:752,y:0,w:44,h:850-400*g.valvePose}))p.dead=true;}s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<2400);
 const winding=g.operator===s.active&&Math.abs(a.x-1660)<62&&Math.abs(a.y-956)<65&&a.ground;
 if(g.operator!==null&&s.heroes[g.operator].x!==undefined&&(Math.abs(s.heroes[g.operator].x-1660)>70||Math.abs(s.heroes[g.operator].y-956)>75))g.operator=null;
 if(winding){const dir=Number(!!input.right)-Number(!!input.left);g.wound=Math.max(0,Math.min(1,g.wound+dir*dt/10));if(g.wound>1-1e-8)g.wound=1;a.moveX=0;a.vx=0;a.face=1;}
 const climbs=[];
 for(const h of s.heroes){const active=h.id===s.active,wet=h.x>320&&h.x<2100&&h.y+44>g.waterY+4;
  if(active){const ladder=ladderAtHero(s.level,h);if((input.up||input.down)&&ladder)h.climbing=true;if(input.left||input.right||input.jump)h.climbing=false;}
  if(h.climbing){const ladder=ladderAtHero(s.level,h);if(ladder){const dir=active?Number(!!input.down)-Number(!!input.up):0;climbs.push({h,x:ladder.x,y:Math.max(ladder.top-44,Math.min(ladder.bottom-44,h.y+dir*135*dt))});h.moveX=0;h.vy=-1250*dt;continue;}h.climbing=false;}
  if(h.waterFloat){
   // Damped buoyancy changes velocity, never position. Entering from depth
   // takes time to rise; the feed-forward term follows a receding surface.
   const acceleration=Math.max(-800,Math.min(800,16*(g.waterY-24-h.y)-8*(h.vy-surfaceVelocity)));
   h.vy=Math.max(-180,Math.min(180,h.vy+acceleration*dt))-1250*dt;h.ground=false;continue;
  }
  if(wet&&h.id===0&&h.breach===0){
   if(active&&input.jump&&h.y+44<g.waterY+65){h.breach=.65;h.vy=-570;h.swimming=false;h.ground=false;}
   else{const dir=active?Number(!!input.right)-Number(!!input.left):0,vertical=active?Number(!!input.down)-Number(!!input.up):0;
    h.vx=approach(h.vx,dir*175,650*dt);h.moveX=h.vx*dt;h.swimVy=approach(h.swimVy||0,vertical*160,600*dt);h.vy=h.swimVy-1250*dt;h.ground=false;
    if(active&&input.down&&h.support==='water-pontoon')h.y+=8;
   }
  }else if(wet&&h.id===1){if(!winding){h.vx=Math.max(-110,Math.min(110,h.vx));h.moveX=h.vx*dt;}h.vy=Math.min(h.vy,190-1250*dt);}
  const jet=waterJet(s);if(wet&&h.id!==2&&jet.strength>.02&&h.x>jet.x-18&&h.x<jet.x+jet.w+18){
   const intercepted=h.y+20>jet.shieldY?g.shelter:0;
   h.moveX-=380*jet.strength*(1-intercepted)*dt;
  }
 }
 pushPontoon(s,input,dt);
 const walls=[...waterBanks(),{x:752,w:44,top:0,bottom:850-400*g.valvePose,on:g.valvePose<.999}];
 const surfaces=waterSurfaces(s).filter(p=>!(a.id===0&&input.down&&p.support==='water-pontoon'));
 integrateMotion(s,surfaces,walls,dt);
 const o=s.heroes[2];if(o.waterFloat&&!o.climbing&&!o.ground){o.support='water';o.walk=(o.walk||0)+Math.abs(o.x-o.prevX)/9;}
 for(const {h,x,y}of climbs){h.x=x;h.y=y;h.vy=0;h.ground=true;h.support='ladder';h.climbMoving=h.id===s.active&&(input.up||input.down);}
 for(const h of s.heroes)if(h.id!==2&&h.support===2&&o.waterFloat)h.y=o.y-36-44;
 breathing(s,dt);s.power=g.waterY>=900;
 s.won=!s.failed&&s.power&&s.heroes.every(h=>Math.abs(h.x-2300)<80&&Math.abs(h.y+44-540)<4);
}

