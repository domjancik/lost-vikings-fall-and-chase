// Generated source registration. One native pixel always spans two world units.
import {waterBellPocket} from './bell-geometry.js?v=water92';
const sheet=new Image();sheet.src='assets/water92/machines-native.png';
const nozzle=new Image();nozzle.src='assets/water92/nozzle-native.png';
const link=new Image();link.src='assets/water87/link-native.png';
const cradle=new Image();cradle.src='assets/water92/cradle-native.png';
const snap=n=>Math.round(n/2)*2;
const CELL=96,BASE=92;
export const WATER92={cell:CELL,baseline:BASE,pixelWorld:2,
 pontoon:{cell:0,deckY:64,visibleFootBaseline:88,outlet:[91,43],tow:[4,70],support:[3,93]},
 mobileBell:{cell:1,crown:[47,4],pocket:[37,44,22,36],visibleFootBaseline:90},
 fixedBell:{cell:2,crown:[48,4],pocket:[36,44,26,36]},
 crank:{cell:3,wheel:[42,60],collar:[77,42]},
 wheel:{cell:4,pivot:[40,60],rimRadii:[32,32]},rod:{cell:5,head:[48,13]},
 valve:{cell:6,wheel:[47,65],inlet:[47,15]},valveWheel:{cell:7,pivot:[41,65],rimRadii:[26,26]},
 sluice:{cell:8,aperture:[29,71,40,8]},cover:{cell:9,pivot:[48,79]},
 gate:{cell:10,core:[37,46,22,32]},chain:{cell:11,apex:[48,30]}};
