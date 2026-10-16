import {snapPixel as q} from '../../render/pixel-grid.js';
import {sewerSprayGeometry} from './stream.js?v=sewer136';

function ribbon(c,points,time,pose,reflected=false){
 if(!points.length)return;
 c.save();c.globalAlpha=pose;
 // Overlapping native-pixel columns form a continuous curved volume. The
 // highlights run with the same leftward trajectory rather than swimming up it.
 for(let n=0;n<points.length;n++){
  const p=points[n],next=points[n+1]||p,w=Math.max(2,Math.abs(next.x-p.x)+2),x=Math.min(p.x,next.x);
  c.fillStyle='#24494d';c.fillRect(q(x),q(p.y-p.radius),q(w),q(p.radius*2));
  c.fillStyle='#426f71';c.fillRect(q(x),q(p.y-p.radius+2),q(w),Math.max(2,q(p.radius)));
  const phase=((n-Math.floor(time*(reflected?20:38)))%7+7)%7;
  if(phase<3){c.fillStyle=phase===0?'#c0d3bf':'#83aaa4';c.fillRect(q(x),q(p.y-p.radius+4+(n%3)*4),q(w),2);}
  c.fillStyle='#17393e';c.fillRect(q(x),q(p.y+p.radius-2),q(w),2);
 }
 c.restore();
}

export function drawSewerSpray(c,s){
 const g=sewerSprayGeometry(s);if(!g.floor)return g;
 ribbon(c,g.incoming,s.time,g.pose);ribbon(c,g.reflected,s.time,g.pose,true);
 c.save();c.globalAlpha=g.pose;
 const x=g.floor.x,y=g.floor.y,phase=Math.floor(s.time*12);
 // The stream visibly reaches the masonry and spreads as a shallow wet sheen.
 c.fillStyle='#183d41';c.fillRect(q(x-40),q(y-2),80,2);
 c.fillStyle='#638f8b';c.fillRect(q(x-26),q(y-4),48,2);
 for(let n=0;n<8;n++){
  const life=((phase+n*3)%13)/13,side=n%2?1:-1;
  const px=x+side*(6+life*(20+n*2)),py=y-2-Math.sin(life*Math.PI)*(5+n%3*3);
  c.fillStyle=n%3?'#87aaa0':'#c5d5be';c.fillRect(q(px),q(py),n%2?4:2,2);
 }
 c.restore();return g;
}
