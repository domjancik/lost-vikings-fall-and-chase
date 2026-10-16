import {snapPixel as q} from '../../render/pixel-grid.js';

// architecture-native cell11 is 64px: broad base ends at exclusive row60.
// At its unchanged 128-world size and floor760 its cell origin is1106,640.
// The recess is rows33..37 between the side stones, above the front lip.
const opening={x:1140,y:706,w:54,h:10};
const heatBounds={x:1142,y:624,w:58,h:82};
const palette=['#ad522a','#d98938','#e8b961','#f0d59a'];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export function alehallHearthGeometry(time,view=heatBounds){
 const flames=[];
 for(let n=0;n<16;n++){
  const age=(time*(1.35+n%3*.19)+n*.173)%1;
  const x=q(1168+Math.sin(n*2.4+age*3)*19),h=q(4+(1-age)*(n%4+2));
  const y=clamp(q(716-h-age*2),opening.y,714);
  flames.push({x:clamp(x,opening.x,opening.x+opening.w-4),y,w:4,h:Math.min(h,716-y),color:palette[n%4]});
 }
 const x=Math.ceil(Math.max(heatBounds.x,view.x)/2)*2,y=Math.ceil(Math.max(heatBounds.y,view.y)/2)*2;
 const right=Math.floor(Math.min(heatBounds.x+heatBounds.w,view.x+view.width)/2)*2;
 const bottom=Math.floor(Math.min(heatBounds.y+heatBounds.h,view.y+view.height)/2)*2;
 let heat=null;
 if(right>x&&bottom>y){
  const region={x,y,w:right-x,h:bottom-y},strips=[];
  for(let sy=y;sy<bottom;sy+=4){
   const envelope=Math.sin((sy-heatBounds.y)/heatBounds.h*Math.PI);
   const offset=q(Math.sin(sy*.13-time*7)*2.5*envelope);
   if(offset)strips.push({y:sy,h:Math.min(4,bottom-sy),offset});
  }
  heat={region,strips};
 }
 return{opening:{...opening},flames,heat};
}

const buffers=new WeakMap();
export function drawAlehallHearth(c,s,camera,view){
 // World rendering already has camera/zoom applied. Derive the real visible
 // rectangle from that transform, including mobile canvas backing resolution.
 const t=c.getTransform(),actualView={x:-t.e/t.a,y:-t.f/t.d,width:c.canvas.width/t.a,height:c.canvas.height/t.d};
 const geometry=alehallHearthGeometry(s.time,actualView);
 c.save();c.beginPath();c.rect(opening.x,opening.y,opening.w,opening.h);c.clip();
 for(const f of geometry.flames){c.fillStyle=f.color;c.fillRect(f.x,f.y,f.w,f.h);}c.restore();
 if(!geometry.heat)return{...geometry,readbacks:0};
 const {region,strips}=geometry.heat;
 let buffer=buffers.get(c.canvas);
 if(!buffer){buffer=document.createElement('canvas');buffers.set(c.canvas,buffer);}
 // One native-pixel buffer, at most29×41. No canvas readback, full-screen
 // copy, device-resolution allocation or repeated resampling per strip.
 const w=region.w/2,h=region.h/2;
 if(buffer.width!==w)buffer.width=w;if(buffer.height!==h)buffer.height=h;
 const b=buffer.getContext('2d');b.imageSmoothingEnabled=false;b.clearRect(0,0,w,h);
 b.drawImage(c.canvas,region.x*t.a+t.e,region.y*t.d+t.f,region.w*t.a,region.h*t.d,0,0,w,h);
 c.save();c.imageSmoothingEnabled=false;
 for(const strip of strips){
  const width=region.w-Math.abs(strip.offset),sourceX=Math.max(0,strip.offset),destinationX=region.x+Math.max(0,-strip.offset);
  c.drawImage(buffer,sourceX/2,(strip.y-region.y)/2,width/2,strip.h/2,destinationX,strip.y,width,strip.h);
 }
 c.restore();
 return{...geometry,heat:{...geometry.heat,copiedPixels:w*h,drawnStrips:strips.length},readbacks:0};
}
