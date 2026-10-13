import {terrainPlan} from './terrain-layout.js?v=terrain48';
const tiles=new Image();tiles.src='assets/water92/terrain-native.png';
export const waterTerrainReady=()=>tiles.naturalWidth>0;
export function drawWaterTerrain(c,x,y,w,h){
 const plan=terrainPlan(x,y,w,h);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
 c.fillStyle='#24312e';c.fillRect(x,y,w,h);
 if(tiles.naturalWidth)for(const t of plan.tiles){
  // One coherent wet-foundry material; variations do not change edge roles.
  const row=t.role==='infill'?5:4;
  c.imageSmoothingEnabled=false;c.drawImage(tiles,t.column*32+t.sx,row*32+t.sy,t.sw,t.sh,t.x,t.y,t.w,t.h);
 }
 c.restore();return plan;
}
