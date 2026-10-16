import {segmentHit} from '../../core/projectile-collision.js';
// A zero-distance hit blocks light unless the ray actually leaves the face.
// In particular an embedded source must never skip through the containing wall.
export function lightWallHit(x0,y0,x1,y1,box){
 const hit=segmentHit(x0,y0,x1,y1,box);if(!hit)return null;
 if(hit.t<1e-9){const dx=x1-x0,dy=y1-y0,eps=1e-7;
  if((x0<=box.x+eps&&dx<0)||(x0>=box.x+box.w-eps&&dx>0)||(y0<=box.y+eps&&dy<0)||(y0>=box.y+box.h-eps&&dy>0))return null;
 }
 return hit;
}
export function visibilityRay(light,angle,walls){const dx=Math.cos(angle)*light.radius,dy=Math.sin(angle)*light.radius;let t=1;for(const wall of walls){const hit=lightWallHit(light.x,light.y,light.x+dx,light.y+dy,wall);if(hit)t=Math.min(t,hit.t);}return{x:light.x+dx*t,y:light.y+dy*t};}
export function visibilityPolygon(light,walls){const angles=Array.from({length:96},(_,n)=>n*Math.PI/48);for(const a of walls)for(const [x,y]of [[a.x,a.y],[a.x+a.w,a.y],[a.x,a.y+a.h],[a.x+a.w,a.y+a.h]]){if(Math.hypot(x-light.x,y-light.y)>light.radius+Math.hypot(a.w,a.h))continue;const angle=Math.atan2(y-light.y,x-light.x);angles.push(angle-.0001,angle,angle+.0001);}return angles.sort((a,b)=>a-b).map(a=>visibilityRay(light,a,walls));}
