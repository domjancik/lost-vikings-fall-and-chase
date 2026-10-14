import {createAtlas} from '../../render/sprite-atlas.js?v=loom96';
import {snapPixel as q} from '../../render/pixel-grid.js?v=loom96';
import {loomGuides,loomTargetPose,loomBeater} from './campaign.js?v=loom96';
import {LOOM_ART} from './art-layout.js?v=loom96';
import {LOOM_GUIDE} from './guide.js?v=loom98';
import {weaveReveal,THREAD} from './weave.js?v=loom106';
import {drawConnection,connectionsReady} from '../../render/connection-render.js?v=loom96';
import {drawCycleGateField} from '../../campaigns/machines/cycle-gate.js?v=loom96';
const load=name=>{const i=new Image();i.src='assets/level96/'+name+'-native.png?v=loom96';return i;};
const parts=createAtlas('assets/level96/parts-native.png?v=loom96',5,3),terrain=load('terrain'),far=load('far'),middle=load('middle'),bobbin=load('bobbin');
const cloth=new Image();cloth.src='assets/loom106/cloth-native.png?v=loom106';
const ladder=new Image();ladder.src='assets/platform56/ladder.png?v=loom96';
const portal=createAtlas('assets/gate61/gate.png?v=loom96',1,1);
const guideImage=new Image();guideImage.src='assets/loom98/guide-native.png?v=loom98';
const rasters=new Map();
// Rotations happen on the native raster. No interpolated outlines or fractional pixels.
function rotor(n,angle,faceOnly=false){
 if(!parts.image.complete||!parts.image.naturalWidth)return null;
 const deg=((Math.round(angle*180/Math.PI/3)*3)%360+360)%360,key=n+':'+deg+':'+faceOnly;
 if(rasters.has(key))return rasters.get(key);
 const src=document.createElement('canvas');src.width=src.height=96;const c=src.getContext('2d');c.drawImage(parts.image,n%5*96,Math.floor(n/5)*96,96,96,0,0,96,96);
 const input=c.getImageData(0,0,96,96),out=c.createImageData(96,96),r=deg*Math.PI/180,co=Math.cos(r),si=Math.sin(r),cy=faceOnly?47:48;
 for(let y=0;y<96;y++)for(let x=0;x<96;x++){
  const dx=x-48,dy=y-cy;if(faceOnly&&dx*dx+dy*dy>20*20)continue;
  const sx=Math.round(48+dx*co+dy*si),sy=Math.round(cy-dx*si+dy*co);
  if(sx>=0&&sx<96&&sy>=0&&sy<96)for(let k=0;k<4;k++)out.data[(y*96+x)*4+k]=input.data[(sy*96+sx)*4+k];
 }
 c.putImageData(out,0,0);rasters.set(key,src);return src;
}
function cell(ctx,n,x,y){parts.draw(ctx,n,q(x),q(y),192,192);}
function crop(ctx,n,sx,sy,w,h,x,y){if(parts.image.complete&&parts.image.naturalWidth)ctx.drawImage(parts.image,n%5*96+sx,Math.floor(n/5)*96+sy,w,h,q(x),q(y),w*2,h*2);}
function shaft(ctx,x,top,bottom){for(let y=top;y<bottom;y+=64){const h=Math.min(64,bottom-y);crop(ctx,13,40,20,16,h/2,x-16,y);}}
function surface(ctx,p,depth=48){
 if(!terrain.complete||!terrain.naturalWidth)return;
 // The generated ledge begins at row 6. That visible rim is the collision plane.
 for(let x=p.x;x<p.x+p.w;x+=64){const w=Math.min(64,p.x+p.w-x),variant=Math.floor(x/64)%3;
  ctx.drawImage(terrain,variant*32,6,w/2,10,q(x),q(p.y),w,20);
  for(let y=20;y<depth;y+=32){const h=Math.min(32,depth-y);ctx.drawImage(terrain,variant*32,64,w/2,h/2,q(x),q(p.y+y),w,h);}
 }
}
function grate(ctx,x,top,w,height,pose,travel){
 // Native iron bars tile between actual rims; the leaf slides into its housing.
 ctx.save();ctx.beginPath();ctx.rect(q(x),q(top),w,height);ctx.clip();const y=top-pose*travel;
 for(let xx=x;xx<x+w;xx+=40){const span=Math.min(40,x+w-xx);for(let yy=y;yy<y+height;yy+=48)crop(ctx,9,14,24,span/2,Math.min(24,(y+height-yy)/2),xx,yy);}
 for(let xx=x;xx<x+w;xx+=64){const span=Math.min(64,x+w-xx);crop(ctx,9,14,10,span/2,8,xx,y);crop(ctx,9,14,78,span/2,8,xx,y+height-16);}
 ctx.restore();
 shaft(ctx,x-16,top,1120);shaft(ctx,x+w+16,top,1120);
 for(let xx=x-32;xx<x+w+32;xx+=64)crop(ctx,10,5,4,Math.min(32,(x+w+32-xx)/2),12,xx,top-24);
}
function ladderSection(ctx,x,top,bottom){if(!ladder.complete||!ladder.naturalWidth)return;for(let y=top;y<bottom;y+=26){const h=Math.min(26,bottom-y);ctx.drawImage(ladder,0,0,24,h/2,q(x-24),q(y),48,h);}}
function yarn(ctx,points,phase){
 // Three native strands share a stepped raster path; light travels with the take-up.
 for(let n=1;n<points.length;n++){
  const a=points[n-1],b=points[n],length=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.ceil(length/2);
  for(let i=0;i<=steps;i++){const t=i/steps,x=q(a.x+(b.x-a.x)*t),y=q(a.y+(b.y-a.y)*t+Math.sin(t*Math.PI)*Math.min(18,length*.02));
   ctx.fillStyle=THREAD.shadow;ctx.fillRect(x,y+2,4,4);ctx.fillStyle=((i-Math.floor(phase*16)+13000)%13<3)?THREAD.light:THREAD.base;ctx.fillRect(x,y,4,2);}
 }
}
export function drawLoomWorld(ctx,s,camera,view){
 const g=s.machine,contacts=[];
 ctx.fillStyle='#172a35';ctx.fillRect(camera.x,camera.y,view.width,view.height);
 const farY=q(1120-1280+camera.y*.62),farX=q(camera.x*.78);
 if(far.complete&&far.naturalWidth)for(let x=farX-1920;x<camera.x+view.width;x+=1920)ctx.drawImage(far,x,farY,1920,1280);
 const middleFoot=LOOM_ART.middle.foundationBottom*2,middleY=q(1120-middleFoot+camera.y*.04),middleX=q(camera.x*.35);
 if(middle.complete&&middle.naturalWidth)for(let x=middleX-768;x<camera.x+view.width;x+=768)ctx.drawImage(middle,x,middleY,768,512);
 // Every structural support continues to the recovery floor. No suspended cutouts.
 for(const p of s.level.platforms){for(const x of [p.x+18,p.x+p.w-18]){shaft(ctx,x,p.y+20,1120);contacts.push({kind:'pier',x,top:p.y+20,bottom:1120});}surface(ctx,p);}
 for(const p of s.level.floors)surface(ctx,p,200);
 // Ceiling beam and beater rods are one supported machine frame.
 for(const x of [1280,2580])shaft(ctx,x,420,1120);
 for(let x=1264;x<2596;x+=64)crop(ctx,10,5,4,Math.min(32,(2596-x)/2),12,x,420);
 const driveShaft=drawConnection(ctx,[[1280,480],[2510,480]],'rail');
 const gear=rotor(1,g.phase);if(gear)for(const x of [1310,1710,2120,2510]){ctx.drawImage(gear,q(x-96),384,192,192);}
 // Pump shaft is independently driven: blocking its relief charges the plenum.
 cell(ctx,0,260,932);const motor=rotor(1,s.time*.85);if(motor)ctx.drawImage(motor,244,880,192,192);
 ctx.save();ctx.beginPath();ctx.rect(0,0,3200,1120);ctx.clip();cell(ctx,2,318,998);ctx.restore();cell(ctx,3,332,862);const gauge=rotor(3,-Math.PI*.7+g.pressure*Math.PI*1.4,true);if(gauge)ctx.drawImage(gauge,332,862,192,192);
 const feed=drawConnection(ctx,[[410,1040],[960,1040],[960,1148],[1120,1148]],'pipe');
 const camFeed=drawConnection(ctx,[[960,1040],[960,480],[1280,480]],'pipe');
 for(let n=0;n<13;n++){const x=500+((s.time*170+n*31)%400);if(x<g.jetEnd){ctx.fillStyle=n%3?'#749797':'#b6d4c4';ctx.fillRect(q(x),q(1082+n%7*4),8,2);}}
 for(const [n,p]of [[5,g.lift],[4,g.shuttle],[4,g.shuttle2]]){
  const a=n===5?LOOM_ART.lift:LOOM_ART.shuttle;
  if(n===5)shaft(ctx,p.x+p.w/2,p.y+66,1148);
  else drawConnection(ctx,[[p.x+80,480],[p.x+80,p.y+20]],'cable',{time:s.time,phase:n});
  cell(ctx,n,p.x-a.left*2,p.y-a.top*2);contacts.push({kind:p.support,x:p.x,y:p.y,w:p.w,artRim:p.y});
 }
 for(const [n,p]of loomGuides.entries()){
  const seated=n<g.guides,next=g.owner!==null&&!g.docked&&n===g.guides;
  const missed=g.threadAttempt?.guide===n&&!g.threadAttempt.accepted&&s.time-g.threadAttempt.time<1;
  ctx.save();
  if(missed)ctx.filter='sepia(.5) brightness(1.4)';
  else if(seated)ctx.filter='brightness(1.18)';
  else if(next)ctx.filter=`brightness(${1.05+Math.floor((Math.sin(s.time*3)+1)*3)/20})`;
  if(guideImage.complete&&guideImage.naturalWidth)ctx.drawImage(guideImage,q(p.x-96),q(p.y-64),192,192);
  ctx.restore();
  shaft(ctx,p.x,p.y-64+LOOM_GUIDE.base*2,1120);
  if(seated)yarn(ctx,[{x:p.x-30,y:p.y},{x:p.x+30,y:p.y}],g.phase);
  contacts.push({kind:'guide',x:p.x,y:p.y,foot:1120,clearance:LOOM_GUIDE.threadTolerance,seated,next,missed});
 }
 // A short spindle cradle is assembled from native cap/body/foot, without scaling.
 crop(ctx,14,8,58,80,8,1110,836);crop(ctx,14,8,72,80,6,1110,852);crop(ctx,14,8,86,80,8,1110,864);cell(ctx,11,2354,692);
 for(let n=0;n<2;n++){const p=loomTargetPose(s,n);drawConnection(ctx,[[p.x,480],[p.x,p.y]],'cable');cell(ctx,8,p.x-96,p.y-84);}
 const releaseCable=drawConnection(ctx,[[1390,loomTargetPose(s,0).y+30],[1390,780],[1224,780],[1224,826]],'cable',{time:s.time,phase:g.latchPose});
 for(let n=0;n<2;n++){const b=loomBeater(s,n),stemTop=b.bottom-LOOM_ART.head.bottom*2+2;shaft(ctx,b.x,444,stemTop+8);cell(ctx,12,b.x-96,b.bottom-LOOM_ART.head.bottom*2);
  drawConnection(ctx,[[b.x,480],[b.x,444]],'rail');
  if(b.warning||b.active){ctx.fillStyle=b.active?'#dc8253':'#c2aa64';ctx.fillRect(q(b.x-28),q(b.bottom-66),56,4);}
  contacts.push({kind:'beater',x:b.x,bottom:b.bottom,mount:444,stemTop,warning:b.warning,active:b.active});
 }
 grate(ctx,1840,680,120,260,g.clutchPose,280);grate(ctx,2780,928,168,192,g.exitPose,192);
 const exitCable=drawConnection(ctx,[[2450,788],[2660,788],[2660,880],[2900,880]],'cable',{time:s.time,phase:g.weave*4});
 shaft(ctx,2900,880,1120);const exitRotor=rotor(1,g.exitPose*Math.PI*2);if(exitRotor)ctx.drawImage(exitRotor,2804,784,192,192);
 ladderSection(ctx,790,1020,1120);
 for(const [x,top,bottom]of [[1550,740,1120],[2520,880,1120]]){crop(ctx,11,10,84,76,10,x-76,top+16);ladderSection(ctx,x,top,top+(bottom-top)*g.ladderPose);}
 if(g.owner!==null||g.docked)yarn(ctx,[{x:1190,y:824},...loomGuides.slice(0,g.guides),g.bobbin],g.phase);
 if(bobbin.complete&&bobbin.naturalWidth)ctx.drawImage(bobbin,q(g.bobbin.x-20),q(g.bobbin.y-20),40,40);
 crop(ctx,13,38,16,20,10,1170+34*g.latchPose,824);
 // A real sky pattern grows from the take-up axle into its supported textile frame.
 for(const x of [2414,2486]){shaft(ctx,x,444,628);yarn(ctx,[{x,y:650},{x,y:794}],g.phase);}
 crop(ctx,10,5,4,48,12,2402,628);
 const weave=weaveReveal(g.weave);
 if(g.docked&&cloth.complete&&cloth.naturalWidth){
  if(weave.completeRows){const y=80-weave.completeRows;ctx.drawImage(cloth,0,y,48,weave.completeRows,2402,634+y*2,96,weave.completeRows*2);}
  if(weave.width)ctx.drawImage(cloth,weave.x,weave.y,weave.width,4,2402+weave.x*2,634+weave.y*2,weave.width*2,8);
  if(g.weave<1){const x=2402+weave.needleX*2,y=634+weave.needleY*2;
   yarn(ctx,[g.bobbin,{x,y}],s.time*4);
   crop(ctx,13,40,36,16,4,x-16,y-4);
  }
 }
 contacts.push({kind:'cloth',top:650,bottom:794,axle:794,mount:628,reveal:q(160*g.weave),weave,threadColor:THREAD.base});
 const portalRect={x:2986,y:992,w:128,h:128},p=portal.placement(0,portalRect,s.level.floors);
 if(p){drawCycleGateField(ctx,{...p,active:s.power,glow:.8,frame:Math.floor(s.time*12),aperture:{x:p.x+64,y:p.y+74,w:40,h:80}});portal.drawGrounded(ctx,0,portalRect,s.level.floors);contacts.push({kind:'portal',bottom:p.visibleBottom,surface:p.surface.y});}
 return{ready:[far,middle,terrain,ladder,bobbin,cloth,guideImage,parts.image,portal.image].every(i=>i.complete&&i.naturalWidth)&&connectionsReady(),native:{far:[960,640],middle:[384,256],parts:[480,288],bobbin:[20,20],cloth:[48,80]},parallax:{far:{x:farX,y:farY,factorX:.78,factorY:.62},middle:{x:middleX,y:middleY,factorX:.35,factorY:.04,foundation:middleY+middleFoot}},contacts,feed:feed.anchors,camFeed:camFeed.anchors,driveShaft:driveShaft.anchors,exitCable:exitCable.anchors,releaseCable:releaseCable.anchors,pawl:g.latchPose,pressure:g.pressure,clutch:g.clutchPose,thread:g.guides,exit:g.exitPose};
}
