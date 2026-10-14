const ceil=v=>Math.ceil(v/2)*2,floor=v=>Math.floor(v/2)*2;
function subtract(spans,start,end){
 return spans.flatMap(([a,b])=>end<=a||start>=b?[[a,b]]:
  [[a,Math.max(a,start)],[Math.min(b,end),b]].filter(([x,y])=>y>x));
}
// Decorative-only topology: shared rooms and collision enclosure cover caps.
// Never add a collider or change the wall's world footprint to finish its art.
export function wallBorderPlan(room,level,rooms=[room]){
 const right=room.x+room.w,bottom=room.y+room.h;
 const rectangles=(level.walls||[]).filter(w=>w.on!==false).map(w=>{
  const y=w.top??w.y??0,bottom=w.bottom??(w.h!=null?y+w.h:level.worldBottom);
  return{x:w.x,y,w:w.w,h:bottom-y};
 });
 const surfaces=[...(level.floors||[]),...(level.platforms||[])];
 const edges=[];
 for(const side of ['top','bottom','left','right']){
  const horizontal=side==='top'||side==='bottom';
  const line=side==='top'?room.y:side==='bottom'?bottom:side==='left'?room.x:right;
  let spans=[[horizontal?room.x:room.y,horizontal?right:bottom]];
  if(side==='left'&&room.x<=0||side==='right'&&right>=level.worldWidth)spans=[];
  for(const other of rooms){
   if(other===room)continue;
   const ox=other.x+other.w,oy=other.y+other.h;
   const joins=side==='top'?other.y<line&&oy>=line:side==='bottom'?other.y<=line&&oy>line:
    side==='left'?other.x<line&&ox>=line:other.x<=line&&ox>line;
   if(joins)spans=subtract(spans,horizontal?other.x:other.y,horizontal?ox:oy);
  }
  for(const w of rectangles){
   if(horizontal?w.y<=line&&w.y+w.h>=line:w.x<=line&&w.x+w.w>=line){
    spans=subtract(spans,horizontal?w.x:w.y,horizontal?w.x+w.w:w.y+w.h);
   }
  }
  if(horizontal)for(const f of surfaces)if(f.y===line)spans=subtract(spans,f.x,f.x+f.w);
  for(const [a,b]of spans){const start=ceil(a),end=floor(b);if(end>start)edges.push({side,start,end});}
 }
 const touches=(side,position)=>edges.some(e=>e.side===side&&e.start<=position&&e.end>=position);
 const corners=[];
 for(const vertical of ['top','bottom'])for(const horizontal of ['left','right']){
  const x=horizontal==='left'?room.x:right,y=vertical==='top'?room.y:bottom;
  if(touches(vertical,x)&&touches(horizontal,y))corners.push({kind:vertical+'-'+horizontal,x,y});
 }
 return{edges,corners};
}
