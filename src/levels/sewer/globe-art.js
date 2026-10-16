import {snapPixel as q} from '../../render/pixel-grid.js';
import {orbitRaster} from '../orbit/raster.js';
const body=new Image();body.src='assets/alehall135/globe-native.png';
// Distinct image keys retain each component's bounded native rotation cache.
const parts=Array.from({length:8},()=>{const image=new Image();image.src='assets/sewer136/leg-parts-native.png';return image;});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const point=(x,y)=>({x,y});
function knee(hip,ankle,bend){
 const dx=ankle.x-hip.x,dy=ankle.y-hip.y,d=clamp(Math.hypot(dx,dy),2.001,33.999),a=(16*16-18*18+d*d)/(2*d),h=Math.sqrt(Math.max(0,16*16-a*a)),length=Math.hypot(dx,dy)||1;
 return point(hip.x+dx/length*a-dy/length*h*bend,hip.y+dy/length*a+dx/length*h*bend);
}
// Foot placements depend on travelled distance, not a time loop. During each
// stance the world target is constant; opposite tripods alternate every12units.
export function sewerGlobeRig(g){
 const extension=clamp(g.legs||0,0,1),distance=g.distance||0,origin=g.x-distance;
 return Array.from({length:6},(_,id)=>{
  const near=id<3,column=id%3,offset=id%2?12:0,travel=distance+offset,cycle=Math.floor(travel/24),phase=((travel%24)+24)%24,stance=phase<12;
  const base=[-20,0,20][column]+(near?0:2),target=origin+cycle*24+base-offset+6;
  const swing=stance?0:(phase-12)/12;
  const hip=point(g.x+[-12,0,12][column],g.y+(near?10:6));
  const foot=point(mix(hip.x,target+(stance?0:24*(swing*swing*(3-2*swing))),extension),mix(g.y+24,(g.phase==='run'?760:g.y+44)-Math.sin(Math.PI*swing)*10,extension));
  const ankle=point(foot.x,foot.y-8);
  return {id,near,stance,hip,knee:knee(hip,ankle,column===0?1:column===2?-1:near?-1:1),ankle,foot};
 });
}
const angle=(a,b)=>Math.round(Math.atan2(b.y-a.y,b.x-a.x)*36/Math.PI)*Math.PI/36;
function component(c,index,x,y,radians=0){
 const image=parts[index];if(!image.complete||!image.naturalWidth)return;
 const column=index%4,row=Math.floor(index/4),pivot=[[4,7],[4,7],[5,7],[8,8]][column];
 const raster=orbitRaster(image,radians,{brightness:index>=4?.70:1,size:32,pivotX:pivot[0],pivotY:pivot[1],crop:[column*16,row*16,16,16]});
 if(raster)c.drawImage(raster,q(x-32),q(y-32),64,64);
}
function drawLeg(c,leg){const row=leg.near?0:4;component(c,row,leg.hip.x,leg.hip.y,angle(leg.hip,leg.knee));component(c,row+1,leg.knee.x,leg.knee.y,angle(leg.knee,leg.ankle));component(c,row+3,leg.knee.x,leg.knee.y);component(c,row+2,leg.ankle.x,leg.ankle.y);}
export function drawSewerGlobe(c,s){
 const g=s.machine.globe;if(!g||g.phase==='gone')return null;
 c.save();c.imageSmoothingEnabled=false;
 const legs=sewerGlobeRig(g);if(g.legs>.01)for(const leg of legs.filter(a=>!a.near))drawLeg(c,leg);
 // Keep the accepted20px glass sphere, tiny internal creation arms and lower
 // bronze rim. Its center is stable through ball/creature poses.
 const frame=g.phase==='run'?Math.floor(s.time*6)%4:Math.floor(s.time*3)%4;
 if(body.complete&&body.naturalWidth){
  const crop=[frame%2*48+14,Math.floor(frame/2)*48+12,20,22];
  if(g.legs>.01||!g.rotation)c.drawImage(body,...crop,q(g.x-20),q(g.y-20),40,44);
  else {const raster=orbitRaster(body,Math.round(g.rotation*36/Math.PI)*Math.PI/36,{size:48,pivotX:10,pivotY:10,crop});if(raster)c.drawImage(raster,q(g.x-48),q(g.y-48),96,96);}
 }
 if(g.legs>.01){
  // Folded legs emerge from beneath the bronze chassis rather than popping
  // complete knees over the glass while deployment begins.
  c.save();c.beginPath();c.rect(g.x-80,q(g.y+20-8*g.legs),160,120);c.clip();
  for(const leg of legs.filter(a=>a.near))drawLeg(c,leg);c.restore();
 }
 c.restore();return {phase:g.phase,ready:body.complete&&body.naturalWidth>0&&parts.every(a=>a.complete&&a.naturalWidth>0),nativePixel:2,bodyDiameter:40,legCount:g.legs>.01?6:0,legs:legs.map(a=>({...a,visible:g.legs>.01}))};
}
