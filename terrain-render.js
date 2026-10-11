import {terrainPlan,terrainMaterial} from './terrain-layout.js?v=terrain48';
const image=new Image();image.src='assets/terrain48/terrain.png?v=terrain48';
export function drawTerrain(ctx,s,x,y,w,h){
 const plan=terrainPlan(x,y,w,h),row=terrainMaterial(s.round,s.campaign);
 ({x,y,w,h}=plan.clip);
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
 // A solid material mass remains while the atlas loads.
 ctx.fillStyle=['#393125','#192b36','#272b3a','#354037','#302a33','#23363d','#282a2c','#393126'][row];ctx.fillRect(x,y,w,h);
 if(image.complete&&image.naturalWidth)for(const t of plan.tiles){ctx.globalAlpha=t.role==='infill'?.65:1;ctx.drawImage(image,t.column*32+t.sx,row*32+t.sy,t.sw,t.sh,t.x,t.y,t.w,t.h);}
 ctx.restore();return {ready:image.complete&&!!image.naturalWidth,row,...plan};
}
