import {drawSewerSpray} from './stream-render.js?v=sewer136';
import {drawSewerGlobe,sewerGlobeArtState} from './globe-art.js?v=pub139';
import {lurkerDeathPose} from './lurker-art.js?v=sewer132';
import {drawSewerFog} from './fog.js?v=sewer130';
import {snapPixel as q} from '../../render/pixel-grid.js';
import {sewerLights,sewerLightCone,sewerOccluders,sewerLightAt,sewerFaceLight,SEWER_HATCH_TRAVEL,SEWER_LANDING_TRAVEL} from './light.js?v=sewer136';
import {visibilityPolygon} from './optics.js?v=sewer132';
import {orbitRaster} from '../orbit/raster.js';
import {sewerSprayMount} from './campaign.js?v=sewer136';
const load=name=>{const i=new Image();i.src='assets/sewer125/'+name+'-native.png?v=sewer125';return i;};
const environment=load('environment'),props=load('props'),items=load('items'),grounded=load('grounded'),ready=i=>i.complete&&i.naturalWidth>0;
function crop(c,image,sx,sy,w,h,x,y){if(ready(image))c.drawImage(image,sx,sy,w,h,q(x),q(y),w*2,h*2);}
function cell(c,image,n,x,y,flip=false){if(!ready(image))return;c.save();c.translate(q(x),q(y));if(flip){c.translate(128,0);c.scale(-1,1);}c.drawImage(image,n%4*64,Math.floor(n/4)*64,64,64,0,0,128,128);c.restore();}
function wall(c,x,y,w,h,variant=0){if(w<=0||h<=0)return;c.save();c.beginPath();c.rect(q(x),q(y),q(w),q(h));c.clip();for(let yy=y;yy<y+h;yy+=96)for(let xx=x;xx<x+w;xx+=96)crop(c,environment,variant?68:4,8,48,48,xx,yy);c.restore();}
function floor(c,x,y,w,h=64){c.save();c.beginPath();c.rect(q(x),q(y),q(w),q(h));c.clip();for(let xx=x;xx<x+w;xx+=120){crop(c,environment,130,16,60,10,xx,y);for(let yy=y+20;yy<y+h;yy+=76)crop(c,environment,130,26,60,38,xx,yy);}c.restore();}
function pipe(c,x,top,bottom){c.save();c.beginPath();c.rect(x-24,top,48,bottom-top);c.clip();for(let y=top;y<bottom;y+=112)crop(c,environment,148,67,26,56,x-26,y);c.restore();}
function cable(c,points){c.save();c.strokeStyle='#161b1d';c.lineWidth=8;c.beginPath();points.forEach(([x,y],n)=>n?c.lineTo(q(x),q(y)):c.moveTo(q(x),q(y)));c.stroke();c.strokeStyle='#7f6c4a';c.lineWidth=4;c.stroke();for(let n=1;n<points.length;n++){const a=points[n-1],b=points[n],length=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let t=0;t<length;t+=10){const k=t/length;c.fillStyle='#c6a567';c.fillRect(q(a[0]+(b[0]-a[0])*k)-2,q(a[1]+(b[1]-a[1])*k),4,2);}}c.restore();}
function item(c,n,x,y){if(ready(items))crop(c,items,n*32,0,32,32,x-32,y-56);}
function flame(c,x,y,time,lit=true){if(!lit)return;const f=Math.floor(time*10),h=6+(f%3)*2;c.fillStyle='#a65222';c.fillRect(q(x)-4,q(y)-h,8,h+2);c.fillStyle='#efaf50';c.fillRect(q(x)-2,q(y)-h+2,4,h);c.fillStyle='#fff0b7';c.fillRect(q(x),q(y)-4,2,4);}
const wheelCache=new Map();
function wheel(c,x,y,angle,kind='valve'){if(!ready(props))return;let image=wheelCache.get(kind);if(!image){const b=document.createElement('canvas');b.width=b.height=64;const g=b.getContext('2d');g.imageSmoothingEnabled=false;g.beginPath();g.arc(32,32,kind==='winch'?21:25,0,Math.PI*2);g.clip();if(kind==='winch')g.drawImage(props,64,128,64,64,8,2,64,64);else g.drawImage(props,0,64,64,64,0,0,64,64);image=new Image();image.src=b.toDataURL();wheelCache.set(kind,image);}const b=orbitRaster(image,angle,{size:80,pivotX:32,pivotY:32});if(b)c.drawImage(b,q(x-80),q(y-80),160,160);}
function shutter(c,x,top,w,height,pose,travel){
 // Native narrow iron strips assemble the actual collision width; no stretched pixels.
 const bottom=top+height,leafY=top-travel*pose;c.save();c.beginPath();c.rect(x,top-200,w,height+200);c.clip();
 for(let yy=leafY;yy<leafY+height;yy+=48){const h=Math.min(48,leafY+height-yy);for(let xx=x;xx<x+w;xx+=24){const width=Math.min(24,x+w-xx);crop(c,props,16,144,width/2,h/2,xx,yy);}}
 c.restore();for(const xx of [x-8,x+w])for(let yy=top-160;yy<bottom;yy+=64)crop(c,props,8,135,4,32,xx,yy);
 return{kind:'shutter',x,top,w,height,leafBottom:bottom-travel*pose,pose};
}
function outletPath(c){c.beginPath();c.moveTo(2700,740);c.lineTo(2900,738);c.quadraticCurveTo(3080,740,3270,980);c.lineTo(3300,1060);c.lineTo(3150,1060);c.quadraticCurveTo(2980,820,2780,798);c.lineTo(2700,798);c.closePath();}
function flow(c,s){const g=s.machine;drawSewerSpray(c,s);

 // The floor enters the real outlet channel, whose lower chute is open.
 c.save();outletPath(c);c.clip();c.fillStyle='#163b42';c.fillRect(2700,680,600,420);for(let n=0;n<100;n++){const x=2700+((s.time*220+n*43)%640),dy=Math.max(0,x-2900),y=754+dy*dy*.0015+(n%8-4)*6;c.fillStyle=n%5?'#39686e':'#a1c5bc';c.fillRect(q(x),q(y),12+n%4*4,2);c.fillStyle='#284d55';c.fillRect(q(x-8),q(y+10),22,4);}c.restore();
 for(const h of s.heroes)if(g.captured[h.id]&&!h.sweptAway)for(let n=0;n<6;n++){const x=h.x-24-n*10,y=h.y+32+Math.sin(s.time*8+n)*8;c.fillStyle=n%2?'#9fc5bb':'#477b81';c.fillRect(q(x),q(y),6,2);}
}
function deadLurker(c,e,time){
 const pose=lurkerDeathPose(e,time),image=orbitRaster(props,pose.angle,{size:96,pivotX:32,pivotY:45,crop:[192,192,64,64]});
 if(image){c.save();c.beginPath();c.rect(pose.x-110,pose.floor-240,220,240);c.clip();c.translate(pose.x,pose.y);if(e.dir>0)c.scale(-1,1);c.drawImage(image,-96,0,192,192);c.restore();}
 return {kind:'lurker',id:e.id,x:e.x,sole:e.y,phase:'dead',dead:true,...pose};
}
export function drawSewerWorld(c,s,camera,view){const g=s.machine,contacts=[],lights=sewerLights(s);c.imageSmoothingEnabled=false;c.fillStyle='#060707';c.fillRect(camera.x,camera.y,view.width,view.height);
 // Enclosed rear masonry, with quieter recessed service bays behind grilles.
 wall(c,0,300,3300,460);wall(c,2860,760,440,340);for(const x of [700,1320,1660,2470]){c.save();c.filter='brightness(.48)';cell(c,environment,15,x,632);c.restore();}
 // Pipes and sealed rear grilles are mounted on this masonry, in world space.
 for(let x=80;x<3300;x+=620){pipe(c,x,440,760);c.save();c.filter='brightness(.6)';cell(c,environment,10,x+80,640);c.restore();contacts.push({kind:'rear-fixture',pipeX:x,top:440,base:760,grilleX:x+80,grilleY:640,attachment:'rear-masonry',collision:false});}
 for(const roof of s.level.layout.solids){wall(c,roof.x,300,roof.w,roof.y+roof.h-300);c.save();c.beginPath();c.rect(roof.x,roof.y+roof.h-30,roof.w,30);c.clip();for(let xx=roof.x;xx<roof.x+roof.w;xx+=120)crop(c,environment,194,2,60,15,xx,roof.y+roof.h-30);c.restore();contacts.push({kind:'ceiling',...roof,bottom:roof.y+roof.h});}
 // Broken tavern edges retain the actual opening100..380; warm source above.
 cell(c,environment,8,-28,438);cell(c,environment,9,380,438);item(c,0,230,390);const openingLight=lights.find(l=>l.tavern);if(openingLight)flame(c,openingLight.x,openingLight.y-12,s.time);contacts.push({kind:'entry',opening:[100,380],top:390,land:760,fall:s.heroes.map(h=>({id:h.id,y:h.y,ground:h.ground}))});
 floor(c,0,760,2700,120);floor(c,2700,800,160,80);
 for(const p of s.level.platforms){floor(c,p.x,p.y,p.w,24);for(const x of [p.x+20,p.x+p.w-20])pipe(c,x,p.y+24,760);contacts.push({kind:'service-platform',...p,base:760});}
 const landingY=760-SEWER_LANDING_TRAVEL*g.rope.pose;
 for(const x of [2166,2312])cable(c,[[x,570],[x,landingY+10]]);
 floor(c,2160,landingY,160,20);
 cable(c,[[1050,630],[1050,526],[1196,526],[1196,560-190*g.valve.pose]]);pipe(c,1080,460,640);crop(c,props,20,112,24,12,1026,616);wheel(c,1050,586,g.valve.pose*Math.PI*1.5);contacts.push({kind:'valve',x:1050,y:586,base:640,pose:g.valve.pose});
 const mouth=sewerSprayMount(g.jet);cell(c,environment,13,mouth.x,mouth.y);contacts.push({kind:'spray-mouth',x:g.jet.outletX,y:mouth.y+52,sprite:mouth,jet:{y:g.jet.y,h:g.jet.h},shielded:!!s.heroes[2].sprayBlock,pose:g.jet.pose});
 contacts.push(shutter(c,1180,580,32,180,g.valve.pose,190));
 // Upper winch drives an actual inspection leaf, exposing the physical rope.
 crop(c,grounded,0,0,96,72,1760,512);wheel(c,1824,572,g.hatch.pose*Math.PI*1.5,'winch');cable(c,[[1840,542],[1840,480],[2040,480],[2040,590-SEWER_HATCH_TRAVEL*g.hatch.pose]]);contacts.push({kind:'inspection-winch',x:1824,sole:640,sourceSole:64,pose:g.hatch.pose});contacts.push(shutter(c,2020,600,40,160,g.hatch.pose,SEWER_HATCH_TRAVEL));
 // Golden rope is exposed exactly along x2130 y650..744, at arrow height736.
 cable(c,[[2130,636],[2330,636],[2330,580-160*g.gates[0].pose]]);
 // The severed restraint releases a suspended iron counterweight: its descent
 // raises the outlet leaf and the linked service landing through the overhead cable.
 const weightY=550+140*g.rope.pose;
 pipe(c,2400,540,760);cable(c,[[2130,636],[2170,636],[2170,570],[2170,462],[2400,462],[2400,weightY]]);
 for(let row=0;row<3;row++)crop(c,props,9,136,24,12,2376,weightY+row*24);
 contacts.push({kind:'counterweight',x:2400,top:weightY,bottom:weightY+72,pose:g.rope.pose});
 const ropeTop=650,ropeBottom=744;if(!g.rope.cut)cable(c,[[2130,ropeTop],[2130,ropeBottom]]);else{const t=g.rope.pose;cable(c,[[2130,ropeTop],[2130+q(Math.sin(t*5)*8),ropeTop+32]]);cable(c,[[2130-q(t*10),ropeBottom-10+q(t*28)],[2130,ropeBottom+q(t*28)]]);}
 crop(c,props,148,129,22,8,2108,634);crop(c,props,148,129,22,8,2108,744);contacts.push({kind:'exposed-rope',x:2130,top:650,bottom:744,cut:g.rope.cut,pose:g.rope.pose});contacts.push(shutter(c,2300,600,48,160,g.gates[0].pose,160));
 // Oil barrel has a grounded native foot; wick refuges have connected reservoirs.
 crop(c,grounded,96,0,96,72,424,628);contacts.push({kind:'oil-supply',x:520,sole:760,sourceSole:66});
 for(const a of g.lamps){crop(c,props,148,129,22,8,a.x-22,a.y+42);item(c,0,a.x,a.y+12);item(c,1,a.x,a.y+60);pipe(c,a.x,a.y+12,a.y+30);const light=lights.find(l=>l.id===a.id);flame(c,light?.x??a.x,light?.y??a.y,s.time,a.lit);if(a.oil&&a.fill<1)for(let n=0;n<4;n++){c.fillStyle='#d5ab64';c.fillRect(q(a.x+14),q(a.y+24+(s.time*40+n*5)%28),2,4);}contacts.push({kind:'wick',...a,reservoirBottom:a.y+60,mount:'rear-masonry-bracket'});}
 for(const h of g.hooks){crop(c,environment,146,68,12,8,h.x-12,h.y-44);c.fillStyle='#8b7960';c.fillRect(q(h.x)-2,q(h.y-30),4,22);contacts.push({kind:'lamp-hook',...h,occupied:g.lamp.hookId===h.id});}
 for(const a of s.items){const n={inspectionLamp:0,lampOil:1,bullseyeLens:2}[a.type];if(n!==undefined)item(c,n,a.x,a.y+44);}
 for(const l of lights.filter(a=>a.portable&&!a.spill)){item(c,0,l.housingX,l.housingY+12);flame(c,l.x,l.y,s.time);if(g.lamp.lens){c.fillStyle='#a4c9cd';c.fillRect(q(l.housingX+l.face*10),q(l.housingY-6),4,6);}}
 for(const e of g.lurkers){if(!e.hp){contacts.push(deadLurker(c,e,s.time));continue;}const n=e.phase==='warning'?14:e.phase==='recoil'||e.phase==='retreat'?15:12+Math.floor(s.time*6)%2;cell(c,props,n,e.x-64,e.y-120,e.dir>0);contacts.push({kind:'lurker',id:e.id,x:e.x,sole:e.y,phase:e.phase,warning:e.warning});}
 // Moisture has no self-light: it only becomes visible inside real lamp pools.
 for(let n=0;n<28;n++){const x=430+n*91,y=584+(s.time*50+n*29)%176;c.fillStyle='#728b83';c.fillRect(q(x),q(y),2,4);}for(let x=0;x<2700;x+=86){c.fillStyle='#526766';c.fillRect(x,758,18,2);}
 flow(c,s);const globeArt=sewerGlobeArtState(s);contacts.push({kind:'creation-globe',...globeArt});contacts.push({kind:'water-outlet',captureX:2780,stream:g.stream,captured:[...g.captured],travel:[...g.escapeTravel]});
 return{ready:[environment,props,items,grounded].every(ready)&&(!globeArt||globeArt.ready),mechanic:'sewer',release:'sewer136',contacts,lamps:sewerLights(s),blackAmbient:false,occludedAmbient:true};
}
let mask;
export function drawSewerDarkness(c,s,camera,view){if(s.level.mechanic!=='sewer')return null;
 const globeArt=drawSewerGlobe(c,s);
 // Foreground crests cross the lower body, so capture reads as immersion.
 for(const h of s.heroes)if(s.machine.captured[h.id]&&!h.sweptAway){
  const t=s.machine.escapeTravel[h.id],depth=Math.min(24,t*.18),base=h.y+40-depth;
  const slope=Math.max(0,h.x-2900)*.003,crest=[];
  for(let n=0;n<12;n++){const dx=-44+n*8;crest.push([q(h.x+dx),q(base+slope*dx+Math.sin(n*2+s.time*10)*4)]);}
  c.save();outletPath(c);c.clip();c.beginPath();crest.forEach(([x,y],n)=>n?c.lineTo(x,y):c.moveTo(x,y));c.lineTo(q(h.x+44),q(base+depth+60));c.lineTo(q(h.x-44),q(base+depth+60));c.closePath();c.fillStyle='#163b42';c.fill();
  for(const [n,[x,y]]of crest.entries()){c.fillStyle=n%3?'#5d9295':'#b1cec0';c.fillRect(x,y,n%3?8:4,2);}c.restore();
 }
 // Outlet foreground covers actors only after their continuous440world journey.
 if(ready(environment)){for(let y=818;y<1100;y+=120)wall(c,3110,y,190,120);cell(c,environment,12,3090,812);}
 const width=Math.ceil(view.width/2),height=Math.ceil(view.height/2);if(!mask)mask=document.createElement('canvas');if(mask.width!==width||mask.height!==height){mask.width=width;mask.height=height;}const g=mask.getContext('2d');g.setTransform(.5,0,0,.5,-camera.x/2,-camera.y/2);g.globalCompositeOperation='source-over';const fog=drawSewerFog(g,camera,width*2,height*2,s.time);g.globalCompositeOperation='destination-out';
 const lights=sewerLights(s),walls=sewerOccluders(s);let visible=0;
 for(const l of lights){if(l.x+l.radius<camera.x||l.x-l.radius>camera.x+view.width||l.y+l.radius<camera.y||l.y-l.radius>camera.y+view.height)continue;visible++;const points=visibilityPolygon(l,walls);g.save();g.beginPath();points.forEach((p,n)=>n?g.lineTo(q(p.x),q(p.y)):g.moveTo(q(p.x),q(p.y)));g.closePath();g.clip();if(l.focused){g.beginPath();sewerLightCone(l).forEach((p,n)=>n?g.lineTo(q(p.x),q(p.y)):g.moveTo(q(p.x),q(p.y)));g.closePath();g.clip();}const gradient=g.createRadialGradient(l.x,l.y,0,l.x,l.y,l.radius);gradient.addColorStop(0,'rgba(0,0,0,'+(l.intensity??1)+')');gradient.addColorStop(.44,'rgba(0,0,0,'+(l.intensity??1)+')');gradient.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gradient;g.fillRect(l.x-l.radius,l.y-l.radius,l.radius*2,l.radius*2);g.restore();}
 g.globalCompositeOperation='source-over';c.imageSmoothingEnabled=false;c.drawImage(mask,q(camera.x),q(camera.y),width*2,height*2);
 // Front surfaces receive lamp light while their physical volumes still cast shadows.
 // Redraw the retained native iron art, bounded to the actual moving leaf.
 for(const leaf of sewerOccluders(s).filter(a=>a.kind==='shutter')){
  if(leaf.x+leaf.w<camera.x||leaf.x>camera.x+view.width)continue;
  const top=q(leaf.y);for(let yy=top;yy<top+leaf.h;yy+=16){
   if(yy+16<camera.y||yy>camera.y+view.height)continue;
   const strength=sewerFaceLight(s,leaf,yy+8);if(strength<.02)continue;
   c.save();c.globalAlpha=strength*.82;
   for(let dx=0;dx<leaf.w;dx+=24)crop(c,props,16,144+(yy-top)%48/2,Math.min(24,leaf.w-dx)/2,Math.min(16,top+leaf.h-yy)/2,leaf.x+dx,yy);
   c.restore();
  }
 }
 // The front-facing cap receives the light at its upper edge; the solid slab
 // still occludes everything behind/below it. This is surface lighting, not fill.
 for(const f of sewerOccluders(s).filter(a=>['floor','platform','landing'].includes(a.kind)))for(let x=Math.max(f.x,Math.floor(camera.x/16)*16);x<Math.min(f.x+f.w,camera.x+view.width);x+=16){const strength=Math.max(sewerLightAt(s,x+8,f.y-2),f.kind==='landing'?sewerFaceLight(s,f,f.y+10)*.75:0);if(strength<.02)continue;c.save();c.globalAlpha=strength*.86;c.beginPath();c.rect(x,f.y,Math.min(16,f.x+f.w-x),20);c.clip();floor(c,Math.floor(x/120)*120,f.y,120,20);c.restore();}
 return{globe:globeArt,globePass:'foreground',ambient:0,lights:visible,occluders:walls.length,native:[width,height],readbacks:0,fog};
}
