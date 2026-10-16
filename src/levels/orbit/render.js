import {drawShoeRack,shoeRackReady} from './shoe-rack-render.js?v=shoes124';
import {drawMagneticRefraction} from './field-optics.js?v=lode123';
import {drawTerrain} from '../../render/terrain-render.js?v=terrain48';
import {drawConnection,connectionsReady} from '../../render/connection-render.js?v=connections53';
import {createAtlas} from '../../render/sprite-atlas.js?v=orbit113';
import {wallBorderPlan} from '../../render/wall-boundaries.js?v=walls101';
import {drawCycleGateField} from '../../campaigns/machines/cycle-gate.js?v=gate61';
import {rotateNativeRaster} from '../freight/rotor.js?v=orbit113';
import {orbitRaster} from './raster.js?v=orbit113';
import {orbitMount,orbitRope} from './campaign.js?v=orbit134';
import {ORBIT_ART as A,ORBIT_ROOMS,plateArtPlacement,hookArtPlacement,orbitPlaneOffsets,orbitScrapDepthPlan,orbitSceneryColor,orbitGearPlan,orbitSupportPlan,orbitConnectionRoutes,craneWheelAngle} from './art-layout.js?v=orbit122';
import {snapPixel as q} from '../../render/pixel-grid.js?v=orbit113';
const load=n=>{const i=new Image();i.src='assets/orbit113/'+n+'-native.png?v=orbit113';return i;};
const far=load('far'),middle=load('middle'),parts=load('parts');
const fresh=n=>{const i=new Image();i.src='assets/orbit121/'+n+'-native.png?v=orbit121';return i;};
const gear=fresh('gear'),hardware=fresh('hardware');
const plate=fresh('plate');
const ladder=new Image();ladder.src='assets/platform56/ladder.png';
const approved=path=>{const i=new Image();i.src='assets/'+path+'?v=orbit113';return i;};
const cart=approved('freight109/cart-native.png'),wall=approved('depth94/b-native.png');
const iron=createAtlas('assets/freight109/machines-native.png?v=orbit113',4,4),portal=createAtlas('assets/gate61/gate.png?v=orbit113',1,1);
const ready=image=>image.complete&&image.naturalWidth>0;
function part(c,n,x,y){if(ready(parts))c.drawImage(parts,n%4*64,Math.floor(n/4)*64,64,64,q(x),q(y),128,128);}
function metal(c,n,sx,sy,w,h,x,y){if(n===14){if(ready(hardware))c.drawImage(hardware,192+sx,sy,w,h,q(x),q(y),w*2,h*2);return;}if(ready(iron.image))c.drawImage(iron.image,n%4*64+sx,Math.floor(n/4)*64+sy,w,h,q(x),q(y),w*2,h*2);}
function pier(c,x,top,bottom){if(bottom<=top||!ready(hardware))return;
 // Complete authored caps and a separately tiled recessed web; no stretched column.
 c.drawImage(hardware,213,0,22,11,q(x-22),q(top),44,22);
 for(let y=top+22;y<bottom-22;y+=44){const h=Math.min(44,bottom-22-y);c.drawImage(hardware,218,11,14,h/2,q(x-14),q(y),28,h);}
 c.drawImage(hardware,213,44,22,11,q(x-22),q(bottom-22),44,22);
}
function beam(c,left,right,y){c.save();c.translate(q(left),q(y));c.rotate(-Math.PI/2);pier(c,0,0,right-left);c.restore();}
const base=(level,x)=>level.floors.filter(f=>x>=f.x&&x<=f.x+f.w).sort((a,b)=>a.y-b.y)[0]?.y;
function roomWall(c,r,level){if(!ready(wall))return null;c.save();c.beginPath();c.rect(r.x,r.y,r.w,r.h);c.clip();for(let y=r.floorY-104;y>r.y-104;y-=104)for(let x=r.x;x<r.x+r.w;x+=108)c.drawImage(wall,197,10,54,52,q(x),q(y),108,104);c.restore();
 const borders=wallBorderPlan(r,level,ORBIT_ROOMS);for(const e of borders.edges){const horizontal=e.side==='top'||e.side==='bottom',x=e.side==='right'?r.x+r.w-8:r.x,y=e.side==='bottom'?r.y+r.h-8:r.y;c.save();c.beginPath();c.rect(horizontal?e.start:x,horizontal?y:e.start,horizontal?e.end-e.start:8,horizontal?8:e.end-e.start);c.clip();if(horizontal)for(let xx=r.x;xx<e.end;xx+=108)c.drawImage(wall,197,e.side==='top'?7:58,54,4,q(xx),q(y),108,8);else for(let yy=r.floorY-104;yy>e.start-104;yy-=104)c.drawImage(wall,e.side==='left'?197:247,10,4,52,q(x),q(yy),8,104);c.restore();}return{...r,borders,collision:false};
}
const kitCells=new Map();
function kitCell(n){if(!ready(hardware))return null;if(kitCells.has(n))return kitCells.get(n);const b=document.createElement('canvas');b.width=b.height=64;const c=b.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(hardware,n%4*64,Math.floor(n/4)*64,64,64,0,0,64,64);kitCells.set(n,b);return b;}
const cells=new Map(),jawFrames=new Map(),targets=new Map(),visuals=new WeakMap(),debrisPixels=new Map(),debrisFrames=new Map();
function debrisRaster(n,angle){const source=cell(n);if(!source)return null;const phase=((Math.round(angle*180/Math.PI)%360)+360)%360,key=n+':'+phase;if(debrisFrames.has(key))return debrisFrames.get(key);if(!debrisPixels.has(n)){const pad=document.createElement('canvas');pad.width=pad.height=96;const p=pad.getContext('2d');p.imageSmoothingEnabled=false;p.drawImage(source,16,16);debrisPixels.set(n,p.getImageData(0,0,96,96).data);}const b=document.createElement('canvas');b.width=b.height=96;b.getContext('2d').putImageData(new ImageData(rotateNativeRaster(debrisPixels.get(n),96,96,48,48,phase/5),96,96),0,0);if(debrisFrames.size>=16)debrisFrames.delete(debrisFrames.keys().next().value);debrisFrames.set(key,b);return b;}
function cell(n){if(!ready(parts))return null;if(cells.has(n))return cells.get(n);const b=document.createElement('canvas');b.width=b.height=64;const c=b.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(parts,n%4*64,Math.floor(n/4)*64,64,64,0,0,64,64);cells.set(n,b);return b;}
// Dedicated native scenery cells: opaque cool metal, never translucent hazard copies.
const scenerySources=new Map(),sceneryFrames=new Map();
function sceneryRaster(item,far=false){
 const id=(far?'far:':'middle:')+item.kind,size=item.native;
 if(!scenerySources.has(id)){
  const b=document.createElement('canvas');b.width=b.height=size;const c=b.getContext('2d');c.imageSmoothingEnabled=false;
  if(far){
   c.fillStyle='#203344';
   // Broken girders, hollow wheel rims and separated plates read as distant wreckage.
   if(item.kind===0){c.fillRect(4,9,16,4);c.fillRect(5,6,3,12);c.fillRect(16,7,3,10);c.fillRect(8,7,8,2);}
   else if(item.kind===1){c.fillRect(7,4,10,2);c.fillRect(7,18,10,2);c.fillRect(4,7,2,10);c.fillRect(18,7,2,10);for(const [x,y]of [[5,5],[17,5],[5,17],[17,17]])c.fillRect(x,y,2,2);c.fillRect(10,10,4,4);c.fillRect(6,11,12,2);}
   else{c.fillRect(5,10,14,5);c.fillRect(8,7,8,3);c.fillRect(9,15,7,2);c.clearRect(7,11,3,2);c.clearRect(15,10,3,2);}
  }else{
   const source=cell(item.kind);if(!source)return null;
   c.drawImage(source,0,0,64,64,0,0,size,size);
   const pixels=c.getImageData(0,0,size,size);for(let k=0;k<pixels.data.length;k+=4){if(!pixels.data[k+3])continue;const color=orbitSceneryColor(...pixels.data.subarray(k,k+3));pixels.data.set(color,k);pixels.data[k+3]=255;}c.putImageData(pixels,0,0);
  }
  scenerySources.set(id,c.getImageData(0,0,size,size).data);
 }
 const phase=Math.round(item.angle*180/Math.PI/4)*4,key=id+':'+phase;
 if(sceneryFrames.has(key))return sceneryFrames.get(key);
 const b=document.createElement('canvas');b.width=b.height=size;
 b.getContext('2d').putImageData(new ImageData(rotateNativeRaster(scenerySources.get(id),size,size,size/2,size/2,phase/5),size,size),0,0);
 if(sceneryFrames.size>=48)sceneryFrames.delete(sceneryFrames.keys().next().value);sceneryFrames.set(key,b);return b;
}
function drawScenery(c,items,far=false){for(const item of items){const b=sceneryRaster(item,far);if(b)c.drawImage(b,item.x-item.size/2,item.y-item.size/2,item.size,item.size);}}
function jawRaster(t){const open=cell(0),closed=cell(1);if(!open||!closed)return null;const n=Math.round(t*6);if(jawFrames.has(n))return jawFrames.get(n);const b=document.createElement('canvas');b.width=b.height=64;const c=b.getContext('2d');c.imageSmoothingEnabled=false;
 if(n===0)c.drawImage(open,0,0);else if(n===6){c.drawImage(open,0,0,64,35,0,0,64,35);c.drawImage(closed,0,35,64,29,0,35,64,29);c.drawImage(open,22,21,20,19,22,21,20,19);}else{c.drawImage(open,0,0,64,35,0,0,64,35);for(const [x,w,pivot,sign]of [[17,15,24,-1],[32,15,39,1]]){const arm=document.createElement('canvas');arm.width=arm.height=64;const a=arm.getContext('2d');a.drawImage(open,x,35,w,24,x,35,w,24);const data=a.getImageData(0,0,64,64);a.putImageData(new ImageData(rotateNativeRaster(data.data,64,64,pivot,35,sign*n*2/5),64,64),0,0);c.drawImage(arm,0,0);}c.drawImage(open,22,21,20,19,22,21,20,19);}jawFrames.set(n,b);return b;
}
function shutterRaster(aperture,cut){
 const frame=kitCell(0),shutters=kitCell(2),rope=cell(4);if(!frame||!shutters||!rope)return null;
 const opening=cut>0?1:aperture,key='rope:'+Math.round(opening*12)+':'+Math.floor(cut*8);if(targets.has(key))return targets.get(key);
 const b=document.createElement('canvas');b.width=b.height=64;const c=b.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(frame,0,0);
 // Real fiber stays exposed at its registered hit span; the same authored guards slide aside.
 c.drawImage(rope,29,14,7,17,29,14,7,17);c.save();c.globalAlpha=Math.max(0,1-cut);c.drawImage(rope,29,31,7,19,29,31+Math.round(cut*cut*16),7,19);c.restore();
 if(opening<1){const slide=Math.round(opening*24);c.save();c.beginPath();c.rect(12,15,40,34);c.clip();c.drawImage(shutters,6,12,25,42,9-slide,12,25,42);c.drawImage(shutters,32,12,24,42,32+slide,12,24,42);c.restore();}
 if(targets.size>=24)targets.delete(targets.keys().next().value);targets.set(key,b);return b;
}
function visual(s){let v=visuals.get(s.machine);if(!v){v={last:s.time,jaw:s.machine.hook.plateId!==null?1:0};visuals.set(s.machine,v);}const dt=Math.max(0,Math.min(.05,s.time-v.last));v.last=s.time;const wanted=s.machine.hook.plateId!==null||s.machine.hook.grab>.18?1:0;v.jaw+=Math.sign(wanted-v.jaw)*Math.min(Math.abs(wanted-v.jaw),dt/.18);return v;}
function mountedCoil(c,x,y,side,p){const coil=kitCell(4);if(!coil)return;c.save();c.translate(q(x),q(y));c.rotate(side*Math.PI/2);c.drawImage(coil,-64,-126,128,128);c.restore();if(p.phase!=='ground'){c.fillStyle=p.phase==='charge'?'#d6a45a':'#78c4cc';c.fillRect(q(x+side*24-2),q(y-side*56-2),4,4);}}
const switches=new Map(),pieceBounds=new WeakMap();
function switchRaster(aperture,pressed){
 const frame=kitCell(0),strike=kitCell(1),shutters=kitCell(2);if(!frame||!strike||!shutters)return null;
 const a=Math.round(aperture*12),p=Math.round(pressed*6),key=a+':'+p;if(switches.has(key))return switches.get(key);
 const b=document.createElement('canvas');b.width=b.height=64;const c=b.getContext('2d');c.imageSmoothingEnabled=false;
 b.dataset.orbitSprite='spring-switch';b.dataset.pose=key;
 c.drawImage(frame,0,0);
 c.save();c.beginPath();c.rect(12,15,40,34);c.clip();
 // Native cartridge travels into its guard; spring and domed strike remain one machine.
 c.drawImage(strike,Math.round(p/2),Math.round(p/3)-2);
 if(a<12){const slide=Math.round(a*24/12);c.drawImage(shutters,6,12,25,42,9-slide,12,25,42);c.drawImage(shutters,32,12,24,42,32+slide,12,24,42);}
 c.restore();
 c.fillStyle=p===6?'#a8d8ac':'#c7ad74';c.fillRect(30,56,4,2);
 if(switches.size>=96)switches.delete(switches.keys().next().value);switches.set(key,b);return b;
}
function disassemble(c,s,b,r,x,y){
 const age=Math.max(0,s.time-s.machine.releaseAt),pieces=[],floor=base(s.level,r.x)??1180;
 if(!pieceBounds.has(b)){const data=b.getContext('2d').getImageData(0,0,64,64).data;pieceBounds.set(b,Array.from({length:4},(_,n)=>{let bottom=0;for(let yy=0;yy<32;yy++)for(let xx=0;xx<32;xx++)if(data[((Math.floor(n/2)*32+yy)*64+n%2*32+xx)*4+3])bottom=yy+1;return bottom*2;}));}const bounds=pieceBounds.get(b);
 for(let n=0;n<4;n++){const sx=n%2*32,sy=Math.floor(n/2)*32,dx=(n%2?1:-1)*Math.min(70,age*62),dy=Math.min(floor-(y+sy*2+bounds[n]),-age*(n<2?110:60)+age*age*320),px=q(x+sx*2+dx),py=q(y+sy*2+dy);c.drawImage(b,sx,sy,32,32,px,py,64,64);pieces.push({x:px,y:py,bottom:py+bounds[n],floor});}
 if(age<.65)for(let n=0;n<14;n++){const a=n*2.399,dist=age*(75+n*5);c.fillStyle=n%3?'#c4995b':'#e8d6a3';c.fillRect(q(r.x+Math.cos(a)*dist),q(r.y+Math.sin(a)*dist+age*age*130),2,n%2?2:4);}
 return pieces;
}
function target(c,s,n){
 const r=orbitRope(s,n),cut=s.machine.ropePose[n],aperture=r.aperture??Number(r.open),isSwitch=r.kind==='impact-switch',b=isSwitch?switchRaster(Math.max(aperture,cut),cut):shutterRaster(aperture,cut),x=q(r.x-62),y=q(r.y-64);
 let pieces=[];if(b){if(isSwitch&&s.machine.releaseAt!==null)pieces=disassemble(c,s,b,r,x,y);else c.drawImage(b,x,y,128,128);}
 return{kind:isSwitch?'impact-switch':'rope-shutter',id:n,position:[r.x,r.y],artRope:isSwitch?null:[x+62,y+64],ropeSpan:isSwitch?null:[y+28,y+100],open:r.open,aperture,latched:r.cut,press:cut,pieces,mount:n===0?[1340,r.y]:n===1?[3200,r.y]:[r.x,r.y+52]};
}
function craneBrake(c,s){
 const g=s.machine,r=orbitRope(s,4),t=g.brakePose,source=cell(4);
 // Short exposed fiber is exactly the physical588..612 span, between iron ferrules.
 beam(c,2062,2110,566);pier(c,2110,566,588);metal(c,14,22,0,12,5,2098,578);metal(c,14,22,45,12,5,2098,612+Math.round(t*8));
 if(source){c.drawImage(source,29,14,4,6,2106,588,8,12);c.drawImage(source,29,20,4,6,2106,600+q(t*12),8,12);}
 const route=[[2110,624+q(t*8)],[2160,624+q(t*8)],[2160,170],[2210,170]];drawConnection(c,route,'cable');
 // Two actual brake shoes open away from the trolley rail after tension releases.
 for(const side of [-1,1])metal(c,14,22,0,16,9,2164+q(side*t*14),side<0?128:154+q(t*10));
 return{kind:'crane-brake',rope:[2110,588,612],position:[2110,600],pose:t,released:g.ropeCut[4],enabled:t>=.999,cable:route};
}
function panel(c,s){const g=s.machine;const art=kitCell(5);if(art)c.drawImage(art,1666,524,128,128);const t=g.panelPose,n=t<.2?5:t<.72?6:7,floor=n===7?650:634;if(t<1)iron.draw(c,n,1666,floor-122,128,128);if(g.panelOpen){c.fillStyle=g.operator===null?'#689eac':'#bce4d9';c.fillRect(1742,584,6,8);}return{kind:'panel',x:1730,bottom:650,base:60,panelOpen:g.panelOpen,coverPose:t,operator:g.operator,port:[1742,588]};}
export function drawOrbitWorld(c,s,camera,view){const g=s.machine,contacts=[],planes=orbitPlaneOffsets(camera),v=visual(s);c.imageSmoothingEnabled=false;c.fillStyle='#0a172c';c.fillRect(camera.x,camera.y,view.width,view.height);
 if(ready(far))for(let xx=planes.far.x-1536;xx<camera.x+view.width;xx+=1536)c.drawImage(far,xx,planes.far.y,1536,1024);const gears=[],scenery=orbitScrapDepthPlan(s.time,camera);
 drawScenery(c,scenery.far,true);drawScenery(c,scenery.middle);
 for(let xx=planes.middle.x-1536;xx<camera.x+view.width;xx+=1536){for(const item of orbitGearPlan(s.time)){const x=q(xx+item.x),y=q(planes.middle.y+item.y);pier(c,x,y,planes.middle.y+1024);if(x+256<camera.x||x-256>camera.x+view.width||y+256<camera.y||y-256>camera.y+view.height)continue;const b=orbitRaster(gear,item.angle,{size:256,pivotX:128,pivotY:128,brightness:.78});if(b)c.drawImage(b,x-256,y-256,512,512);gears.push({x,y,pitchRadius:228,angle:item.angle,foundation:planes.middle.y+1024});}if(ready(middle))c.drawImage(middle,xx,planes.middle.y,1536,1024);}
 const distantScrap=scenery.middle,farSilhouettes=scenery.far;
 const magneticOptics=drawMagneticRefraction(c,s);const rooms=ORBIT_ROOMS.map(r=>roomWall(c,r,s.level));for(const p of orbitSupportPlan(s.level)){pier(c,p.x,p.top,p.bottom);contacts.push(p);}const fields=[];
 for(const [n,left,right,top,y]of [[0,900,1340,360,674],[1,2300,2780,200,444]]){for(const x of [left,right]){const bottom=base(s.level,x);pier(c,x,top,bottom);contacts.push({kind:'field-post',id:n,x,top,bottom});}beam(c,left,right,top);mountedCoil(c,left-14,y,-1,g.plates[n]);mountedCoil(c,right+14,y,1,g.plates[n]);fields.push({id:n,left,right,top,center:[n===0?1120:2540,y],phase:g.plates[n].phase,charge:g.plates[n].charge});if(n===0?g.sequence!==3:!g.hookDocked){for(let j=0;j<96;j++){const angle=j*Math.PI/48+s.time*.12,xx=(n===0?1120:2540)+Math.cos(angle)*(n===0?230:220),yy=y+Math.sin(angle)*(n===0?180:140);c.fillStyle=j%8<2?'#6a9eae':'#284351';c.fillRect(q(xx),q(yy),j%8<2?4:2,2);}}if(g.plates[n].phase!=='ground')for(let a=0;a<12;a++){const angle=s.time*.8+a*Math.PI/6,x=(n===0?1120:2540)+Math.cos(angle)*190,yy=y+Math.sin(angle)*170;c.fillStyle=a%3?'#426e80':'#80c2ce';c.fillRect(q(x),q(yy),4,a%3?4:6);}}
 for(const x of [2080,3060]){const bottom=base(s.level,x);pier(c,x,140,bottom);contacts.push({kind:'gantry-post',x,top:140,bottom});}beam(c,2080,3060,120);pier(c,3200,120,300);
 const routes=orbitConnectionRoutes(g.hook,orbitRope(s,1),orbitRope(s,0));for(const route of routes.slice(0,3))drawConnection(c,route,'cable');
 for(const p of s.level.floors)drawTerrain(c,{campaign:'story',round:5},p.x,p.y,p.w,p.y===1180?60:48);for(const n of [2,3]){const r=orbitRope(s,n),bottom=base(s.level,r.x);pier(c,r.x,r.y+52,bottom);contacts.push({kind:'restraint-support',id:n,top:r.y+52,bottom});}contacts.push(panel(c,s),...[0,2,3,1].map(n=>target(c,s,n)),craneBrake(c,s));
 // Permanent power circuit links the reusable spring targets; timeout never repairs rope.
 for(const route of [[[1360,662],[1410,662],[1410,994],[1168,994],[1168,950]],[[1168,950],[1168,994],[820,994],[820,758],[880,758]]])drawConnection(c,route,'cable');
 for(const [index,n]of [0,2,3].entries()){const r=orbitRope(s,n);for(let j=0;j<=index;j++){c.fillStyle=g.ropeCut[n]?'#a8dcb5':orbitRope(s,n).open?'#eac37e':'#4e626b';c.fillRect(q(r.x-6-index*5+j*10),q(r.y-58),6,6);}}
 if(g.sequence>0&&g.sequence<3){const remain=Math.max(0,1-(g.plates[0].angle-g.sequenceStartAngle)/(Math.PI*2));c.fillStyle='#253d47';c.fillRect(1032,398,176,6);c.fillStyle=s.time<g.sequenceRecoverUntil?'#c18c61':'#c6b77a';c.fillRect(1032,398,q(176*Math.min(1,remain)),6);}
 // Overhead service steel uses the same authored rail and visible beam mounts.
 pier(c,1690,440,650);beam(c,1690,2080,440);for(const p of g.roofs||[]){beam(c,p.x-p.w/2,p.x+p.w/2,p.y-26);for(const x of [p.x-p.w/2+16,p.x+p.w/2-16])pier(c,x,440,p.y-24);const b=orbitRaster(plate,0,{size:256,pivotX:96,pivotY:48});if(b){c.save();c.beginPath();c.rect(p.x-p.w/2,p.y-24,p.w,48);c.clip();c.drawImage(b,p.x-256,p.y-256,512,512);c.restore();}c.fillStyle='#72b9bd';for(let x=p.x-p.w/2+16;x<p.x+p.w/2-10;x+=24)c.fillRect(q(x),q(p.y+22),12,2);contacts.push({kind:'ceiling-rail',id:p.id,bottom:p.y+24,mountedAt:440});}
 // A U-shaped iron tray receives the actual carrier underside, with open space above.
 beam(c,2708,2860,362);pier(c,2750,376,1180);pier(c,2718,300,348);metal(c,14,22,0,20,9,2700,292);metal(c,14,22,0,20,9,2840,348);
 c.fillStyle=g.hookDocked?'#a7d8b8':'#73a8b0';c.fillRect(2740,352,68,2);contacts.push({kind:'receiving-cradle',slot:{x:2728,y:300,w:132,h:48},trayTop:348,carrierBottom:348,seated:g.hookDocked});

 for(const p of g.plates){const b=orbitRaster(plate,p.angle,{size:256,pivotX:96,pivotY:48}),r=plateArtPlacement(p);if(b)c.drawImage(b,r.x,r.y,r.w,r.h);if(p.phase==='ground'){const x=p.x-p.w/2;metal(c,14,25,12,7,18,x-4,p.y-62);metal(c,14,22,0,16,5,x-28,p.y-62);contacts.push({kind:'push-handle',carrier:p.id,x:x-28,y:p.y-54,base:p.y-24});}contacts.push({kind:'carrier',id:p.id,pivot:r.pivot,nativePivot:[96,48],body:[344,48],flatDeck:[p.x-156,p.y-24,312],angle:p.angle,phase:p.phase,eye:orbitMount(p)});}
 for(const d of g.debris){const b=debrisRaster(d.id?7:6,d.angle);if(b)c.drawImage(b,q(d.x-96),q(d.y-96),192,192);if(d.phase==='warning'){c.fillStyle='#dda75c';for(const [dx,dy]of [[-46,0],[46,0],[0,-46],[0,46]])c.fillRect(q(d.x+dx),q(d.y+dy),4,4);}contacts.push({kind:'floating-debris',id:d.id,x:q(d.x),y:q(d.y),phase:d.phase,angle:d.angle,nativeRotation:true});}
 const hp=hookArtPlacement(g.hook),jaw=jawRaster(v.jaw),cable=drawConnection(c,routes[3],'cable');const wheel=orbitRaster(cart,craneWheelAngle(g.hook),{size:24,pivotX:8,pivotY:8,crop:[88,64,16,16]});if(wheel)c.drawImage(wheel,q(g.hook.x-24),96,48,48);if(jaw)c.drawImage(jaw,hp.x,hp.y,hp.w,hp.h);contacts.push({kind:'hook',stem:[hp.stemX,hp.stemY],cableEnd:[q(g.hook.x),hp.stemY],clampPoint:[q(g.hook.x),q(g.hook.y)],tipY:hp.tipY,jaw:v.jaw,plateId:g.hook.plateId,wheelAngle:craneWheelAngle(g.hook)});
 if(ready(ladder))for(const l of s.level.ladders)for(let y=l.top;y<l.bottom;y+=26){const h=Math.min(26,l.bottom-y);c.drawImage(ladder,0,0,24,h/2,q(l.x-24),q(y),48,h);}
 c.save();c.beginPath();c.rect(3276,194,128,106);c.clip();iron.draw(c,13,3276,194-g.exitPose*104,128,128);c.restore();iron.draw(c,12,3276,194,128,128);contacts.push({kind:'exit-door',frameBottom:300,leafBottom:300-g.exitPose*104,travel:g.exitPose*104});
 const rect={x:3376,y:170,w:128,h:128},p=portal.placement(0,rect,s.level.floors);if(p){drawCycleGateField(c,{...p,active:s.power,glow:.7,frame:Math.floor(s.time*12),aperture:{x:p.x+64,y:p.y+74,w:40,h:80}});portal.drawGrounded(c,0,rect,s.level.floors);contacts.push({kind:'portal',bottom:p.visibleBottom,surface:p.surface.y});}
 contacts.push(drawShoeRack(c,s));
 return{ready:[far,middle,plate,parts,gear,hardware,ladder,cart,wall,iron.image,portal.image].every(ready)&&connectionsReady()&&shoeRackReady(),mechanic:'orbit',contacts,fields,rooms,gears,distantScrap,farSilhouettes,magneticOptics,sequence:g.sequence,sequenceRemaining:Math.max(0,g.sequenceUntil-s.time),parallax:planes,cable:cable.anchors,native:{far:[768,512],middle:[768,512],plate:[192,96],parts:[256,128],hardware:[256,128],gear:[256,256]},releasePose:g.releasePose,brakePose:g.brakePose,operator:g.operator,hookDocked:g.hookDocked,ropeCut:g.ropeCut,exitPose:g.exitPose};
}
