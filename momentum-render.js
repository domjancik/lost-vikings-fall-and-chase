import {drawDepthMidground,drawDepthWallFaces,depthReady} from './depth-render94.js?v=depth94';
import {railPoint,BALL_RADIUS,laserPhase,momentumLiftPlacement} from './momentum-campaign.js?v=momentum72';
import {createAtlas} from './sprite-atlas.js?v=fan66';
import {drawTerrain} from './terrain-render.js?v=terrain48';
import {drawConnection,drawConnectionTile,connectionsReady} from './connection-render.js?v=connections53';
import {snapPixel} from './pixel-grid.js?v=arc46';
import {backdropY} from './vertical-parallax.js?v=vertical65';
import {drawCycleGateField} from './cycle-gate.js?v=gate61';
const relay=createAtlas('assets/momentum68/relay.png',4,4),hazards=createAtlas('assets/momentum68/hazards.png',4,4),gate=createAtlas('assets/gate61/gate.png',1,1);
const rollingBall=createAtlas('assets/momentum72/ball.png',8,8);
const furnace=createAtlas('assets/momentum68/furnace.png',4,1),bumper=createAtlas('assets/momentum68/bumper.png',4,1);
const load=src=>{const i=new Image();i.src=src;return i;};
const scene=load('assets/momentum68/scene.png'),tiles=load('assets/momentum68/tiles.png'),arm=load('assets/momentum68/arm.png'),ladder=load('assets/platform56/ladder.png'),lift=load('assets/refraction62/lift.png');
const armFrames=new Map();
const railImage=load('assets/connections53/connections.png'),railCache=new Map();
function curvedRail(branch){
 if(railCache.has(branch))return railCache.get(branch);if(!railImage.complete||!railImage.naturalWidth)return null;
 const c=document.createElement('canvas');c.width=1700;c.height=640;const r=c.getContext('2d');r.imageSmoothingEnabled=false;
 for(let p=branch==='upper'?480:1000;p<=(branch==='upper'?1800:1500);p+=8){const q=railPoint(p,branch);r.save();r.translate(Math.round(p/2),Math.round((q.y+8)/2));r.rotate(Math.atan(q.slope));r.drawImage(railImage,0,48,16,16,-8,-8,16,16);r.restore();}
 railCache.set(branch,c);return c;
}
function paddle(angle){const deg=Math.round(angle*180/Math.PI);if(armFrames.has(deg))return armFrames.get(deg);const c=document.createElement('canvas');c.width=c.height=192;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.translate(96,96);ctx.rotate(deg*Math.PI/180);ctx.drawImage(arm,-80,-26);armFrames.set(deg,c);return c;}
export function drawMomentumWorld(ctx,s,camera,viewport){
 const g=s.machine,b=g.ball,surfaces=[...s.level.floors,...s.level.platforms],contacts=[];
 ctx.fillStyle='#142a31';ctx.fillRect(camera.x,camera.y,viewport.width,viewport.height);
 const background={x:snapPixel(camera.x*.78),y:backdropY(camera.y,0),width:1536,height:1024,verticalSpeed:.22};
 if(scene.complete&&scene.naturalWidth){ctx.save();ctx.filter='brightness(.62)';for(let x=background.x-1536;x<camera.x+viewport.width;x+=1536)ctx.drawImage(scene,x,background.y,1536,1024);ctx.restore();}
 const decor=drawDepthMidground(ctx,s);
 // Piers always connect deck undersides to a real lower footing.
 for(const p of s.level.platforms)for(const x of [p.x+18,p.x+p.w-26]){const f=surfaces.filter(f=>f.y>p.y&&x>=f.x&&x<=f.x+f.w).sort((a,b)=>a.y-b.y)[0];if(f)drawConnection(ctx,[[x,p.y+22],[x,f.y]],'rail');}
 for(const branch of ['upper','lower']){const rail=curvedRail(branch);if(rail){ctx.save();ctx.filter=branch===b.branch&&b.mode!=='cradle'?'brightness(1.4)':'brightness(.7)';ctx.drawImage(rail,0,0,3400,1280);ctx.restore();}}
 for(const p of [600,800,1040,1300,1550,1780])drawConnection(ctx,[[p,railPoint(p,'upper').y+16],[p,1120]],'rail');
 drawConnection(ctx,[[680,1120],[680,664],[480,664]],'rail');drawConnection(ctx,[[520,1100],[1520,1100]],'rail');
 for(const p of s.level.floors)drawTerrain(ctx,{round:5,campaign:'story'},p.x,p.y,p.w,160);
 for(const p of s.level.platforms)drawTerrain(ctx,{round:5,campaign:'story'},p.x,p.y,p.w,24);
 drawDepthWallFaces(ctx,s);
 if(ladder.complete&&ladder.naturalWidth)for(const l of s.level.ladders)for(let y=l.top;y<l.bottom;y+=26){const h=Math.min(26,l.bottom-y);ctx.drawImage(ladder,0,0,24,h/2,snapPixel(l.x-24),snapPixel(y),48,snapPixel(h));}
 if(tiles.complete&&tiles.naturalWidth)for(const t of g.tiles){const n=t.t===0?0:t.t<.45?1:t.t<.9?2:3;ctx.drawImage(tiles,n*40,0,40,32,t.x,snapPixel(t.y+(t.t<.9?Math.min(2,t.t*2):t.drop)),80,64);}
 // The striker's spring pedestal rests on a connected service post.
 drawConnection(ctx,[[1030,1034],[1030,1120]],'rail');relay.draw(ctx,12,966,906,128,128);
 if(arm.complete&&arm.naturalWidth)ctx.drawImage(paddle(g.guide*.62),838,740,384,384);
 drawConnection(ctx,[[1030,932],[1070,932],[1070,970],[1000,970]],'cable',{time:s.time});
 drawConnectionTile(ctx,g.guide>.55?31:30,1000,970);
 for(const [x,y,on]of [[330,720,b.mode==='return'||g.returnPending],[1350,1120,b.mode==='return'||g.returnPending],[2580,508,g.safety]])relay.draw(ctx,on?15:14,x-64,y-128,128,128);
 rollingBall.draw(ctx,((Math.round(b.angle/(Math.PI*2)*64)%64)+64)%64,snapPixel(b.x)-64,snapPixel(b.y)-64,128,128);
 contacts.push({name:'sphere',radius:BALL_RADIUS,center:[b.x,b.y],rail:[b.p,railPoint(b.p,b.branch).y],mode:b.mode,riders:s.heroes.filter(h=>h.support==='momentum-ball').map(h=>({id:h.id,x:h.x,feet:h.y+44}))});
 const phase=g.safety?'safe':g.highReached?laserPhase(g.clock):'off',emitterFrame=phase==='safe'?11:phase==='live'?10:phase==='charge'?9:8;
 drawConnection(ctx,[[2100,176],[2240,176],[2240,1120]],'rail');hazards.draw(ctx,emitterFrame,2088,176,128,128);
 if(phase==='live'||phase==='charge')for(let y=242;y<508;y+=2){ctx.fillStyle=phase==='live'?(Math.floor((y+s.time*120)/10)%2?'#fff3bd':'#f55b4d'):'#a97437';ctx.fillRect(phase==='live'?2156:2158,y,phase==='live'?8:4,2);}
 const fireTime=g.fireClock%2.8,dragonFrame=g.safety||!g.highReached||g.fireClock<2.2?4:fireTime>2.2?5:fireTime<.15?7:fireTime<.4?6:4;
 furnace.draw(ctx,dragonFrame-4,2392,364,144,144);contacts.push({name:'furnace',bottom:508,surface:508,mouth:[2428,454]});
 const bumperFrame=s.time-g.bumperAt<.1?1:s.time-g.bumperAt<.24?2:0;bumper.draw(ctx,bumperFrame,1928,380,160,128);
 for(const [end,floor,branch]of [[1500,1120,'lower'],[1800,720,'upper']]){
  const active=b.branch===branch&&b.mode==='caught',age=s.time-(b.caughtAt??-10),frame=active&&age<.12?1:active&&age<.26?2:0;
  ctx.save();ctx.translate(end+BALL_RADIUS+92,floor-128);ctx.scale(-1,1);bumper.draw(ctx,frame,0,0,160,128);ctx.restore();
  if(floor<1120)drawConnection(ctx,[[end+BALL_RADIUS+56,floor],[end+BALL_RADIUS+56,1120]],'rail');
 }
 for(const p of s.shots)if(p.kind==='fire'){const n=Math.floor(s.time*12)%4;ctx.save();if(p.v>0){ctx.translate(snapPixel(p.x),snapPixel(p.y));ctx.scale(-1,1);hazards.draw(ctx,n,-44,-70,128,128);}else hazards.draw(ctx,n,p.x-44,p.y-70,128,128);ctx.restore();}
 if(lift.complete&&lift.naturalWidth){const c=g.carrier,p=momentumLiftPlacement(c),y=snapPixel(p.y);for(const [sx,sw,dx,dw]of [[0,16,0,32],[16,32,32,64],[16,26,96,52],[48,16,148,32]])ctx.drawImage(lift,sx,0,sw,64,c.x+dx,y,dw,128);}
 drawConnection(ctx,[[2940,1120],[2940,220],[3060,220],[3060,1120]],'rail');
 const portal={x:3196,y:380,w:128,h:128,active:g.safety,glow:g.safety?.8:0,frame:Math.floor(s.time*12),aperture:{x:3260,y:454,w:40,h:80}};drawCycleGateField(ctx,portal);gate.drawGrounded(ctx,0,portal,surfaces);
 return {decor,ready:depthReady()&&connectionsReady()&&[rollingBall.image,relay.image,hazards.image,furnace.image,bumper.image,gate.image,scene,tiles,arm,ladder,lift].every(i=>i.complete&&i.naturalWidth),background,contacts,guide:g.guide,laser:phase,ball:{...b},fireballs:s.shots.filter(p=>p.kind==='fire').map(p=>({x:p.x,y:p.y,age:p.age})),lift:{x:g.carrier.x,y:g.carrier.y}};
}
