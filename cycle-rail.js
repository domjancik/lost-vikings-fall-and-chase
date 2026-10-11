import {snapPixel} from './pixel-grid.js?v=arc46';
export function cycleRailStatus(g){
 const active=g.carrier.high===260?'upper':'lower',requested=g.selector?'upper':'lower',y=active==='upper'?302:542;
 return {active,requested,queued:active!==requested,y,points:[[850,982],[850,y],[2210,y],[2210,982],[850,982]]};
}
export function railSignals(points,time,moving){
 const phase=moving?(time*48)%128:0,out=[];
 for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],dx=Math.sign(b[0]-a[0]),dy=Math.sign(b[1]-a[1]),length=Math.abs(b[0]-a[0])+Math.abs(b[1]-a[1]);
  for(let d=32+phase;d<length-20;d+=128)out.push({x:snapPixel(a[0]+dx*d),y:snapPixel(a[1]+dy*d),rotation:dx>0?0:dy>0?1:dx<0?2:3});
 }
 return out;
}