function cell(c,n,x,y){if(!sheet.naturalWidth)return false;c.imageSmoothingEnabled=false;c.drawImage(sheet,n%4*CELL,Math.floor(n/4)*CELL,CELL,CELL,snap(x),snap(y),192,192);return true;}
export function water92GroundPlacement(x,floor){return{x:snap(x-96),y:snap(floor-BASE*2),floor:snap(floor)};}
export function water92Port(p,anchor){return{x:snap(p.x+anchor[0]*2),y:snap(p.y+anchor[1]*2)};}
export function drawWater92Grounded(c,n,x,floor){const p=water92GroundPlacement(x,floor);cell(c,n,p.x,p.y);return{...p,cell:n,visibleBottom:p.y+184};}
export function drawWater92Pontoon(c,x,deckY){const p={x:snap(x-96),y:snap(deckY-WATER92.pontoon.deckY*2)};cell(c,0,p.x,p.y);return{...p,deckY:snap(deckY),outlet:water92Port(p,WATER92.pontoon.outlet),tow:water92Port(p,WATER92.pontoon.tow),visibleBottom:p.y+176,opaqueBottom:p.y+184};}
export function drawWater92Bell(c,x,floor,mobile=false){
 const info=mobile?WATER92.mobileBell:WATER92.fixedBell;
 // The mobile bell's final two near-black narrowing tyre rows are not its
 // broad visible contact band. Seat that reviewed band at the floor; dark
 // exterior rubber/shadow may overlap the floor by two native pixels.
 const p=mobile?{x:snap(x-96),y:snap(floor-180),floor:snap(floor),cell:1,visibleBottom:snap(floor),opaqueBottom:snap(floor+4)}:drawWater92Grounded(c,info.cell,x,floor);
 if(mobile)cell(c,1,p.x,p.y);
 return{...p,crown:water92Port(p,info.crown),pocket:waterBellPocket(x,floor,mobile)};
}
const rotationCaches=new Map();
function rotated(n,pivot,phase,radii){
 // Larger native canvas preserves handle extremes in every direction. Rendering
 // rotation at native resolution first prevents world/camera subpixel ghosting.
 const key=n+':'+phase;if(rotationCaches.has(key))return rotationCaches.get(key);
 const raster=document.createElement('canvas');raster.width=raster.height=128;
 const r=raster.getContext('2d');r.imageSmoothingEnabled=false;r.translate(64,64);
 // Rotate the circular mechanical plane, then project back to its fixed ellipse.
 // Bounding-box width includes the handle and is not the rim's aspect ratio.
 const aspect=radii[1]/radii[0];r.scale(1,aspect);r.rotate(phase*Math.PI*2/48);r.scale(1,1/aspect);
 r.drawImage(sheet,n%4*CELL,Math.floor(n/4)*CELL,CELL,CELL,-pivot[0],-pivot[1],CELL,CELL);
 rotationCaches.set(key,raster);return raster;
}
function wheel(c,n,pivot,x,y,angle,radii){if(!sheet.naturalWidth)return;const phase=((Math.round(angle/(Math.PI*2)*48)%48)+48)%48;c.imageSmoothingEnabled=false;c.drawImage(rotated(n,pivot,phase,radii),snap(x-128),snap(y-128),256,256);return phase;}
export function drawWater92Crank(c,x,floor,{wound=0,chainCut=false,angle=wound*Math.PI*10,time=0,chainAt=-1}={}){
 const p=drawWater92Grounded(c,3,x,floor),mount=water92Port(p,WATER92.crank.wheel),collar=water92Port(p,WATER92.crank.collar);
 // Render rod behind fixed collar/housing, using the generated full threaded
 // shaft. Its displacement is retained even when the wheel stops.
 const lift=snap(Math.max(0,Math.min(1,wound))*54),rodX=collar.x-96,rodY=collar.y-38-lift;
 c.save();c.beginPath();c.rect(rodX,rodY,192,Math.max(0,collar.y+8-rodY));c.clip();cell(c,5,rodX,rodY);c.restore();cell(c,3,p.x,p.y);
 const phase=wheel(c,4,WATER92.wheel.pivot,mount.x,mount.y,angle,WATER92.wheel.rimRadii);
 const cutAge=time-chainAt;
 if(!chainCut){cell(c,11,p.x,p.y);if(link.naturalWidth)c.drawImage(link,p.x,snap(p.y-36),192,192);}
 else if(cutAge>=0&&cutAge<.6&&sheet.naturalWidth){
  // Actual generated chain halves descend and separate on the native grid.
  // The floor masks fragments after contact instead of leaving them airborne.
  const drop=snap(200*cutAge*cutAge),spread=snap(24*cutAge);
  c.save();c.beginPath();c.rect(p.x-32,p.y,256,Math.max(0,floor-p.y));c.clip();
  for(const side of[-1,1]){const sx=side<0?0:48;c.drawImage(sheet,3*CELL+sx,2*CELL,48,96,snap(p.x+sx*2+side*spread),snap(p.y+drop),96,192);}
  if(link.naturalWidth)c.drawImage(link,p.x,snap(p.y-36+600*cutAge*cutAge),192,192);c.restore();
 }
 return{...p,wheel:mount,collar,phase,rodLift:lift,rodHead:{x:collar.x,y:snap(collar.y-12-lift)},chainCut,cutAge,chainApex:water92Port(p,WATER92.chain.apex)};
}
export function drawWater92Valve(c,x,floor,pose=0){const p=drawWater92Grounded(c,6,x,floor),mount=water92Port(p,WATER92.valve.wheel);const phase=wheel(c,7,WATER92.valveWheel.pivot,mount.x,mount.y,pose*Math.PI/2,WATER92.valveWheel.rimRadii);return{...p,wheel:mount,inlet:water92Port(p,WATER92.valve.inlet),phase};}
export function drawWater92Sluice(c,x,floor,pose=0){const p=drawWater92Grounded(c,8,x,floor),shift=snap(Math.max(0,Math.min(1,pose))*136);cell(c,9,p.x+shift,p.y);return{...p,coverShift:shift,aperture:{x:p.x+58,y:p.y+142,w:80,h:16}};}
export function drawWater92Gate(c,x,top,bottom){
 if(!sheet.naturalWidth)return;const [sx,sy,w,h]=WATER92.gate.core;
 c.save();c.beginPath();c.rect(snap(x-22),snap(top),44,Math.max(0,snap(bottom-top)));c.clip();c.imageSmoothingEnabled=false;
 const lift=snap(850-bottom);for(let y=snap(top)-lift;y<bottom;y+=h*2)c.drawImage(sheet,2*CELL+sx,2*CELL+sy,w,h,snap(x-w),y,w*2,h*2);c.restore();return{lift,visibleBottom:snap(bottom)};
}
export function water92NozzlePlacement(x,mouthY){const p={x:snap(x-96),y:snap(mouthY-170)};return{...p,mouth:{x:snap(x),y:snap(mouthY)},inlet:water92Port(p,[48,24]),mouthWidth:56};}
export function drawWater92Nozzle(c,x,mouthY){const p=water92NozzlePlacement(x,mouthY);if(nozzle.naturalWidth){c.imageSmoothingEnabled=false;c.drawImage(nozzle,p.x,p.y,192,192);}return p;}
export function drawWater92NozzleLip(c,x,mouthY){const p=water92NozzlePlacement(x,mouthY);if(nozzle.naturalWidth){c.imageSmoothingEnabled=false;c.drawImage(nozzle,0,88,96,8,p.x,p.y+176,192,16);}}
export function drawWater92Cradle(c,x,floor){
 const p={x:snap(x-128),y:snap(floor-224)};
 if(cradle.naturalWidth){c.imageSmoothingEnabled=false;c.drawImage(cradle,p.x,p.y,256,256);}
 return{...p,seatY:p.y+24,beamBottom:p.y+48,visibleBottom:p.y+224,left:p.x+4,right:p.x+252,carrierHalf:124};
}
export function water92Ready(){return sheet.naturalWidth>0&&nozzle.naturalWidth>0&&link.naturalWidth>0&&cradle.naturalWidth>0;}
