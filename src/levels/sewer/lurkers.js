import {damage} from '../../core/health.js';
import {segmentHit} from '../../core/projectile-collision.js';
import {sewerLightAt,sewerLights,sewerOccluders} from './light.js?v=sewer136';

const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
const clear=(walls,e,h)=>{const b=lurkerBounds(e);return !walls.some(a=>segmentHit(b.x+b.w/2,b.y+b.h/2,h.x,h.y+20,a));};
export function lurkerBounds(e){
 const angle=e.rotation||0,c=Math.cos(angle),s=Math.sin(angle);
 const x=e.x+s*24,y=e.y-c*24,w=Math.abs(c)*50+Math.abs(s)*48,h=Math.abs(c)*48+Math.abs(s)*50;
 return{x:x-w/2,y:y-h/2,w,h};
}
function shielded(h,e){return h.id===2&&h.shield&&!h.shieldUp&&(e.x-h.x)*h.face>0&&Math.abs(h.y+44-e.y)<40;}
function hit(s,e,h,emit){
 if(s.noHazards)return;
 if(shielded(h,e)){
  if(!e.recoil){e.recoil=Math.sign(e.x-h.x)*210;s.machine.blocks++;emit(s,'shieldHit',h.x);}
 }else if(damage(s,h,1))emit(s,'impact',h.x);
}
function contact(s,e,walls,emit){
 const b=lurkerBounds(e);
 for(const h of s.heroes)if(!h.dead&&!s.machine.captured[h.id]&&h.x+17>b.x&&h.x-17<b.x+b.w&&h.y+44>b.y&&h.y-28<b.y+b.h&&clear(walls,e,h))hit(s,e,h,emit);
}
function bite(s,e,walls,emit){
 if(e.attack>.15||e.attack<.015)return;
 for(const h of s.heroes){
  const dx=(h.x-e.x)*(e.attackDir||e.dir);
  if(h.dead||s.machine.captured[h.id]||dx<0||dx>110||Math.abs(h.y+44-e.y)>45||!clear(walls,e,h))continue;
  hit(s,e,h,emit);
 }
}
function crawl(s,e,dt){
 const p=e.crawl,wall=sewerOccluders(s).find(a=>a.kind==='shutter'&&a.x===p.wallX);
 if(!wall||Math.abs(wall.y-p.top)>.02){e.crawl=null;e.falling=true;e.vy=0;return;}
 const side=p.dir>0?wall.x:wall.x+wall.w,far=p.dir>0?wall.x+wall.w:wall.x,angle=-p.dir*Math.PI/2;
 const stages=[{x:side,y:760,a:angle},{x:side,y:wall.y,a:angle},{x:side,y:wall.y,a:0},
  {x:far,y:wall.y,a:0},{x:far,y:wall.y,a:-angle},{x:far,y:760,a:-angle},{x:far+p.dir*25,y:760,a:0}];
 const goal=stages[p.stage],dx=goal.x-e.x,dy=goal.y-e.y,d=Math.hypot(dx,dy),travel=Math.min(d,60*dt);
 if(d){e.x+=dx/d*travel;e.y+=dy/d*travel;}
 e.rotation=approach(e.rotation||0,goal.a,Math.PI*2*dt);
 if(d<=travel+.001&&Math.abs(e.rotation-goal.a)<.001){
  // A neighboring service deck leaves too little space for the body to
  // descend that face. Turn on the top and use the exposed side again.
  const blockedExit=p.stage===3&&sewerOccluders(s).some(a=>a.kind==='platform'&&a.y>=wall.y&&a.y<760&&
   (p.dir<0?a.x+a.w>far-110&&a.x<far:a.x<far+110&&a.x+a.w>far));
  if(blockedExit&&!p.returning){p.returning=true;p.dir*=-1;e.dir=p.dir;p.stage=2;}
  else {p.stage++;if(p.stage===stages.length){e.crawl=null;e.rotation=0;e.dir=p.dir;e.phase='patrol';}}
 }
 e.phase=e.crawl?'climb':e.phase;
}
function walk(s,e,dx,walls){
 const dir=Math.sign(dx);if(!dir)return;
 const barrier=walls.find(a=>a.kind==='shutter'&&a.y+a.h>e.y-48&&a.y<e.y&&
  (dir>0?e.x<=a.x-24&&e.x+dx+25>=a.x:e.x>=a.x+a.w+24&&e.x+dx-25<=a.x+a.w));
 if(barrier){
  e.x=dir>0?barrier.x-25:barrier.x+barrier.w+25;
  e.crawl={wallX:barrier.x,top:barrier.y,dir,stage:0};e.recoil=0;e.warning=0;e.attack=0;
 }else e.x=Math.max(1580,Math.min(2220,e.x+dx));
}
export function stepSewerLurkers(s,dt,emit){
 const g=s.machine,walls=sewerOccluders(s);
 for(const e of g.lurkers){
  if(!e.hp){
   if(e.y<760){
    const before=e.y;e.vy=(e.vy||0)+900*dt;e.x+=(e.deathVX||0)*dt;e.y=Math.min(760,e.y+e.vy*dt);
    for(const a of walls)if(e.x>a.x&&e.x<a.x+a.w&&before<=a.y+.01&&e.y>=a.y){e.y=a.y;e.vy=0;}
   }
   continue;
  }
  const oldX=e.x,oldY=e.y;
  if(e.crawl)crawl(s,e,dt);
  else if(e.falling){e.phase='fall';e.vy+=900*dt;e.y=Math.min(760,e.y+e.vy*dt);e.rotation=approach(e.rotation||0,0,Math.PI*2*dt);if(e.y===760){e.falling=false;e.rotation=0;}}
  else if(e.recoil){e.phase='recoil';walk(s,e,e.recoil*dt,walls);e.recoil=approach(e.recoil,0,900*dt);}
  else if(e.phase==='attack'&&e.attack>0){
   e.attack=Math.max(0,e.attack-dt);bite(s,e,walls,emit);
   if(e.attack===0){e.phase='recover';e.recover=.5;}
  }else if(e.recover>0){e.phase='recover';e.recover=Math.max(0,e.recover-dt);}
  else {
   const target=s.heroes.filter(h=>!h.dead&&!g.captured[h.id]&&h.x>1460&&h.x<2290&&Math.abs(h.y+44-e.y)<65&&clear(walls,e,h)).sort((a,b)=>Math.abs(a.x-e.x)-Math.abs(b.x-e.x))[0];
   const lit=sewerLightAt(s,e.x,e.y-25)>.12;
   // Commit the windup's direction. Light can prevent a new attack, but a
   // flame's one-pixel flicker cannot erase a bite already being performed.
   if(e.phase==='warning'){
    e.warning+=dt;
    if(e.warning>=.7){e.phase='attack';e.attack=.2;e.attackCount=(e.attackCount||0)+1;e.attackDir=e.dir;e.warning=0;emit(s,'sewerClaw',e.x);bite(s,e,walls,emit);}
   }else if(lit){
    e.phase='retreat';e.warning=0;
    const source=sewerLights(s).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];
    if(source&&Math.abs(e.x-source.x)>16)e.dir=e.x>=source.x?1:-1;
    // At the outer refuge edge, stop instead of flipping against the clamp.
    walk(s,e,e.dir*100*dt,walls);
   }else if(target){
    const dx=target.x-e.x;if(Math.abs(dx)>8)e.dir=Math.sign(dx);
    if(Math.abs(dx)<=110){e.phase='warning';e.warning=dt;e.attackDir=e.dir;}
    else {e.phase='stalk';e.warning=0;walk(s,e,e.dir*48*dt,walls);}
   }else{
    e.phase='patrol';e.warning=0;
    if(e.x>=2200&&e.dir>0)e.dir=-1;
    else if(e.x<=1650&&e.dir<0)e.dir=1;
    walk(s,e,e.dir*20*dt,walls);
   }
  }
  const dx=e.x-oldX,dy=e.y-oldY;
  e.travel=(e.travel||0)+Math.hypot(dx,dy);
  e.gaitTravel=(e.gaitTravel||0)+(dy?Math.hypot(dx,dy):dx*e.dir);
  contact(s,e,walls,emit);
 }
}
