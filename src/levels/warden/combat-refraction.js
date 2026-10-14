const q=v=>Math.round(v/2)*2;
export function combatRefractionRegions(s,view,beam){
 const g=s.machine,result=[],add=r=>{
  const x=Math.ceil(Math.max(r.x,view.x)/2)*2,y=Math.ceil(Math.max(r.y,view.y)/2)*2;
  const right=Math.floor(Math.min(r.x+r.w,view.x+view.width)/2)*2,bottom=Math.floor(Math.min(r.y+r.h,view.y+view.height)/2)*2;
  if(right>x&&bottom>y)result.push({...r,x,y,w:right-x,h:bottom-y});
 };
 const age=s.time-(g.slamAt??-10);
 if(!g.braced&&!g.disabled&&age>=0&&age<.65){const radius=q(30+age*260);add({kind:'slam',x:g.footX-radius,y:878,w:radius*2,h:62,centerX:g.footX,power:1-age/.65});}
 for(const wave of g.waves||[])if(wave.age<2.8)add({kind:'wave',x:q(wave.x-28),y:904,w:56,h:36,centerX:wave.x,power:.55*(1-wave.age/2.8)});
 const heatAge=s.time-(g.laserFireAt??-10);
 if(beam&&!g.disabled&&(g.laser?.phase==='fire'||heatAge>=0&&heatAge<.65)){
  const {from,to}=beam;add({kind:'laser',x:q(Math.min(from.x,to.x)-22),y:q(Math.min(from.y,to.y)-22),w:q(Math.abs(to.x-from.x)+44),h:q(Math.abs(to.y-from.y)+44),beam,power:g.laser.phase==='fire'?1:Math.max(0,1-(heatAge-.35)/.3)});
 }
 return result;
}
const buffers=new WeakMap();
export function drawCombatRefraction(c,s,beam){
 const t=c.getTransform(),view={x:-t.e/t.a,y:-t.f/t.d,width:c.canvas.width/t.a,height:c.canvas.height/t.d};
 const regions=combatRefractionRegions(s,view,beam);if(!regions.length)return{regions:[],strips:0,copiedPixels:0};
 const left=Math.min(...regions.map(r=>r.x)),top=Math.min(...regions.map(r=>r.y)),right=Math.max(...regions.map(r=>r.x+r.w)),bottom=Math.max(...regions.map(r=>r.y+r.h));
 const w=(right-left)*t.a,h=(bottom-top)*t.d;
 let b=buffers.get(c.canvas);if(!b){b=document.createElement('canvas');buffers.set(c.canvas,b);}
 if(b.width<w)b.width=Math.ceil(w/32)*32;if(b.height<h)b.height=Math.ceil(h/32)*32;
 const ctx=b.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,w,h);ctx.drawImage(c.canvas,(left-view.x)*t.a,(top-view.y)*t.d,w,h,0,0,w,h);
 c.imageSmoothingEnabled=false;let strips=0;
 for(const r of regions)for(let y=r.y;y<r.y+r.h;y+=4){
  let x=r.x,end=r.x+r.w;
  if(r.kind==='laser'){
   const {from,to}=r.beam,dy=to.y-from.y,dx=to.x-from.x;
   if(Math.abs(dy)>16){const middle=from.x+(y-from.y)*dx/dy,half=Math.min(56,20*Math.hypot(dx,dy)/Math.abs(dy));x=Math.max(x,q(middle-half));end=Math.min(end,q(middle+half));}
  }
  const envelope=Math.sin((y-r.y)/r.h*Math.PI),offset=q(Math.sin(y*.11-s.time*37)*4*r.power*envelope),width=end-x-Math.abs(offset),height=Math.min(4,r.y+r.h-y);
  if(width<=0||offset===0)continue;
  const source=x+Math.max(0,offset),destination=x+Math.max(0,-offset);
  c.drawImage(b,(source-left)*t.a,(y-top)*t.d,width*t.a,height*t.d,destination,y,width,height);strips++;
 }
 return{regions:regions.map(({beam,...r})=>r),strips,copiedPixels:w*h};
}
