import {snapPixel as q} from '../../render/pixel-grid.js?v=arc46';
import {waterAirPockets,waterJet} from './campaign.js?v=water92';
import {waterRefractionBands,waterFlowPhase} from './optics.js?v=water100';
const flora=new Image();flora.src='assets/water92/flora-native.png';
const plants=[[376,1000,0],[462,1000,2],[588,1000,1],[830,1000,3],[1260,1000,0],[1410,1000,2],[1788,1000,1],[1994,1000,3],[887,900,2],[1140,900,0]];
const fronds=new Map(),lightFrames=new Map(),worlds=new WeakMap();
const refractedScenes=new WeakMap();
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const rect=(c,color,x,y,w,h)=>{if(w<=0||h<=0)return;c.fillStyle=color;c.fillRect(q(x),q(y),Math.max(2,q(w)),Math.max(2,q(h)));};
export const waterDecorReady=()=>flora.naturalWidth>0;
function frond(species,phase){
 const key=species+':'+phase;if(fronds.has(key))return fronds.get(key);
 const b=document.createElement('canvas');b.width=40;b.height=48;const c=b.getContext('2d');c.imageSmoothingEnabled=false;
 // Native row displacement models current drag, tapering to ZERO at roots.
 const row=phase<6?0:1;
 for(let y=0;y<48;y++){const bend=Math.round(Math.sin(phase*Math.PI/6+y*.11)*2*Math.pow((47-y)/47,1.7));c.drawImage(flora,species*32,row*48+y,32,1,4+bend,y,32,1);}
 fronds.set(key,b);return b;
}
export function drawWaterPlants(c,s){
 if(!flora.naturalWidth)return;
 for(const [x,floor,species]of plants){const wet=s.machine.waterY<floor-8,phase=wet?Math.floor(s.time*3+x*.015)%12:0;
  c.imageSmoothingEnabled=false;c.drawImage(frond(species,phase),q(x-40),q(floor-92),80,96);
 }
 // Attached moss follows structural footing rather than floating in the basin.
 for(const bank of [320,2100])for(let y=580;y<996;y+=38){const side=bank===320?1:-1;rect(c,'#344b3e',bank-2,y,4,10);rect(c,'#263e34',bank+side*2,y+4,2,8);}
}
function caustic(phase){
 if(lightFrames.has(phase))return lightFrames.get(phase);
 const b=document.createElement('canvas');b.width=b.height=128;const c=b.getContext('2d');
 const seeds=[];for(let y=0;y<4;y++)for(let x=0;x<4;x++){const n=x+y*4,t=phase*Math.PI/6+n*1.7;seeds.push([x*32+16+Math.sin(t)*7,y*32+16+Math.cos(t+n)*7]);}
 const d=c.createImageData(128,128);
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  let a=Infinity,z=Infinity;for(const [sx,sy]of seeds){let dx=Math.abs(x-sx),dy=Math.abs(y-sy);dx=Math.min(dx,128-dx);dy=Math.min(dy,128-dy);const n=Math.hypot(dx,dy);if(n<a){z=a;a=n;}else if(n<z)z=n;}
  const edge=z-a;if(edge>1.8)continue;const i=(y*128+x)*4;d.data[i]=edge<.7?142:91;d.data[i+1]=edge<.7?193:149;d.data[i+2]=edge<.7?171:145;d.data[i+3]=edge<.7?62:27;
 }
 c.putImageData(d,0,0);lightFrames.set(phase,b);return b;
}
function bubbleWorld(s){
 let w=worlds.get(s);if(!w){w={last:s.time,next:s.time,bubbles:[],count:0};worlds.set(s,w);}
 const dt=clamp(s.time-w.last,0,.1);w.last=s.time;
 if(s.time>=w.next&&dt>0){
  w.next=s.time+.4;const emit=(x,y,velocity)=>{const n=w.count++;w.bubbles.push({x,y,vx:Math.sin(n*2.4)*9,vy:-velocity,r:2+n%3,age:0,pop:0});};
  for(const h of s.heroes)if(h.underwater)emit(h.x+(h.face||1)*10,h.y-18,45+(w.count%4)*9);
  if(s.machine.valvePose<.98)emit(696+(w.count%4)*8,Math.max(s.machine.waterY+24,760),70);
  if(s.machine.drainPose>.1)emit(1870+(w.count%6)*10,990,80);
  if(s.machine.waterY<980)emit(s.machine.float.x+28,984,48);
 }
 const pockets=waterAirPockets(s);
 for(const b of w.bubbles){b.age+=dt;if(b.pop){b.pop+=dt;continue;}b.x+=b.vx*dt;b.y+=b.vy*dt;
  const air=pockets.find(p=>b.x>p.x&&b.x<p.x+p.w&&b.y>p.y&&b.y<p.y+p.h);
  if(b.y<=s.machine.waterY+2||air){b.y=air?air.y+air.h:s.machine.waterY;b.pop=.001;}
 }
 w.bubbles=w.bubbles.filter(b=>b.age<9&&b.pop<.2&&b.x>324&&b.x<2096);return w;
}
function drawBubbles(c,s){
 for(const b of bubbleWorld(s).bubbles){
  const x=q(b.x),y=q(b.y);
  if(b.pop){rect(c,'#b8d5c166',x-4,y,4,2);rect(c,'#87bfb766',x+4,y,4,2);continue;}
  for(let yy=-b.r;yy<=b.r;yy++)for(let xx=-b.r;xx<=b.r;xx++){
   // A hollow rounded-square rim has volume even at the smallest native size.
   const radius=Math.max(Math.abs(xx),Math.abs(yy));
   if(radius!==b.r||Math.abs(xx)===b.r&&Math.abs(yy)===b.r)continue;
   rect(c,xx+yy<0?'#b4d7cc85':'#457a8570',x+xx*2,y+yy*2,2,2);
  }
 }
}
function surface(c,s,y){
 for(let x=320;x<2100;x+=2){
  const wave=q(Math.sin(x*.018+s.time*1.6)*4+Math.sin(x*.043-s.time*2.2)*2);
  const shine=Math.sin(x*.023+s.time*.9)+Math.sin(x*.051-s.time*1.2);
  rect(c,'#153c4770',x,y+wave,2,16-wave);
  rect(c,shine>1.1?'#a5c8b9':'#315c6570',x,y+wave,2,2);
  // Independent broken reflection clusters avoid a second parallel ruler line.
  if(shine>.25&&Math.sin(x*.035-s.time*1.9)>.15)rect(c,'#6b9f9b70',x,y+wave+6+q(Math.sin(x*.014+s.time)*2),2,2);
  if(shine<-.75&&Math.sin(x*.077+s.time*.7)>.3)rect(c,'#4b868c55',x,y+wave+14,2,2);
 }
}
function flow(c,s){
 const jet=waterJet(s);if(jet.strength<.004)return;
 const split=clamp(jet.shieldY,444,1000),bands=[[444,split,jet.strength],[split,1000,jet.strength*(1-jet.shelter)]];
 for(const [top,bottom,force]of bands){if(force<.003||bottom<=top)continue;c.save();c.globalAlpha=force;
  for(let y=top;y<bottom;y+=4){const lean=y>s.machine.waterY?-Math.min(18,(y-s.machine.waterY)*.04):0;
   const drift=q(Math.sin(y*.055-s.time*8)*3),x=710+lean+drift,width=22+q(Math.sin(y*.04-s.time*3)*3);
   rect(c,'#478b9860',x-width/2,y,width,4);
   if(waterFlowPhase(y,s.time)<3){rect(c,'#9ecdcbaa',x-8,y,4,4);rect(c,'#79b9c478',x+6,y+2,2,4);}
  }
  c.restore();
 }
 if(jet.shelter>.02){c.save();c.globalAlpha=jet.strength*jet.shelter;
  for(let k=0;k<9;k++){const age=((s.time*3+k/9)%1),side=k%2?1:-1;rect(c,'#adcfc6aa',s.heroes[2].x+side*(12+age*26),split-2+age*age*34,4,2);}
  c.restore();
 }
}
export function drawWaterEffects(c,s){
 if(s.level.mechanic!=='water')return;
 const y=q(s.machine.waterY),pockets=waterAirPockets(s).filter(p=>p.y+p.h>y);
 // Snapshot the actual world and actors before tinting; displace native strips
 // rather than stretching art or averaging contrasting colors.
 const t=c.getTransform(),view={x:-t.e/t.a,y:-t.f/t.d,width:c.canvas.width/t.a,height:c.canvas.height/t.d};
 let copy=refractedScenes.get(c.canvas);if(!copy){copy=document.createElement('canvas');refractedScenes.set(c.canvas,copy);}
 if(copy.width!==c.canvas.width||copy.height!==c.canvas.height){copy.width=c.canvas.width;copy.height=c.canvas.height;}
 const cc=copy.getContext('2d');cc.imageSmoothingEnabled=false;cc.clearRect(0,0,copy.width,copy.height);cc.drawImage(c.canvas,0,0);
 c.imageSmoothingEnabled=false;
 for(const b of waterRefractionBands(y,pockets,s.time,view)){
  c.drawImage(copy,(b.sourceX-view.x)*t.a,(b.y-view.y)*t.d,b.w*t.a,b.h*t.d,b.x,b.y,b.w,b.h);
 }
 c.save();c.beginPath();c.rect(320,y,1780,Math.max(0,1000-y));for(const p of pockets){const top=Math.max(y,q(p.y));c.rect(q(p.x),top,q(p.w),q(p.y+p.h)-top);}c.clip('evenodd');
 const depth=Math.max(1,1000-y);for(let yy=y;yy<1000;yy+=16){const a=.08+.13*(yy-y)/depth;rect(c,`rgba(20,79,89,${a})`,320,yy,1780,Math.min(16,1000-yy));}
 const phase=Math.floor(s.time*4)%12,tile=caustic(phase);c.imageSmoothingEnabled=false;c.globalAlpha=.4;
 for(let yy=y;yy<1000;yy+=256)for(let x=320;x<2100;x+=256)c.drawImage(tile,x,yy,256,256);
 c.globalAlpha=1;
 for(let k=0;k<4;k++){rect(c,`rgba(6,24,31,${.22-k*.05})`,320+k*2,y,2,1000-y);rect(c,`rgba(6,24,31,${.22-k*.05})`,2098-k*2,y,2,1000-y);}
 for(let k=0;k<4;k++)rect(c,`rgba(5,22,28,${.2-k*.045})`,320,998-k*2,1780,2);
 // A narrow cool rim is attached to the retaining stone, with broken reflected
 // glints beside it. It never displaces the physical bank/floor silhouette.
 rect(c,'#588f9470',322,y+4,2,992-y);rect(c,'#588f9470',2096,y+4,2,992-y);
 for(let yy=y+10;yy<992;yy+=18){const shine=Math.sin(yy*.045-s.time*1.7);
  if(shine>.25){rect(c,'#8cbdb875',324,yy,2,6);rect(c,'#8cbdb875',2094,yy+4,2,6);}
 }
 rect(c,'#47777f70',328,996,1764,2);
 c.restore();
 // Clear warm air over dark water; a concave animated meniscus marks the mouth.
 for(const p of pockets){const top=Math.max(y,p.y),height=p.h-(top-p.y);
  rect(c,'#e3d5a143',p.x+2,top+2,p.w-4,height-4);
  for(let k=0;k<3;k++){const shade=`rgba(14,42,43,${.2-k*.055})`;rect(c,shade,p.x+k*2,top,2,height);rect(c,shade,p.x+p.w-2-k*2,top,2,height);}
  for(let x=p.x;x<p.x+p.w;x+=2){const t=(x-p.x)/p.w,bow=q(Math.pow(Math.abs(t-.5)*2,2)*6),yy=p.y+p.h-bow+q(Math.sin(s.time*2+t*5));
   rect(c,'#235b6470',x,yy+2,2,6);
   const shine=t>.15&&t<.85&&Math.sin(t*10-s.time*1.6)>.1;
   rect(c,'#0b303dcc',x,yy+2,2,4);
   rect(c,shine?'#e0eed4':'#93c7bd',x,yy,2,2);
   if(shine)rect(c,'#79bac0aa',x,yy+6,2,2);
  }
  // Warm dry interior, cool water outside and a continuous dark/light rim make
  // the open-bottom breathing boundary readable without revealing puzzle text.
  rect(c,'#bfd5bfaa',p.x,top,2,height-4);rect(c,'#427c89aa',p.x-2,top,2,height);
  rect(c,'#bfd5bfaa',p.x+p.w-2,top,2,height-4);rect(c,'#427c89aa',p.x+p.w,top,2,height);
 }
 surface(c,s,y);drawBubbles(c,s);flow(c,s);
}
