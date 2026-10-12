import {CLOCK_RADIUS,clockRail,clockLiftPlacement,clockCatchPose,steamPhase} from './clockwork-campaign.js?v=vikings70';
import {createAtlas} from './sprite-atlas.js?v=fan66';
import {drawTerrain} from './terrain-render.js?v=terrain48';
import {drawConnection,drawConnectionTile,connectionsReady} from './connection-render.js?v=connections53';
import {snapPixel} from './pixel-grid.js?v=arc46';
import {drawCycleGateField} from './cycle-gate.js?v=gate61';
import {drawSprite} from './sprite-render.js?v=vikings70';
const parts=createAtlas('assets/clockwork69/parts.png',4,2),machine=createAtlas('assets/clockwork69/machine.png',4,2),dock=createAtlas('assets/clockwork69/dock.png',4,1),pin=createAtlas('assets/clockwork69/pin.png',4,1),gate=createAtlas('assets/gate61/gate.png',1,1);
const load=src=>{const i=new Image();i.src=src;return i;};
const scene=load('assets/clockwork69/scene.png'),catchArt=load('assets/clockwork69/catch.png'),ladder=load('assets/platform56/ladder.png'),lift=load('assets/refraction62/lift.png'),connection=load('assets/connections53/connections.png');
const rotated=new Map();
function wheelRaster(angle){const deg=((Math.round(angle*180/Math.PI)%360)+360)%360;if(rotated.has(deg))return rotated.get(deg);if(!parts.image.complete)return null;
 const c=document.createElement('canvas');c.width=c.height=112;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.translate(56,56);g.rotate(deg*Math.PI/180);g.drawImage(parts.image,0,0,96,96,-48,-48,96,96);rotated.set(deg,c);return c;
}
const tracks=new Map();
const catchCache=new Map();
function catchRaster(p){const stroke=Math.round(p.stroke),key=stroke+':'+p.released;if(catchCache.has(key))return catchCache.get(key);if(!catchArt.complete)return null;const c=document.createElement('canvas');c.width=48;c.height=80;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 // Fixed base, authored coiled shaft and authored moving hook; each component
 // stays at its native pixel density throughout the extension.
 g.drawImage(catchArt,96,60,48,20,0,60,48,20);
 for(let y=26+stroke;y<60;y+=8){const ht=Math.min(8,60-y);g.drawImage(catchArt,96,40,48,ht,0,y,48,ht);}
 g.drawImage(catchArt,p.released?144:96,0,48,26,0,stroke,48,26);catchCache.set(key,c);return c;
}
function ramp(){if(tracks.has(0))return tracks.get(0);if(!connection.complete)return null;const c=document.createElement('canvas');c.width=850;c.height=650;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 // Segmented angled rail blocks, resolved once at the actual native raster.
 for(let p=560;p<=1640;p+=18){const r=clockRail(p);g.save();g.translate(Math.round(p/2),Math.round(r.y/2)+5);g.rotate(Math.atan(r.slope));g.drawImage(connection,0,48,16,16,-8,-8,16,16);g.restore();}tracks.set(0,c);return c;
}
export function drawClockworkWorld(ctx,s,camera,viewport){const g=s.machine,b=g.wheel,h=g.half;
 ctx.fillStyle='#14292f';ctx.fillRect(camera.x,camera.y,viewport.width,viewport.height);
 if(scene.complete&&scene.naturalWidth){ctx.save();ctx.filter='brightness(.5)';const x=snapPixel(camera.x*.8),y=snapPixel(camera.y*.6);for(let n=x-1536;n<camera.x+viewport.width;n+=1536)ctx.drawImage(scene,n,y,1536,1024);ctx.restore();}
 const floors=[...s.level.floors,...s.level.platforms];
 for(const p of s.level.platforms)for(const x of [p.x+18,p.x+p.w-24]){const base=floors.filter(f=>f.y>p.y&&x>=f.x&&x<=f.x+f.w).sort((a,b)=>a.y-b.y)[0];if(base)drawConnection(ctx,[[x,p.y+24],[x,base.y]],'rail');}
 for(const p of s.level.floors)drawTerrain(ctx,{round:5,campaign:'story'},p.x,p.y,p.w,140);
 // A continuous guide provides the physical return route for the upper arch.
 drawConnection(ctx,[[920,650],[1080,650]],'rail');drawConnection(ctx,[[560,700],[560,800]],'rail');
 if(connection.complete)for(let x=560;x<920;x+=16){const t=(920-x)/360,y=650+50*t*t*(3-2*t);ctx.drawImage(connection,0,48,16,16,x-16,snapPixel(y)-6,32,32);}
 drawConnectionTile(ctx,h.mode==='catch'?31:30,560,700);
 const catchPose=clockCatchPose(g),post=catchRaster(catchPose);
 for(const [x,mirror]of [[400,false],[720,true]]){drawTerrain(ctx,{round:5,campaign:'story'},mirror?650:410,778,68,22);if(post){ctx.save();ctx.translate(x,618);if(mirror)ctx.scale(-1,1);ctx.drawImage(post,0,0,96,160);ctx.restore();}}
 const rail=ramp();if(rail)ctx.drawImage(rail,0,0,1700,1300);
 for(const x of [720,880,1040,1220,1400,1600])drawConnection(ctx,[[x,clockRail(x).y+22],[x,1260]],'rail');
 // Main gear train and the visible counterweight run to real anchored terminals.
 drawConnection(ctx,[[2540,840],[2620,840],[2620,680],[2780,680],[2780,510]],'rail');
 drawConnection(ctx,[[1640,968],[2880,968],[2880,510]],'rail');drawConnection(ctx,[[3130,510],[3130,920]],'cable');
 for(const [i,[x,y]]of [[2620,840],[2620,680],[2780,680]].entries()){const wheel=wheelRaster(b.angle*(i%2?1:-1));if(wheel)ctx.drawImage(wheel,x-112,y-112,224,224);drawConnectionTile(ctx,6,x,y);}
 // Housing's native mouth center is registered around the incoming wheel.
 const dockFrame=g.pinBroken?(g.collapse<.33?2:g.collapse<.66?1:g.collapse<.9?0:3):b.mode==='docked'?2:b.mode==='docking'?Math.min(2,Math.floor(b.dockT*4)):0;
 dock.draw(ctx,dockFrame,2300,616,320,448);
 for(const p of s.level.platforms)drawTerrain(ctx,{round:5,campaign:'story'},p.x,p.y,p.w,24);
 if(ladder.complete&&ladder.naturalWidth)for(const l of s.level.ladders)for(let y=l.top;y<l.bottom;y+=26){const ht=Math.min(26,l.bottom-y);ctx.drawImage(ladder,0,0,24,ht/2,l.x-24,snapPixel(y),48,snapPixel(ht));}
 // An arched support and its ceiling flange hold the hanging chain.
 drawConnection(ctx,[[1080,300],[1400,300],[1400,400]],'rail');
 if(machine.image.complete){const sx=g.chainCut?96:0;ctx.drawImage(machine.image,sx,104,96,g.chainCut?60:65,984,292,192,g.chainCut?120:130);
  if(g.chainCut){const age=Math.min(1,s.time-g.cutAt),drop=Math.min(172,350*age*age);ctx.drawImage(machine.image,96,164,96,44,984,snapPixel(412+drop),192,88);}}
 if(h.mode!=='joined'&&b.mode!=='opening'){parts.draw(ctx,1,snapPixel(h.x-96),snapPixel(h.y-96),192,192);if(h.mode==='waiting'||h.mode==='join')for(const x of [480,640])drawConnectionTile(ctx,30,x,640);}
 if(b.mode==='cup'||g.pinBroken||b.mode==='opening'){parts.draw(ctx,2,b.x-96,b.y-96,192,192);
  if(g.pinBroken){const t=g.collapse;parts.draw(ctx,1,snapPixel(b.x-96+t*80),snapPixel(b.y-96-200*t+352*t*t),192,192);}
  else if(b.mode==='opening')parts.draw(ctx,1,b.x-96,b.y-96-b.open*80,192,192);
 }else{
  const wheel=wheelRaster(b.angle);if(wheel)ctx.drawImage(wheel,snapPixel(b.x-112),snapPixel(b.y-112),224,224);
 }
 const springFrame=b.mode==='loading'?Math.min(1,Math.floor(b.load/.3)):b.mode==='flight'&&s.time-g.launchAt<.35?2:3;parts.draw(ctx,4+springFrame,1544,812,192,192);drawConnection(ctx,[[1630,1004],[1630,1260]],'rail');
 // Steam windup and plume are attached to the valve's measured mouth.
 const phase=steamPhase(g.steamClock),steam=b.mode==='docked'&&!g.exitLatched;
 drawConnection(ctx,[[2140,650],[2380,650],[2380,920]],'rail');ctx.save();ctx.translate(2140,650);ctx.scale(1,-1);machine.draw(ctx,steam&&phase==='live'?7:6,-96,-186,192,208);ctx.restore();
 if(steam&&phase!=='off')for(let n=0;n<(phase==='live'?16:5);n++){const y=800+((g.steamClock*180+n*12)%140),x=2140+Math.sin(n*2)*12;ctx.fillStyle=phase==='live'?'#d6f0ee':'#bcba8a';ctx.fillRect(snapPixel(x),snapPixel(y),phase==='live'?8:4,12);}
 for(const c of [g.carrier,g.counter]){const p=clockLiftPlacement(c);if(lift.complete&&lift.naturalWidth)ctx.drawImage(lift,snapPixel(p.x),snapPixel(p.y),p.w,p.h);}
 // Remote retaining stem belongs to the same mechanically connected ratchet.
 drawConnection(ctx,[[2830,510],[2780,510]],'cable');const pinFrame=g.pinBroken?Math.min(3,1+Math.floor(g.collapse*3)):0;pin.draw(ctx,pinFrame,2798,418,64,112);
 const pose={x:3026,y:402,w:128,h:128,active:g.exitLatched,frame:Math.floor(s.time*12),glow:.65+.2*Math.sin(s.time*4),aperture:{x:3090,y:476,w:40,h:80}};drawCycleGateField(ctx,pose);gate.drawGrounded(ctx,0,pose,floors);
 return{ready:connectionsReady()&&[parts.image,machine.image,dock.image,pin.image,gate.image,scene,catchArt,ladder,lift].every(i=>i.complete&&i.naturalWidth),half:{...h},wheel:{...b},dockFrame,pinFrame,catch:catchPose,drive:g.drive,split:b.occupied&&b.mode==='docked'&&s.active===0&&!g.pinBroken,steam:steam?phase:'off',contacts:[{name:'wheel',radius:CLOCK_RADIUS,center:[b.x,b.y]},{name:'carriage',rim:g.carrier.y},{name:'spring',rim:920,base:1004},{name:'housing',base:1002},{name:'pin',base:530}]};
}
const inset=document.createElement('canvas');inset.width=120;inset.height=110;
export function drawClockworkInset(ctx,s,view){if(!view.split)return;const g=inset.getContext('2d');g.imageSmoothingEnabled=false;g.setTransform(.5,0,0,.5,-view.runner.x*.5,-view.runner.y*.5);drawClockworkWorld(g,s,{x:view.runner.x,y:view.runner.y},view.runner);const e=s.heroes[0];drawSprite(g,e,e.x,e.y);
 const r=view.inset;ctx.fillStyle='#d0a559';ctx.fillRect(snapPixel(r.x-2),snapPixel(r.y-2),snapPixel(r.w+4),snapPixel(r.h+4));ctx.drawImage(inset,snapPixel(r.x),snapPixel(r.y),snapPixel(r.w),snapPixel(r.h));
}
