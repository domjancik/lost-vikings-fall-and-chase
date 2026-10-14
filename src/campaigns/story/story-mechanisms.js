export const ease=p=>p*p*(3-2*p);
const approach=(a,b,d)=>a<b?Math.min(b,a+d):Math.max(b,a-d);
export function gateWall(g){const travel=ease(g.progress)*g.h;return {x:g.x,w:32,top:g.y-g.h-travel,bottom:g.y-travel,on:g.progress<1,id:g.id};}
export const liftSurface=l=>({x:l.x,y:l.y,w:l.w,lift:l.id});
export const gateFrameRects=g=>[{x:g.x-10,y:g.y-g.h-20,w:6,h:g.h+20},{x:g.x+36,y:g.y-g.h-20,w:6,h:g.h+20},{x:g.x-10,y:g.y-g.h-20,w:52,h:10}];
// A platform and its occupants share one displacement, including inactive crew.
export function advanceMechanisms(m,heroes,dt){
 for(const g of m.gates)g.progress=approach(g.progress,g.target?1:0,dt/1.1);
 for(const l of m.lifts){const old=l.y,d=l.target-l.y,desired=Math.sign(d)*Math.min(140,Math.sqrt(2*280*Math.abs(d)));l.v=approach(l.v||0,desired,280*dt);let next=l.y+l.v*dt;if((l.target-old)*(l.target-next)<=0){next=l.target;l.v=0;}l.y=next;
  for(const h of heroes)if(!h.transferred&&h.x+14>l.x&&h.x-14<l.x+l.w&&Math.abs(h.y+44-old)<3&&h.vy>=0){h.y+=next-old;h.prevY=h.y;h.vy=0;h.ground=true;}
 }
 for(const p of m.payloads){if(!p.released)continue;p.progress=Math.min(1,p.progress+dt/p.duration);const a=ease(p.progress);p.x=p.fromX+(p.toX-p.fromX)*a;p.y=p.fromY+(p.toY-p.fromY)*a;p.arrived=p.progress>=1;}
}
