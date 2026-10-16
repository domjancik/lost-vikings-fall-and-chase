import {SEWER_OUTLET,SEWER_OUTLET_LENGTH,sewerOutletPoint,sewerOutletAtDistance} from './outlet.js?v=sewer150';
import {snapPixel as q} from '../../render/pixel-grid.js';

export function sewerOutletRibbon(c){
 c.beginPath();
 for(const side of [-1,1])for(let n=0;n<=64;n++){
  const p=sewerOutletPoint(side<0?n/64:1-n/64),x=q(p.x-p.ty*p.radius*side),y=q(p.y+p.tx*p.radius*side);
  if(side<0&&n===0)c.moveTo(x,y);else c.lineTo(x,y);
 }
 c.closePath();
}
export function drawSewerOutlet(c,s){
 c.save();sewerOutletRibbon(c);c.clip();c.fillStyle='#153b42';c.fillRect(2670,730,540,180);
 // Surface bands and travelling highlights follow the same arc-length path
 // as the bodies. They converge and darken at the measured pipe aperture.
 for(let n=0;n<100;n++){
  const d=(s.time*(185+n%3*14)+n*37)%SEWER_OUTLET_LENGTH,p=sewerOutletAtDistance(d),end=sewerOutletAtDistance(d+10+n%4*5),offset=(n%9-4)/4*p.radius*.8;
  c.strokeStyle=['#365e64','#4b7c7e','#81aaa4','#b0c8b7','#244a52'][n%5];c.lineWidth=n%4?2:4;
  c.beginPath();c.moveTo(q(p.x-p.ty*offset),q(p.y+p.tx*offset));c.lineTo(q(end.x-end.ty*offset*.9),q(end.y+end.tx*offset*.9));c.stroke();
 }
 for(const side of [-1,1]){
  c.strokeStyle=side<0?'#789f98':'#092b34';c.lineWidth=4;c.beginPath();
  for(let n=0;n<=64;n++){const p=sewerOutletPoint(n/64),x=q(p.x-p.ty*(p.radius-2)*side),y=q(p.y+p.tx*(p.radius-2)*side);if(n)c.lineTo(x,y);else c.moveTo(x,y);}c.stroke();
 }
 c.restore();
 // The visible inner current recedes to a point inside the opening. Nothing
 // painted over the actor substitutes for its own inward movement and scale.
 const m=SEWER_OUTLET.mouth,t=SEWER_OUTLET.throat;
 const p=sewerOutletPoint(1);c.fillStyle='#102e36';c.beginPath();c.moveTo(q(m.x-p.ty*p.radius),q(m.y+p.tx*p.radius));c.lineTo(q(m.x+p.ty*p.radius),q(m.y-p.tx*p.radius));c.lineTo(t.x,t.y);c.closePath();c.fill();
 for(let n=0;n<12;n++){
  const u=(s.time*.9+n/12)%1,r=(1-u)*12,x=m.x+(t.x-m.x)*u,y=m.y+(t.y-m.y)*u;
  c.strokeStyle=n%3?'#315a60':'#71938c';c.lineWidth=2;c.beginPath();c.moveTo(q(x-r),q(y+r*.35));c.lineTo(q(x+r*.5),q(y+r*.55));c.stroke();
 }
 return{mouth:m,throat:t,foregroundCover:false};
}
