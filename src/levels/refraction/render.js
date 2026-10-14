import {drawDepthMidground,drawDepthWallFaces,depthReady} from '../../render/depth-render94.js?v=walls101';
import {backdropY} from '../../render/vertical-parallax.js?v=vertical65';
import {refractionArt} from './art-layout.js?v=refraction62';
import {refractionBeam} from './campaign.js?v=vikings70';
import {refractionConnections} from './connections.js?v=refraction62';
import {createAtlas} from '../../render/sprite-atlas.js?v=ground59';
import {drawTerrain} from '../../render/terrain-render.js?v=terrain48';
import {drawConnection,connectionsReady} from '../../render/connection-render.js?v=connections53';
import {snapPixel} from '../../render/pixel-grid.js?v=arc46';
import {drawCycleGateField} from '../../campaigns/machines/cycle-gate.js?v=gate61';
const load=n=>{const i=new Image();i.src='assets/refraction62/'+n+'.png';return i;};
const scene=load('scene'),plate=load('reflector'),base=load('base'),lift=load('lift');
const machines=createAtlas('assets/refraction62/machines.png',4,3),emitter=createAtlas('assets/refraction62/emitter.png',1,1),gate=createAtlas('assets/gate61/gate.png',1,1);
const frames=new Map();
function reflectorFrame(plane){
 const degrees=Math.round(plane*180/Math.PI);if(frames.has(degrees))return frames.get(degrees);
 const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.translate(32,32);g.rotate(degrees*Math.PI/180);g.drawImage(plate,-32,-32);frames.set(degrees,c);return c;
}
function ray(ctx,from,to,time){
 const dx=to.x-from.x,dy=to.y-from.y,len=Math.hypot(dx,dy);
 // Native grid raster; never fractional line transforms or antialiased strokes.
 for(let n=0;n<=len;n+=2){const x=snapPixel(from.x+dx*n/len),y=snapPixel(from.y+dy*n/len);ctx.fillStyle='#123c6b';ctx.fillRect(x-4,y-4,8,8);}
 for(let n=0;n<=len;n+=2){const x=snapPixel(from.x+dx*n/len),y=snapPixel(from.y+dy*n/len);ctx.fillStyle='#83eaf1';ctx.fillRect(x-2,y-2,4,4);}
 for(let n=(time*90)%24;n<len;n+=24){const x=snapPixel(from.x+dx*n/len),y=snapPixel(from.y+dy*n/len);ctx.fillStyle='#e1ffff';ctx.fillRect(x,y,2,2);}
}
export function drawRefractionWorld(ctx,s,camera,viewport){
 const g=s.machine,surfaces=[...s.level.floors,...s.level.platforms],contacts=[];
 ctx.fillStyle='#151b38';ctx.fillRect(camera.x,camera.y,viewport.width,viewport.height);
 const background={x:snapPixel(camera.x*.12),y:backdropY(camera.y,900-refractionArt.sceneFloor*2),verticalSpeed:.22,width:2800,height:refractionArt.sceneSize[1]*2};
 if(scene.complete&&scene.naturalWidth){ctx.save();ctx.filter='brightness(.72)';ctx.drawImage(scene,background.x,background.y,background.width,background.height);ctx.restore();}
 const decor=drawDepthMidground(ctx,s);
 // Structural sprites extend from each complete deck to an actual lower surface.
 for(const p of s.level.platforms)for(const x of [p.x+16,p.x+p.w-32]){
  const floor=surfaces.filter(f=>f.y>p.y&&x>=f.x&&x<=f.x+f.w).sort((a,b)=>a.y-b.y)[0];
  if(floor)drawConnection(ctx,[[x,p.y+20],[x,floor.y]],'rail');
 }
 // B hangs BELOW its bracket, so the incident ray never passes through its base.
 for(const c of refractionConnections)drawConnection(ctx,c.points,c.style,{time:s.time});
 for(const p of s.level.floors)drawTerrain(ctx,{round:2,campaign:'story'},p.x,p.y,p.w,120);
 for(const p of s.level.platforms)drawTerrain(ctx,{round:2,campaign:'story'},p.x,p.y,p.w,24);
 drawDepthWallFaces(ctx,s);
 const add=(name,atlas,n,rect)=>{const contact=atlas.drawGrounded(ctx,n,rect,surfaces);if(contact)contacts.push({name,bottom:contact.visibleBottom,surface:contact.surface.y,gap:contact.surface.y-contact.visibleBottom});};
 add('emitter',emitter,0,{x:192,y:772,w:128,h:128});
 add('fan',machines,g.draft?Math.floor(s.time*10)%4:0,{x:664,y:772,w:128,h:128});
 for(const [i,pos]of [[1,[860,390]],[2,[1360,700]]])add('wheel-'+i,machines,8+Math.min(3,Math.floor(g.poses[i]*3.99)),{x:pos[0]-64,y:pos[1]-128,w:128,h:128});
 add('receiver',machines,4+Math.min(3,Math.floor(g.charge*3.99)),{x:2176,y:572,w:128,h:128});
 const beams=refractionBeam(g),rise=(64-refractionArt.basePivot[1])*2;
 const optics=[{x:600,y:900-rise,floor:900},{x:600,y:390+rise,floor:390,hanging:true},{x:1400,y:700-rise,floor:700}];
 for(const [i,o]of optics.entries()){
  if(base.complete&&base.naturalWidth){if(o.hanging){ctx.save();ctx.translate(o.x-64,o.floor+128);ctx.scale(1,-1);ctx.drawImage(base,0,0,128,128);ctx.restore();}else ctx.drawImage(base,o.x-64,o.floor-128,128,128);}
  // Derive all three plane poses even if an upstream ray has not arrived.
  const own=refractionBeam({...g,poses:g.poses.map((v,n)=>n<i?1:v)})[i+1];
  if(plate.complete&&plate.naturalWidth)ctx.drawImage(reflectorFrame(own.plane),o.x-64,o.y-64,128,128);
  contacts.push({name:'mirror-'+i,bottom:o.hanging?null:o.floor,surface:o.floor,gap:0,pivot:{x:o.x,y:o.y},plane:own.plane});
 }
 // Fragile catch is actual crystal pixels; fragments recoil from its hinge.
 if(machines.image.complete&&machines.image.naturalWidth){const sx=64+18,sy=64+2;
  if(!g.catchBroken)ctx.drawImage(machines.image,sx,sy,28,38,572,824,56,76);
  else if(s.time-g.cutAt<.7){const t=s.time-g.cutAt;for(let n=0;n<4;n++)ctx.drawImage(machines.image,sx+n%2*14,sy+Math.floor(n/2)*19,14,19,snapPixel(572+(n%2?1:-1)*t*90),snapPixel(824+Math.floor(n/2)*38+t*t*180),28,38);}
 }
 for(const b of beams)ray(ctx,b.from,b.to,s.time);
 if(g.draft)for(let n=0;n<22;n++){ctx.fillStyle=n%2?'#9ad5ef':'#3e759c';ctx.fillRect(snapPixel(566+(n*31)%146),snapPixel(890-(s.time*190+n*29)%590),2,10);}
 if(lift.complete&&lift.naturalWidth){const c=g.carrier,y=snapPixel(c.y)-refractionArt.liftRim*2;
  // Nine-slice widening preserves two-world-unit pixels and the actual rim.
  for(const [sx,sw,dx,dw]of [[0,16,0,32],[16,32,32,64],[16,16,96,32],[48,16,128,32]])ctx.drawImage(lift,sx,0,sw,64,snapPixel(c.x)+dx,y,dw,128);
 }
 const portal={x:2536,y:332,w:128,h:128,active:s.power,glow:s.power?.75+.15*Math.sin(Math.floor(s.time*12)*.3):0,frame:Math.floor(s.time*12),aperture:{x:2600,y:406,w:40,h:80}};
 drawCycleGateField(ctx,portal);add('gate',gate,0,portal);
 return{decor,ready:depthReady()&&connectionsReady()&&[scene,plate,base,lift,machines.image,emitter.image,gate.image].every(i=>i.complete&&i.naturalWidth),background,contacts,beams,poses:g.poses,charge:g.charge,lift:{x:snapPixel(g.carrier.x),y:snapPixel(g.carrier.y),rim:snapPixel(g.carrier.y)},draft:g.draft};
}
