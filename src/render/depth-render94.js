import {depthPlan} from './depth-layout94.js?v=depth94';
import {snapPixel as q} from './pixel-grid.js?v=depth94';
import {wallBorderPlan} from './wall-boundaries.js?v=walls101';
const sheets=['a','b'].map(name=>{const i=new Image();i.src='assets/depth94/'+name+'-native.png';return i;});
export const depthReady=()=>sheets.every(i=>i.naturalWidth>0);
function atlas(theme){return{image:sheets[Math.floor(theme/3)],row:theme%3};}
function cell(c,theme,kind,x,y){const {image,row}=atlas(theme);if(!image.naturalWidth)return;c.imageSmoothingEnabled=false;c.drawImage(image,kind*64,row*64,64,64,q(x),q(y),128,128);}
function wallTile(c,theme,x,y){const {image,row}=atlas(theme);if(!image.naturalWidth)return;c.imageSmoothingEnabled=false;c.drawImage(image,197,row*64+10,54,52,q(x),q(y),108,104);}
// Authored masonry perimeter pixels become reusable coping/end/corner tiles.
// Fixed 1:2 source/world scale; clipped final tiles never stretch their pixels.
function wallBorders(c,theme,room,border){
 const {image,row}=atlas(theme);if(!image.naturalWidth)return;
 const top=theme<3?(theme===2?8:7):theme===3?7:theme===4?8:9;
 const sx=197,sy=row*64+top,edge=4,size=edge*2,leftSource=theme<3?196:197,rightSource=theme<3?252:251;
 const piece=(x,y,w,h,dx,dy)=>c.drawImage(image,x,y,w,h,q(dx),q(dy),w*2,h*2);
 for(const e of border.edges){
  const horizontal=e.side==='top'||e.side==='bottom';
  const x=e.side==='right'?room.x+room.w-size:room.x;
  const y=e.side==='bottom'?room.y+room.h-size:room.y;
  c.save();c.beginPath();c.rect(horizontal?e.start:x,horizontal?y:e.start,horizontal?e.end-e.start:size,horizontal?size:e.end-e.start);c.clip();
  if(horizontal){
   for(let xx=room.x;xx<e.end;xx+=108)piece(sx,e.side==='top'?sy:row*64+62-edge,54,edge,xx,y);
  }else{
   // Match the infill's floor-anchored brick courses along the whole end face.
   for(let yy=room.floorY-104;yy>e.start-104;yy-=104)piece(e.side==='left'?leftSource:rightSource-edge,row*64+10,edge,52,x,yy);
  }
  c.restore();
 }
 for(const corner of border.corners){
  const left=corner.kind.endsWith('left'),upper=corner.kind.startsWith('top');
  piece(left?leftSource:rightSource-edge,upper?sy:row*64+62-edge,edge,edge,corner.x-(left?0:size),corner.y-(upper?0:size));
 }
}
export function drawDepthMidground(c,s){
 const plan=depthPlan(s);if(plan.theme<0)return plan;
 // Non-contact enclosure planes render behind mechanisms and actors. Their
 // visible bottom meets the authored room floor, independently of parallax.
 const roomBorders=[];
 for(const room of plan.rooms||[]){c.save();c.beginPath();c.rect(room.x,room.y,room.w,room.h);c.clip();
  for(let y=room.floorY-104;y>room.y-104;y-=104)
   for(let x=room.x;x<room.x+room.w;x+=108)wallTile(c,plan.theme,x,y);
  c.restore();
  const border=wallBorderPlan(room,s.level,plan.rooms);wallBorders(c,plan.theme,room,border);roomBorders.push({room,...border});
 }
 const wallBackings=[];
 for(const p of plan.props){
  if(p.kind===2){
   const backing={x:p.x-54,y:p.floorY-104,w:108,h:104,floorY:p.floorY},border=wallBorderPlan(backing,s.level,plan.rooms);
   wallTile(c,plan.theme,backing.x,backing.y);wallBorders(c,plan.theme,backing,border);wallBackings.push({room:backing,...border});
   cell(c,plan.theme,2,p.x-64,p.floorY-144);
  }
  else cell(c,plan.theme,p.kind,p.x-64,p.floorY-124);
 }
 return{...plan,roomBorders,wallBackings,ready:depthReady()};
}
export function drawDepthWallFaces(c,s){
 const plan=depthPlan(s);if(plan.theme<0)return;
 for(const w of plan.walls){c.save();c.beginPath();c.rect(w.x,w.y,w.w,w.h);c.clip();
  for(let x=w.x;x<w.x+w.w;x+=108)wallTile(c,plan.theme,x,w.y);
  c.restore();
 }
}
