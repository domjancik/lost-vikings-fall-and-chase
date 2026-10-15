import {magneticRails,railContact} from './magnetic.js?v=orbit120';
import {magneticSoles} from './hero-indicator.js?v=orbit117';
const q=n=>Math.round(n/2)*2;
export function magneticRefractionBands(s,view){
 if(s.level.mechanic!=='orbit')return [];
 const result=[];
 for(const [n,p]of s.machine.plates.entries()){
  // The powered well exists independently of whether its carrier is inside it.
  if(n===0?s.machine.sequence===3:s.machine.hookDocked)continue;
  const cx=n===0?1120:2540,cy=n===0?674:444,rx=n===0?230:220,ry=n===0?180:140;
  const top=Math.ceil(Math.max(cy-ry,view.y)/2)*2,bottom=Math.floor(Math.min(cy+ry,view.y+view.height)/2)*2;
  for(let y=top;y<bottom;y+=4){const normalized=(y-cy)/ry,reach=Math.sqrt(Math.max(0,1-normalized*normalized))*rx;
   for(const side of [-1,1]){const middle=cx+side*reach,left=Math.ceil(Math.max(middle-18,view.x)/2)*2,right=Math.floor(Math.min(middle+18,view.x+view.width)/2)*2,offset=q(Math.sin(y*.07-s.time*5)*4),w=right-left-Math.abs(offset);if(w>0)result.push({x:left+Math.max(0,-offset),sourceX:left+Math.max(0,offset),y,w,h:Math.min(4,bottom-y)});}
  }
 }return result;
}
const buffers=new WeakMap();
export function drawMagneticRefraction(c,s){
 if(s.level.mechanic!=='orbit')return null;
 return drawBands(c,magneticRefractionBands(s,canvasView(c)));
}
const canvasView=c=>{const t=c.getTransform();return{x:-t.e/t.a,y:-t.f/t.d,width:c.canvas.width/t.a,height:c.canvas.height/t.d};};
function drawBands(c,bands){
 const t=c.getTransform(),view=canvasView(c);if(!bands.length)return{strips:0,copiedPixels:0};
 const left=Math.min(...bands.map(b=>Math.min(b.x,b.sourceX))),right=Math.max(...bands.map(b=>Math.max(b.x,b.sourceX)+b.w)),top=Math.min(...bands.map(b=>b.y)),bottom=Math.max(...bands.map(b=>b.y+b.h)),w=(right-left)*t.a,h=(bottom-top)*t.d;
 let buffer=buffers.get(c.canvas);if(!buffer){buffer=document.createElement('canvas');buffers.set(c.canvas,buffer);}if(buffer.width<w)buffer.width=Math.ceil(w/32)*32;if(buffer.height<h)buffer.height=Math.ceil(h/32)*32;const ctx=buffer.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,w,h);ctx.drawImage(c.canvas,(left-view.x)*t.a,(top-view.y)*t.d,w,h,0,0,w,h);
 for(const b of bands)c.drawImage(buffer,(b.sourceX-left)*t.a,(b.y-top)*t.d,b.w*t.a,b.h*t.d,b.x,b.y,b.w,b.h);
 return{strips:bands.length,copiedPixels:w*h};
}

export function magneticAttractionPaths(s){
 if(s.level.mechanic!=='orbit')return [];
 const result=[];
 for(const h of s.heroes){if(!h.boots||!h.magnet||h.dead||h.magnet.pull===undefined||h.magnet.pull>=1)continue;const p=magneticRails(s).find(p=>p.id===h.magnet.plateId);if(!p)continue;
  for(const from of magneticSoles(h)){const to=railContact(p,h.magnet.u+from.side*9),distance=Math.hypot(from.x-to.x,from.y-to.y);if(distance>4)result.push({heroId:h.id,side:from.side,from:{x:from.x,y:from.y},to:{x:to.x,y:to.y},distance});}
 }return result;
}
const along=(path,t)=>{const dx=path.to.x-path.from.x,dy=path.to.y-path.from.y,bend=Math.sin(t*Math.PI)*4;return{x:path.from.x+dx*t-dy/path.distance*bend,y:path.from.y+dy*t+dx/path.distance*bend};};
export function magneticAttractionBands(s,view){
 const result=[];
 for(const path of magneticAttractionPaths(s)){const count=Math.ceil(path.distance/3),strength=Math.min(1,path.distance/24);
  for(let n=0;n<=count;n++){const p=along(path,n/count),left=Math.ceil(Math.max(view.x,p.x-7)/2)*2,right=Math.floor(Math.min(view.x+view.width,p.x+7)/2)*2,y=q(p.y),h=Math.min(4,Math.floor((view.y+view.height-y)/2)*2),offset=q(Math.sin(n*.7-s.time*18)*4*strength),w=right-left-Math.abs(offset);if(y>=view.y&&h>0&&w>0)result.push({x:left+Math.max(0,-offset),sourceX:left+Math.max(0,offset),y,w,h});}
 }return result;
}
export function drawMagneticAttraction(c,s){
 if(s.level.mechanic!=='orbit')return null;
 const view=canvasView(c),paths=magneticAttractionPaths(s),stats=drawBands(c,magneticAttractionBands(s,view));
 c.fillStyle='#739daa';for(const path of paths)for(let n=0;n<4;n++){const t=(s.time*2+n/4)%1,p=along(path,t);if(p.x>=view.x&&p.x<view.x+view.width&&p.y>=view.y&&p.y<view.y+view.height)c.fillRect(q(p.x),q(p.y),2,2);}
 return{...stats,paths};
}
