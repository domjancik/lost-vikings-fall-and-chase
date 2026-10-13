import {SHIELD} from './hero-geometry.js?v=vikings70';
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
export function segmentEllipseHit(x0,y0,x1,y1,shape){
 const c=Math.cos(shape.roll),s=Math.sin(shape.roll);
 const transform=(x,y)=>({x:((x-shape.x)*c+(y-shape.y)*s)/shape.rx,y:(-(x-shape.x)*s+(y-shape.y)*c)/shape.ry});
 const a=transform(x0,y0),b=transform(x1,y1),dx=b.x-a.x,dy=b.y-a.y;
 const cc=a.x*a.x+a.y*a.y-1;
 if(cc<=0)return {t:0,x:x0,y:y0};
 const aa=dx*dx+dy*dy,bb=2*(a.x*dx+a.y*dy),disc=bb*bb-4*aa*cc;
 if(aa<1e-12||disc<0)return null;
 const t=(-bb-Math.sqrt(disc))/(2*aa);
 return t>=0&&t<=1?{t,x:x0+(x1-x0)*t,y:y0+(y1-y0)*t}:null;
}
export function shieldHit(o,p,px,py){
 if(!o.shield)return null;
 // Match the shield art: front spans the torso, overhead spans both shoulders.
 const previousX=o.prevX??o.x,previousY=o.prevY??o.y;
 const dx=(p.x-px)-(o.x-previousX),dy=(p.y-py)-(o.y-previousY);
 if(['native85','imagegen88','imagegen90'].includes(o.skin)&&o.shieldArtPose){
  const shape=o.shieldArtPose;
  if(shape.mode==='back'||(shape.mode==='overhead'?dy<=0:dx*o.face>=0))return null;
  const hit=segmentEllipseHit(px-previousX,py-previousY,p.x-o.x,p.y-o.y,shape);
  return hit?{t:hit.t,x:px+(p.x-px)*hit.t,y:py+(p.y-py)*hit.t}:null;
 }
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
