import {SHIELD} from './hero-geometry.js?v=far45';
// Swept collisions keep fast shots from skipping narrow shields or solid props.
export function segmentHit(x0,y0,x1,y1,box){
 let enter=0,leave=1;
 for(const [start,delta,min,max] of [[x0,x1-x0,box.x,box.x+box.w],[y0,y1-y0,box.y,box.y+box.h]]){
  if(Math.abs(delta)<1e-9){if(start<min||start>max)return null;continue;}
  let a=(min-start)/delta,b=(max-start)/delta;if(a>b)[a,b]=[b,a];
  enter=Math.max(enter,a);leave=Math.min(leave,b);if(enter>leave)return null;
 }
 return {t:enter,x:x0+(x1-x0)*enter,y:y0+(y1-y0)*enter};
}
export function shieldHit(o,p,px,py){
 if(!o.shield)return null;
 // Match the shield art: front spans the torso, overhead spans both shoulders.
 const previousX=o.prevX??o.x,previousY=o.prevY??o.y;
 const dx=(p.x-px)-(o.x-previousX),dy=(p.y-py)-(o.y-previousY);
 if(o.shieldUp){if(dy<=0)return null;return segmentHit(px-previousX,py-previousY,p.x-o.x,p.y-o.y,{x:-SHIELD.upWidth/2,y:SHIELD.upTop-2,w:SHIELD.upWidth,h:SHIELD.width+4});}
 if(dx*o.face>=0)return null;
 const hit=segmentHit(px-previousX,py-previousY,p.x-o.x,p.y-o.y,{x:o.face===1?14:-42,y:-4,w:SHIELD.width,h:SHIELD.height});
 return hit?{...hit,x:hit.x+o.x,y:hit.y+o.y}:null;
}
export function shieldControls(o,input){
 o.shield=true;
 if(input.overhead||input.jump)o.shieldUp=true;
 else if(input.action)o.shieldUp=false;
}
