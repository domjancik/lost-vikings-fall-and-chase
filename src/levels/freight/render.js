import {createAtlas} from '../../render/sprite-atlas.js?v=freight109';
import {snapPixel as q} from '../../render/pixel-grid.js?v=freight109';
import {drawTerrain} from '../../render/terrain-render.js?v=terrain48';
import {drawConnection,connectionsReady} from '../../render/connection-render.js?v=connections53';
import {drawCycleGateField} from '../../campaigns/machines/cycle-gate.js?v=gate61';
import {FREIGHT_ART as ART,inspectorArtFrame} from './art-layout.js?v=freight109';
import {drawFreightFan,drawFreightBurner,freightHardwareReady} from './hardware-render.js?v=orbit113';
import {drawFreightWindRefraction} from './wind-refraction.js?v=orbit113';
import {freightFanFeedRoute,freightBurnerFeedRoute} from './hardware-layout.js?v=orbit113';
const load=path=>{const i=new Image();i.src='assets/'+path+'?v=freight109';return i;};
const far=load('freight109/far-native.png'),middle=load('freight109/middle-native.png'),cart=load('freight109/cart-native.png'),cell=load('freight109/cell-native.png'),ladder=load('platform56/ladder.png');
const parts=createAtlas('assets/freight109/machines-native.png?v=freight109',4,4),inspectors=createAtlas('assets/freight109/inspector-native.png?v=freight109',4,2);
const legacy=createAtlas('assets/level96/parts-native.png?v=freight109',5,3),portal=createAtlas('assets/gate61/gate.png?v=freight109',1,1);
function machine(ctx,n,x,floor){parts.draw(ctx,n,q(x-64),q(floor-ART.machines[n]*2),128,128);}
function crop(ctx,n,sx,sy,w,h,x,y){if(parts.image.complete&&parts.image.naturalWidth)ctx.drawImage(parts.image,n%4*64+sx,Math.floor(n/4)*64+sy,w,h,q(x),q(y),w*2,h*2);}
function pier(ctx,x,top,bottom){
 if(bottom<=top)return;
 crop(ctx,14,22,0,20,9,x-20,top);
 for(let y=top+18;y<bottom-16;y+=48){const h=Math.min(48,bottom-16-y);crop(ctx,14,25,12,14,h/2,x-14,y);}
 crop(ctx,14,22,45,20,8,x-20,bottom-16);
}
function ladderSection(ctx,l){if(!ladder.complete||!ladder.naturalWidth)return;for(let y=l.top;y<l.bottom;y+=26){const h=Math.min(26,l.bottom-y);ctx.drawImage(ladder,0,0,24,h/2,q(l.x-24),q(y),48,h);}}
const rolling=new Map();let cartPixels=null;
const spoolFrames=new Map();
function spoolRaster(phase){
 if(!legacy.image.complete||!legacy.image.naturalWidth)return null;
 const frame=Math.floor(phase*18)%6;if(spoolFrames.has(frame))return spoolFrames.get(frame);
 const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(legacy.image,192,96,96,96,0,0,96,96);
 // Thread moves on the drum; the generated bronze flanges and mounting silhouette stay.
 for(let y=36;y<54;y++){const sourceY=36+(y-36+frame)%18;g.drawImage(legacy.image,192+36,96+sourceY,28,1,36,y,28,1);}
 spoolFrames.set(frame,c);return c;
}
function cartFrame(angle){
 if(!cart.complete||!cart.naturalWidth)return null;
 const frame=((Math.round(angle*180/Math.PI/5)%72)+72)%72;if(rolling.has(frame))return rolling.get(frame);
 if(!cartPixels){const canvas=document.createElement('canvas');canvas.width=192;canvas.height=128;const c=canvas.getContext('2d');c.drawImage(cart,0,0);cartPixels=c.getImageData(0,0,192,128);}
 const canvas=document.createElement('canvas');canvas.width=192;canvas.height=128;const c=canvas.getContext('2d'),out=new ImageData(new Uint8ClampedArray(cartPixels.data),192,128),a=frame*Math.PI/36,co=Math.cos(a),si=Math.sin(a);
 // Only wheel/hub interior spokes rotate: caster housings and tire outline stay fixed.
 for(const [cx,cy,r]of [...ART.cart.wheels.map(p=>[...p,6]),[...ART.cart.hub,6]])for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++){
  const dx=x-cx,dy=y-cy;if(dx*dx+dy*dy>r*r)continue;const sx=Math.round(cx+dx*co+dy*si),sy=Math.round(cy-dx*si+dy*co);
  for(let k=0;k<4;k++)out.data[(y*192+x)*4+k]=cartPixels.data[(sy*192+sx)*4+k];
 }
 c.putImageData(out,0,0);rolling.set(frame,canvas);return canvas;
}
function brick(ctx,x,floor,pose){
 const n=pose<.18?5:pose<.72?6:7;
 if(pose>.18&&pose<.72){ctx.save();ctx.translate(q(x),q(floor));ctx.rotate((Math.floor(pose*6)%2?1:-1)*.015);machine(ctx,n,0,0);ctx.restore();}
 else machine(ctx,n,x,floor);
}
function draft(ctx,s,x,floor,target,enabled){
 const contact=drawFreightFan(ctx,s,x,floor,enabled);
 if(enabled>.05)for(let n=0;n<20;n++){
  const y=floor-48-((s.time*150+n*23)%(floor-target-46)),xx=x+Math.sin(n*4+s.time*1.5)*24;
  ctx.fillStyle=n%3?'#5f8a92':'#abd2ce';ctx.fillRect(q(xx),q(y),n%3?4:8,6);
 }return contact;
}
export function drawFreightWorld(ctx,s,camera,view){const g=s.machine,contacts=[],surfaces=[...s.level.floors,...s.level.platforms];
 ctx.fillStyle='#0b192b';ctx.fillRect(camera.x,camera.y,view.width,view.height);
 const farX=q(camera.x*.82),farY=q(56+camera.y*.62),middleX=q(camera.x*.35),middleY=q(56+camera.y*.04);
 if(far.complete&&far.naturalWidth)for(let x=farX-1536;x<camera.x+view.width;x+=1536)ctx.drawImage(far,x,farY,1536,1024);
 if(middle.complete&&middle.naturalWidth)for(let x=middleX-1536;x<camera.x+view.width;x+=1536)ctx.drawImage(middle,x,middleY,1536,1024);
 const wind=drawFreightWindRefraction(ctx,s,{...camera,...view});
 // Foreground gallery supports connect to the nearest actual lower deck at each x.
 for(const p of [...s.level.platforms,...s.level.floors.filter(f=>f.y!==1080)])for(const x of [p.x+20,p.x+p.w-20]){
  const bottom=surfaces.filter(f=>f.y>p.y&&x>=f.x&&x<=f.x+f.w).sort((a,b)=>a.y-b.y)[0]?.y;
  if(bottom){pier(ctx,x,p.y+24,bottom);contacts.push({kind:'pier',x,top:p.y+24,bottom});}
 }
 // Rail has actual generated material top at720, matching visible tire soles.
 const rail=drawConnection(ctx,[[832,726],[1620,726]],'rail');
 for(const x of [850,1020,1190,1360,1530]){pier(ctx,x,732,1080);contacts.push({kind:'rail-pier',x,bottom:1080});}
 for(const p of s.level.floors)drawTerrain(ctx,{campaign:'story',round:5},p.x,p.y,p.w,p.y===1080?100:64);
 for(const p of s.level.platforms)drawTerrain(ctx,{campaign:'story',round:5},p.x,p.y,p.w,24);
 const c=g.cart,raster=cartFrame((c.x-840)/22);
 if(raster)ctx.drawImage(raster,q(c.x-64),528,384,256);
 contacts.push({kind:'trolley',x:c.x,deck:c.y,width:c.w,artDeck:528+56*2,sole:528+96*2,railTop:720});
 // Seat the connection in the measured copper inlet, behind both housings.
 const feed=drawConnection(ctx,freightFanFeedRoute(),'pipe',{time:s.time,phase:g.secondDraft*4});
 contacts.push(draft(ctx,s,480,940,490,g.ventPose),draft(ctx,s,1660,640,215,g.secondDraft));
 brick(ctx,480,940,g.ventPose);brick(ctx,2300,200,g.exhaustPose);
 for(const [n,x,y]of [[0,620,640],[1,1840,360]]){
  const p=legacy.placement(7,{x:x-96,y:y-192,w:192,h:192},surfaces),spool=spoolRaster(g.rescuePose[n]);const ladderX=[900,1880][n];
  if(p&&spool)ctx.drawImage(spool,p.x,p.y,p.w,p.h);
  // Cut cable ends remain attached to their own anchors while the spool pays out.
  if(!g.rescue[n])drawConnection(ctx,[[x-22,y-34],[x-22,y-66],[ladderX,y-66],[ladderX,y]],'cable');
  else{drawConnection(ctx,[[x-22,y-16],[x-22,y-48]],'cable');drawConnection(ctx,[[x-22,y-66],[ladderX,y-66],[ladderX,y]],'cable');}
  if(p)contacts.push({kind:'winch',x,bottom:p.visibleBottom,surface:p.surface.y,pose:g.rescuePose[n]});
 }
 const receiverState=g.cellInstalled?4:3;machine(ctx,receiverState,1580,640);
 if(g.insertion&&!g.cellInstalled&&cell.complete&&cell.naturalWidth){const t=g.insertion.age/.6,e=t*t*(3-2*t),from=g.insertion.from,to={x:1580,y:598};ctx.drawImage(cell,q(from.x+(to.x-from.x)*e-8),q(from.y+(to.y-from.y)*e-12),16,24);}
 contacts.push({kind:'receiver',x:1580,bottom:640,state:receiverState,port:[1580,598]});
 for(const i of s.items)if(i.type==='pressureCell'&&cell.complete&&cell.naturalWidth)ctx.drawImage(cell,q(i.x-8),q(i.y-12),16,24);
 for(const e of g.inspectors){const frame=inspectorArtFrame(e),sole=ART.inspector.soles[frame];
  ctx.fillStyle='#081321';ctx.fillRect(q(e.x-22),e.floor-4,44,4);
  ctx.save();ctx.translate(q(e.x),e.floor);if(e.direction===1)ctx.scale(-1,1);inspectors.draw(ctx,frame,-48,-sole*2,96,128);ctx.restore();
  contacts.push({kind:'inspector',id:e.id,frame,nativeSole:sole,artSole:q(e.floor-sole*2)+sole*2,sole:e.floor,surface:e.floor,phase:e.phase,hp:e.hp});
 }
 const burnerFeed=drawConnection(ctx,freightBurnerFeedRoute(),'pipe',{time:s.time,phase:g.purge*6});
 for(const [n,x]of [2440,2530].entries()){
  const phase=(g.heatClock+n*1.2)%5.8,hot=g.cellInstalled&&g.purge<.95,warn=hot&&phase<.55,fire=hot&&phase>=.55&&phase<1.1;
  contacts.push(drawFreightBurner(ctx,s,x,360,warn,fire));
 }
 if(g.exhaustOpen&&g.purge<1)for(let n=0;n<12;n++){ctx.fillStyle=n%3?'#647d87':'#aac1bf';ctx.fillRect(q(2300+Math.sin(n*3)*18),q(160-((s.time*80+n*10)%100)),6,8);}
 // The second fan shares this access bay. Its climbable rail is in front of the
 // equipment, never hidden by the rotor housing or the receiver feed pipe.
 for(const l of s.level.ladders)ladderSection(ctx,l);
 ctx.save();ctx.beginPath();ctx.rect(2626,254,128,106);ctx.clip();machine(ctx,13,2690,360-g.shutter*100);ctx.restore();machine(ctx,12,2690,360);
 contacts.push({kind:'shutter',bottom:360,travel:g.shutter*100,frameBottom:360});
 const rect={x:3056,y:230,w:128,h:128},p=portal.placement(0,rect,s.level.floors);
 if(p){drawCycleGateField(ctx,{...p,active:s.power,glow:.6,frame:Math.floor(s.time*12),aperture:{x:p.x+64,y:p.y+74,w:40,h:80}});portal.drawGrounded(ctx,0,rect,s.level.floors);contacts.push({kind:'portal',bottom:p.visibleBottom,surface:p.surface.y});}
 return{ready:connectionsReady()&&freightHardwareReady()&&[far,middle,cart,cell,ladder,parts.image,inspectors.image,legacy.image,portal.image].every(i=>i.complete&&i.naturalWidth),native:{far:[768,512],middle:[768,512],machines:[256,256],cart:[192,128],inspectors:[192,128],fan:[64,64],burner:[48,64]},contacts,rail:rail.anchors,feed:feed.anchors,burnerFeed:burnerFeed.anchors,wind,
  parallax:{far:{x:farX,y:farY,factorX:.82,factorY:.62},middle:{x:middleX,y:middleY,factorX:.35,factorY:.04,foundationTop:middleY+748,foundationBottom:middleY+1024}},blocks:g.blocks,purge:g.purge,shutter:g.shutter};
}

