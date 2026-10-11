import {createAtlas} from './sprite-atlas.js?v=arc46';
import {connectionPlan,connectionFrame} from './connection-layout.js?v=connections53';
import {snapPixel} from './pixel-grid.js?v=arc46';
const atlas=createAtlas('assets/connections53/connections.png',8,4);
export const connectionsReady=()=>atlas.image.complete&&!!atlas.image.naturalWidth;
export function drawConnectionTile(ctx,cell,x,y,rotation=0){ctx.save();ctx.translate(snapPixel(x),snapPixel(y));ctx.rotate(rotation*Math.PI/2);atlas.draw(ctx,cell,-16,-16,32,32);ctx.restore();}
export function drawConnection(ctx,points,style='cable',{time=0,phase=0,anchors=true}={}){
 const plan=connectionPlan(points,style,{frame:connectionFrame(time,phase)});
 if(!connectionsReady())return {ready:false,...plan};
 for(const t of plan.tiles){ctx.save();if(t.clip){ctx.beginPath();ctx.rect(t.clip.x,t.clip.y,t.clip.w,t.clip.h);ctx.clip();}drawConnectionTile(ctx,t.cell,t.x+16,t.y+16,t.rotation);ctx.restore();}
 if(anchors&&style!=='rail')for(const [i,p]of plan.terminals.entries()){
  const other=plan.anchors[i===0?1:plan.anchors.length-2],vertical=other[0]===p[0];
  drawConnectionTile(ctx,style==='cable'?vertical?15:14:6,p[0],p[1],style==='pipe'&&vertical?1:0);
 }
 return {ready:true,...plan};
}
