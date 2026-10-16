import {snapPixel} from '../../render/pixel-grid.js';
// Alternating tripod gait, driven by distance rather than a wall clock.
export function lurkerWalkPose(enemy){
 const phase=(enemy.gaitTravel??enemy.travel??0)/48;
 return Array.from({length:6},(_,i)=>{
  const side=i%2,pair=Math.floor(i/2),u=((phase+(pair%2===side?0:.5))%1+1)%1;
  const swing=u>=.5,lift=swing?Math.sin((u-.5)*Math.PI*2):0;
  const hip=-22+pair*20,reach=swing?12-(u-.5)*48:-12+u*48;
  return {side,hip,kneeX:hip+reach*.5+(pair-1)*6,kneeY:-16-lift*4,
   footX:hip+reach+(pair-1)*10,footY:lift?-lift*8:0};
 });
}
let walkingCanvas;
export function drawLurkerWalk(c,image,enemy){
 if(!image.naturalWidth)return null;
 walkingCanvas??=document.createElement('canvas');walkingCanvas.width=64;walkingCanvas.height=64;
 const g=walkingCanvas.getContext('2d');g.imageSmoothingEnabled=false;
 const legs=lurkerWalkPose(enemy);
 function segment(ax,ay,bx,by,far){
  const angle=Math.atan2(by-ay,bx-ax),length=Math.hypot(bx-ax,by-ay);
  g.save();g.beginPath();g.rect(0,0,64,60);g.clip();g.translate(Math.round(ax),Math.round(ay));g.rotate(Math.round(angle*24)/24-Math.PI/2);
  g.beginPath();g.rect(-3,0,6,length);g.clip();
  // Retain the native leg's shaded chitin; no flat outline replacement.
  if(far)g.filter='brightness(.68)';
  for(let y=0;y<length;y+=5)g.drawImage(image,40,242,5,7,-2,y,5,7);
  g.restore();
 }
 for(const l of [...legs].sort((a,b)=>b.side-a.side)){
  const hipX=32+l.hip/2,hipY=47-l.side,kx=32+l.kneeX/2,ky=60+l.kneeY/2,fx=32+l.footX/2,fy=60+l.footY/2;
  segment(hipX,hipY,kx,ky,l.side);segment(kx,ky,fx,fy,l.side);
 }
 // Preserve the shell, face and antennae, removing only the old fixed legs.
 g.save();g.beginPath();[[0,0],[64,0],[64,45],[48,46],[42,48],[24,48],[21,54],[8,56],[0,52]].forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.clip();g.drawImage(image,0,192,64,64,0,0,64,64);g.restore();
 // Rotated clip boundaries can retain fractional alpha on their last row.
 // The exclusive native sole is authoritative, including those edge pixels.
 g.clearRect(0,60,64,4);
 c.save();c.translate(snapPixel(enemy.x),snapPixel(enemy.y-120));if(enemy.dir>0)c.scale(-1,1);c.drawImage(walkingCanvas,-64,0,128,128);c.restore();
 return {travel:enemy.travel||0,legs,sole:enemy.y,frame:'distance-tripod'};
}
// Retained64x64 native cell15. A bounded native raster rotates the detailed art;
// its broad back(y32..60) supplies the floor contact, not antenna padding.
export function lurkerDeathPose(enemy,time){
 const t=Math.max(0,Math.min(1,(time-(enemy.deadAt??time-1))/.42));
 const angle=Math.round((t*t*(3-2*t))*6)*Math.PI/6;
 const hop=t<1?snapPixel(Math.sin(t*Math.PI)*14):0;
 const maxY=Math.max(...[-28,28].flatMap(x=>[-13,15].map(y=>x*Math.sin(angle)+y*Math.cos(angle))));
 return {x:snapPixel(enemy.x),y:snapPixel(enemy.y-hop-96-maxY*2),floor:snapPixel(enemy.y),angle,hop,settled:t===1};
}
