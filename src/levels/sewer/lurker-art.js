import {snapPixel} from '../../render/pixel-grid.js';
// Retained64x64 native cell15. A bounded native raster rotates the detailed art;
// its broad back(y32..60) supplies the floor contact, not antenna padding.
export function lurkerDeathPose(enemy,time){
 const t=Math.max(0,Math.min(1,(time-(enemy.deadAt??time-1))/.42));
 const angle=Math.round((t*t*(3-2*t))*6)*Math.PI/6;
 const hop=t<1?snapPixel(Math.sin(t*Math.PI)*14):0;
 const maxY=Math.max(...[-28,28].flatMap(x=>[-13,15].map(y=>x*Math.sin(angle)+y*Math.cos(angle))));
 return {x:snapPixel(enemy.x),y:snapPixel(enemy.y-hop-96-maxY*2),floor:snapPixel(enemy.y),angle,hop,settled:t===1};
}
