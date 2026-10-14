const q=n=>Math.round(n/2)*2;
export function freightWindRegions(s,view){
 const result=[];
 for(const [center,floor,top,power]of [[480,940,490,s.machine.ventPose],[1660,640,215,s.machine.secondDraft]]){
  if(power<=.05)continue;
  const x=Math.ceil(Math.max(center-48,view.x)/2)*2,y=Math.ceil(Math.max(top,view.y)/2)*2;
  const right=Math.floor(Math.min(center+48,view.x+view.width)/2)*2,bottom=Math.floor(Math.min(floor-56,view.y+view.height)/2)*2;
  if(right>x&&bottom>y)result.push({x,y,w:right-x,h:bottom-y,center,top,floor,power});
 }return result;
}
const buffers=new WeakMap();
export function drawFreightWindRefraction(ctx,s,view){
 const transform=ctx.getTransform();
 view={x:-transform.e/transform.a,y:-transform.f/transform.d,width:ctx.canvas.width/transform.a,height:ctx.canvas.height/transform.d};
 const regions=freightWindRegions(s,view);let copiedPixels=0,strips=0;
 if(!regions.length)return{regions,copiedPixels,strips};
 let buffer=buffers.get(ctx.canvas);if(!buffer){buffer=document.createElement('canvas');buffers.set(ctx.canvas,buffer);}
 const native=buffer.getContext('2d');
 for(const region of regions){
  // At most one visible shaft96world units wide, never a full-screen readback.
  const w=Math.ceil(region.w*transform.a),h=Math.ceil(region.h*transform.d);
  if(buffer.width<w)buffer.width=Math.ceil(w/32)*32;if(buffer.height<h)buffer.height=Math.ceil(h/32)*32;
  native.imageSmoothingEnabled=false;
  native.clearRect(0,0,w,h);
  native.drawImage(ctx.canvas,(region.x-view.x)*transform.a,(region.y-view.y)*transform.d,w,h,0,0,w,h);
  copiedPixels+=w*h;
  for(let y=region.y;y<region.y+region.h;y+=8){
   const envelope=Math.sin(Math.min(1,Math.max(0,(y-region.top)/(region.floor-56-region.top)))*Math.PI);
   const offset=q(Math.sin(y*.06+s.time*12)*3*region.power*envelope),width=region.w-Math.abs(offset),height=Math.min(8,region.y+region.h-y);
   if(offset===0||width<=0)continue;
   const sourceX=Math.max(0,offset),destinationX=region.x+Math.max(0,-offset);
   ctx.drawImage(buffer,sourceX*transform.a,(y-region.y)*transform.d,width*transform.a,height*transform.d,destinationX,y,width,height);strips++;
  }
 }return{regions,copiedPixels,strips};
}
