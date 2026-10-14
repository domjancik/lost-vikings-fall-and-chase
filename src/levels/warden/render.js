import {drawBraceSweat} from './strain-effects.js?v=warden105';
import {CART_ART,cartPlacement,cartPort,cartWheelPlacement,createCartPieces} from './cart-art.js?v=warden105';
import {drawDepthMidground,drawDepthWallFaces,depthReady} from '../../render/depth-render94.js?v=walls101';
import {wardenWaveOpacity,laserTrace} from './combat.js?v=warden105';
import {wardenGeometry,WARDEN_TRACK,wardenLevel} from './campaign.js?v=warden105';
import {WARDEN_ART as A} from './art.js?v=warden105';
import {drawTerrain} from '../../render/terrain-render.js?v=terrain48';
import {drawConnection,connectionsReady} from '../../render/connection-render.js?v=connections53';
import {createAtlas} from '../../render/sprite-atlas.js?v=fan66';
import {drawCycleGateField} from '../../campaigns/machines/cycle-gate.js?v=gate61';
import {snapPixel as q} from '../../render/pixel-grid.js?v=arc46';
import {drawCombatRefraction} from './combat-refraction.js?v=warden105';
import {rotationBounds,createRenderCache,visibleChunks,partitionLadders} from './render-cache.js?v=warden102';
const load=p=>{const i=new Image();i.src=p;return i;};
const parts=load('assets/warden102/parts-native.png'),scene=load('assets/warden89/scene-native.png'),brokenLens=load('assets/warden102/broken-lens-native.png'),ladder=load('assets/platform56/ladder.png');
const plunger=load('assets/warden97/plunger-native.png'),emitter=load('assets/warden97/emitter-native.png');
const carriage=load('assets/warden105/cart-native.png');let carriagePieces;
const gate=createAtlas('assets/gate61/gate.png',1,1),tower=createAtlas('assets/clockwork71/tower.png',2,2),cache=createRenderCache(96),fixed=createRenderCache(24),grades=new WeakMap();
let renderView=null;
const footOffsets={near:(A.anchors.footSoles['foot-near']-A.anchors.footPivot[1])*A.worldPixel,far:(A.anchors.footSoles['foot-far']-A.anchors.footPivot[1])*A.worldPixel};
function grade(image,filter='saturate(.62) brightness(.88)'){
 if(!image.naturalWidth)return image;
 let map=grades.get(image);if(!map){map=new Map();grades.set(image,map);}if(map.has(filter))return map.get(filter);
 const b=document.createElement('canvas');b.width=image.naturalWidth;b.height=image.naturalHeight;const c=b.getContext('2d');c.imageSmoothingEnabled=false;c.filter=filter;c.drawImage(image,0,0);map.set(filter,b);return b;
}
function sprite(c,name,x,y,angle=0,anchor=[0,0],source=parts,r=A.parts[name]){
 if(!(source.naturalWidth||source.width))return;
 const deg=Math.round(angle*180/Math.PI/2)*2,key=name+':'+deg+':'+anchor;
 let entry=cache.get(key);if(!entry){const bounds=rotationBounds(r,anchor,deg*Math.PI/180),b=document.createElement('canvas');b.width=bounds.w;b.height=bounds.h;const t=b.getContext('2d');t.imageSmoothingEnabled=false;t.translate(-bounds.x,-bounds.y);t.rotate(deg*Math.PI/180);t.drawImage(grade(source),...r,-anchor[0],-anchor[1],r[2],r[3]);entry=cache.set(key,{image:b,...bounds});}
 const dx=q(x+entry.x*2),dy=q(y+entry.y*2),w=entry.w*2,h=entry.h*2;
 if(renderView&&(dx+w<renderView.x||dx>renderView.x+renderView.width||dy+h<renderView.y||dy>renderView.y+renderView.height))return;
 c.drawImage(entry.image,dx,dy,w,h);
}
function limb(c,leg){const idx=leg.far?2:0;for(const [i,p,n] of [[idx,leg.hip,leg.knee],[idx+1,leg.knee,leg.ankle]]){
 const name=['upper-near','lower-near','upper-far','lower-far'][i];sprite(c,name,p.x,p.y,-Math.atan2(n.x-p.x,n.y-p.y),A.anchors.linkPivots[i]);}
 // Separate registered caps meet the real articulated joints. The piston
 // housings overlap them; illustration padding cannot move a physical pivot.
 for(const p of [leg.hip,leg.knee,leg.ankle])sprite(c,leg.far?'joint-far':'joint-near',p.x,p.y,0,[16,16]);
 const foot=leg.far?'foot-far':'foot-near';
 sprite(c,foot,leg.foot.x,leg.foot.y,0,[A.anchors.footPivot[0],A.anchors.footSoles[foot]]);
}
function ladders(c,collection){if(!ladder.naturalWidth)return;for(const l of collection)for(let y=l.top;y<l.bottom;y+=26){const h=Math.min(26,l.bottom-y);c.drawImage(ladder,0,0,24,h/2,q(l.x-24),q(y),48,q(h));}}
function head(c,s,p){
 sprite(c,'head-closed',1552,p.y,0,[0,58]);
 if(!parts.naturalWidth)return;
 // Authored metal shutters slide within the lens housing on the native grid.
 // Keep the closed housing fixed: its registered 27x45 aperture is narrower
 // than the separately authored open head. Only its glass and shutters move.
 c.save();c.beginPath();c.rect(1696,q(p.y-52),54,90);c.clip();
 c.drawImage(grade(parts),280,192,27,45,1696,q(p.y-52),54,90);
 const rise=q(s.machine.shutter*54);
 c.drawImage(grade(parts),72,192,27,25,1696,q(p.y-52-rise),54,50);
 c.drawImage(grade(parts),72,217,27,20,1696,q(p.y-2+rise),54,40);
 c.restore();
 if(s.machine.disabled&&brokenLens.naturalWidth)c.drawImage(grade(brokenLens,'saturate(.62) brightness(.616)'),1552,q(p.y-116),208,232);
}
function cargo(c,s,p){
 if(!carriage.naturalWidth)return;
 carriagePieces??=createCartPieces(grade(carriage));
 const r=cartPlacement(p),[sx,sy,sw,sh]=CART_ART.sourceBounds;
 c.drawImage(carriagePieces.body,sx,sy,sw,sh,r.x+sx*2,r.y+sy*2,sw*2,sh*2);
 // Complete native caster components retain their outlines; their measured
 // soles register to the dock rather than inheriting the source cell padding.
 for(const name of ['wheelNear','wheelFar']){const v=cartWheelPlacement(p,name),part=carriagePieces[name],radius=CART_ART.pieces[name].radius;sprite(c,'cart-'+name,v.x,v.y,0,[radius,radius],part,[0,0,part.width,part.height]);}
 const wheel=cartPort(p,'wheel'),part=carriagePieces.wheel,radius=CART_ART.pieces.wheel.radius;
 sprite(c,'cart-wheel',wheel.x,wheel.y,s.machine.cargo.distance/45,[radius,radius],part,[0,0,part.width,part.height]);
 const phase=s.machine.release;for(const [name,flip]of [['clampLeft',-1],['clampRight',1]]){const mount=cartPort(p,name);sprite(c,'clamp',mount.x,mount.y,flip*(.12+phase*.8),[7,0]);}
}
function fixedWorld(c,s){
 const decor=drawDepthMidground(c,s);
 let ready=decor.ready&&connectionsReady()&&!!ladder.naturalWidth;
 const floors=[...s.level.floors,...s.level.platforms];
 // Every steel pier runs from its platform to a real lower foundation.
 for(const platform of s.level.platforms)for(const x of [platform.x+20,platform.x+platform.w-24]){const base=s.level.floors.find(f=>f.y>platform.y&&x>=f.x&&x<=f.x+f.w);if(base)drawConnection(c,[[x,platform.y+20],[x,base.y]],'rail');}
 for(const f of s.level.floors)ready=drawTerrain(c,{round:5,campaign:'story'},f.x,f.y,f.w,f.y===1120?80:140).ready&&ready;
 // The carriage wheels follow a solid rail; raised runs have floor-reaching brackets.
 drawConnection(c,WARDEN_TRACK.map(([x,y])=>[x+150,y+58]),'rail');
 for(const x of [2060,2120])drawConnection(c,[[x,558],[x,1120]],'rail');
 for(const f of s.level.platforms)ready=drawTerrain(c,{round:5,campaign:'story'},f.x,f.y,f.w,20).ready&&ready;
 drawDepthWallFaces(c,s);
 ladders(c,wardenLevel.ladders);
 return{decor,ready};
}
function fixedChunks(c,s,view){
 let decor,ready=true,draws=0;
 for(const chunk of visibleChunks(view,s.level)){
  const key=chunk.x+':'+chunk.y;let entry=fixed.get(key);
  if(!entry){
   const raw=document.createElement('canvas');raw.width=chunk.w/2;raw.height=chunk.h/2;const ctx=raw.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.setTransform(.5,0,0,.5,-chunk.x/2,-chunk.y/2);
   const info=fixedWorld(ctx,s),b=document.createElement('canvas');b.width=raw.width;b.height=raw.height;const g=b.getContext('2d');g.imageSmoothingEnabled=false;g.filter='saturate(.62) brightness(.88)';g.drawImage(raw,0,0);
   entry={image:b,...info};if(info.ready)fixed.set(key,entry);
  }
  ready=ready&&entry.ready;decor=entry.decor;c.drawImage(entry.image,chunk.x,chunk.y,chunk.w,chunk.h);draws++;
 }
 return{decor,ready,draws};
}
export function drawWardenWorld(c,s,camera,viewport){
 const g=s.machine,p=wardenGeometry(s,footOffsets),view={...camera,width:viewport.width,height:viewport.height};renderView=view;
 c.fillStyle='#0b1925';c.fillRect(camera.x,camera.y,viewport.width,viewport.height);c.save();
 if(scene.naturalWidth){const w=scene.naturalWidth*2,h=scene.naturalHeight*2,x=q(camera.x*.72+Math.max(0,(viewport.width-w)/2));c.drawImage(grade(scene),x,q(1200-h+camera.y*.15),w,h);}
 const scenery=fixedChunks(c,s,view),decor=scenery.decor,floors=[...s.level.floors,...s.level.platforms];
 const ladderLayers=partitionLadders(s.level.ladders,wardenLevel.ladders);ladders(c,ladderLayers.dynamic);
 for(const l of p.legs){c.fillStyle='#081017';c.fillRect(q(l.foot.x-42),938,84,4);if(l.far)limb(c,l);}
 sprite(c,'body',p.body.x,p.body.y,p.body.angle,[0,A.anchors.bodyDeck]);
 for(const leg of p.legs)if(leg.far)sprite(c,'joint-far',leg.hip.x,leg.hip.y,0,[16,16]);
 drawConnection(c,[[1544,q(p.body.y+80)],[1584,q(p.body.y+80)],[1584,q(p.eye.y)]],'pipe');
 head(c,s,p.eye);if(emitter.naturalWidth)c.drawImage(grade(emitter),q(p.emitter.x-34),q(p.eye.y-146),64,64);
 for(const l of p.legs)if(!l.far)limb(c,l);
 const capFrame=Math.min(3,Math.floor(g.stroke*3+.25));if(plunger.naturalWidth)c.drawImage(grade(plunger),capFrame*80,0,80,64,1340,q(p.plunger.y-76),160,128);
 // Visible sprung actuator and pipe enter the optic's maintenance port.
 drawConnection(c,[[1420,q(p.plunger.y+8)],[1454,q(p.plunger.y+8)],[1454,q(p.eye.y-80)],[1572,q(p.eye.y-80)]],'cable');
 cargo(c,s,p.cargo);
 // Human service fixtures give both ledges and recall controls a purpose.
 for(const [x,y] of [[650,760],[1720,940],[2310,500]]){const frame=g.disabled?2:0,place=tower.placement(frame,{x:x-64,y:y-192,w:128,h:192},floors);if(place&&tower.image.naturalWidth)c.drawImage(grade(tower.image),0,frame===2?tower.image.height/2:0,tower.image.width/2,tower.image.height/2,place.x,place.y,place.w,place.h);}
 const portal={x:2736,y:372,w:128,h:128},place=gate.placement(0,portal,floors);
 if(place){drawCycleGateField(c,{...place,active:g.disabled,frame:Math.floor(s.time*12),glow:.8,aperture:{x:2800,y:446,w:40,h:80}});c.drawImage(grade(gate.image),place.x,place.y,place.w,place.h);}
 c.restore();
 if(p.telegraph||g.braced){c.fillStyle=g.braced?'#95e9de':'#d59f4c';for(let n=0;n<3;n++)c.fillRect(q(g.footX-34+n*24),934,18,4);}
 for(const wave of g.waves||[]){c.save();c.globalAlpha=wardenWaveOpacity(wave.age);for(let n=0;n<7;n++){c.fillStyle=n%2?'#b98154':'#e2bd88';const dx=-wave.dir*n*6;c.fillRect(q(wave.x+dx),q(936-(6-n)*3),4,q((7-n)*3));}c.restore();}
 const blockAge=s.time-(g.blockAt??-10);if(blockAge<.25){c.fillStyle='#e4bb7c';const o=s.heroes[2];for(let n=0;n<4;n++)c.fillRect(q(o.x+o.face*(32+n*blockAge*50)),q(918-n*6-blockAge*20),2,2);}

 const slamAge=s.time-(g.slamAt??-10);if(slamAge<.45)for(let n=0;n<10;n++){const x=g.footX+(n-5)*12*slamAge*4,y=938-Math.sin(n*2.1)*slamAge*45+slamAge*slamAge*130;c.fillStyle=n%2?'#a48b65':'#63746e';c.fillRect(q(x),q(Math.min(938,y)),4,4);}
 const age=s.time-g.disabledAt;if(g.disabled&&age<1.2)for(let n=0;n<14;n++){const t=age+n*.03,x=1724+Math.cos(n*2.4)*t*95,y=p.eye.y+Math.sin(n*2.4)*t*80+120*t*t;c.fillStyle=n%2?'#d6ae58':'#80dad8';c.fillRect(q(x),q(y),4,4);}
 renderView=null;
 return {decor,boardingLadders:ladderLayers.dynamic,renderCache:{chunks:fixed.size,draws:scenery.draws,rotations:cache.size},ready:scenery.ready&&depthReady()&&!!(carriage.naturalWidth&&emitter.naturalWidth&&plunger.naturalWidth&&parts.naturalWidth&&scene.naturalWidth&&brokenLens.naturalWidth&&ladder.naturalWidth&&tower.image.naturalWidth&&gate.image.naturalWidth&&connectionsReady()),legs:p.legs,spine:p.spine,eye:p.eye,emitter:p.emitter,plunger:p.plunger,cargo:p.cargo,carriage:{...cartPlacement(p.cargo),deck:q(p.cargo.y),nativeSize:CART_ART.nativeSize,worldPixel:2,wheels:['wheelNear','wheelFar'].map(name=>cartWheelPlacement(p.cargo,name)),ports:Object.fromEntries(Object.keys(CART_ART.ports).map(name=>[name,cartPort(p.cargo,name)]))},shutter:g.shutter,capFrame,sourceDensity:'512native component atlas,192native carriage and960native-width archive; one native pixel=2world units',contacts:p.legs.map(l=>({id:l.id,sole:l.foot.y,surface:l.id===g.activeLeg&&g.braced?860:940}))};
}

