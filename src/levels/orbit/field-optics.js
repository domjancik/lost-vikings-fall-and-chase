const q=n=>Math.round(n/2)*2;
export function magneticRefractionBands(s,view){
 if(s.level.mechanic!=='orbit')return [];
 const result=[];
 for(const [n,p]of s.machine.plates.entries()){
  if(['ground','parked','dock','seating'].includes(p.phase))continue;
  const cx=n===0?1120:2540,cy=n===0?674:444,rx=230,ry=180;
  const top=Math.ceil(Math.max(cy-ry,view.y)/2)*2,bottom=Math.floor(Math.min(cy+ry,view.y+view.height)/2)*2;
  for(let y=top;y<bottom;y+=4){const normalized=(y-cy)/ry,reach=Math.sqrt(Math.max(0,1-normalized*normalized))*rx;
   for(const side of [-1,1]){const middle=cx+side*reach,left=Math.ceil(Math.max(middle-18,view.x)/2)*2,right=Math.floor(Math.min(middle+18,view.x+view.width)/2)*2,offset=q(Math.sin(y*.07-s.time*5)*4),w=right-left-Math.abs(offset);if(w>0)result.push({x:left+Math.max(0,-offset),sourceX:left+Math.max(0,offset),y,w,h:Math.min(4,bottom-y)});}
  }
 }return result;
}
const buffers=new WeakMap();
export function drawMagneticRefraction(c,s){
 if(s.level.mechanic!=='orbit')return null;
 const t=c.getTransform(),view={x:-t.e/t.a,y:-t.f/t.d,width:c.canvas.width/t.a,height:c.canvas.height/t.d},bands=magneticRefractionBands(s,view);if(!bands.length)return{strips:0,copiedPixels:0};
 const left=Math.min(...bands.map(b=>Math.min(b.x,b.sourceX))),right=Math.max(...bands.map(b=>Math.max(b.x,b.sourceX)+b.w)),top=Math.min(...bands.map(b=>b.y)),bottom=Math.max(...bands.map(b=>b.y+b.h)),w=(right-left)*t.a,h=(bottom-top)*t.d;
 let buffer=buffers.get(c.canvas);if(!buffer){buffer=document.createElement('canvas');buffers.set(c.canvas,buffer);}if(buffer.width<w)buffer.width=Math.ceil(w/32)*32;if(buffer.height<h)buffer.height=Math.ceil(h/32)*32;const ctx=buffer.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,w,h);ctx.drawImage(c.canvas,(left-view.x)*t.a,(top-view.y)*t.d,w,h,0,0,w,h);
 for(const b of bands)c.drawImage(buffer,(b.sourceX-left)*t.a,(b.y-top)*t.d,b.w*t.a,b.h*t.d,b.x,b.y,b.w,b.h);
 return{strips:bands.length,copiedPixels:w*h};
}