function drawWardenLaser(c,s,p){const g=s.machine;
 const laser=g.laser;if(laser?.target&&laser.phase!=='cooldown'&&!g.disabled){const hit=laserTrace(s,p.emitter,laser.target),dx=hit.x-p.emitter.x,dy=hit.y-p.emitter.y,steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/2)),fire=laser.phase==='fire';
  // Render emission on the native grid rather than antialiasing diagonal strokes.
  c.fillStyle=fire?'#cf8058':laser.phase==='lock'?'#cb7658':'#907e61';const width=fire?8:2;
  for(let n=0;n<=steps;n++){if(laser.phase==='track'&&Math.floor(n/4)%2)continue;c.fillRect(q(p.emitter.x+dx*n/steps-width/2),q(p.emitter.y+dy*n/steps-width/2),width,width);}
  if(fire){c.fillStyle='#ffebc8';for(let n=0;n<=steps;n++)c.fillRect(q(p.emitter.x+dx*n/steps),q(p.emitter.y+dy*n/steps),2,2);}
  c.fillStyle=fire?'#ffebc8':'#d58b51';c.fillRect(q(p.emitter.x-2),q(p.emitter.y-2),4,4);
 }
}

export function drawWardenOverlay(c,s){
 if(s.level.mechanic!=='warden')return null;
 const p=wardenGeometry(s),laser=s.machine.laser,beam=laser?.target?{from:p.emitter,to:laserTrace(s,p.emitter,laser.target)}:null;
 const optics=drawCombatRefraction(c,s,beam);drawWardenLaser(c,s,p);return {...optics,sweatDrops:drawBraceSweat(c,s)};
}
