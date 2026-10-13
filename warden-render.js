import {drawDepthMidground,drawDepthWallFaces,depthReady} from './depth-render94.js?v=depth94';
import {laserTrace} from './warden-combat.js?v=warden91';
import {wardenGeometry,WARDEN_TRACK} from './warden-campaign.js?v=warden89';
import {WARDEN_ART as A} from './warden-art89.js?v=warden89';
import {drawTerrain} from './terrain-render.js?v=terrain48';
import {drawConnection,connectionsReady} from './connection-render.js?v=connections53';
import {createAtlas} from './sprite-atlas.js?v=fan66';
import {drawCycleGateField} from './cycle-gate.js?v=gate61';
import {snapPixel as q} from './pixel-grid.js?v=arc46';
const load=p=>{const i=new Image();i.src=p;return i;};
const parts=load('assets/warden89/parts-native.png'),scene=load('assets/warden89/scene-native.png'),brokenLens=load('assets/warden89/broken-lens-native.png'),ladder=load('assets/platform56/ladder.png');
const plunger=load('assets/warden91/plunger-native.png'),emitter=load('assets/warden91/emitter-native.png');
const gate=createAtlas('assets/gate61/gate.png',1,1),tower=createAtlas('assets/clockwork71/tower.png',2,2),cache=new Map();
function sprite(c,name,x,y,angle=0,anchor=[0,0]){
 if(!parts.naturalWidth)return;
 const r=A.parts[name],deg=Math.round(angle*180/Math.PI/2)*2,key=name+':'+deg+':'+anchor;
 let b=cache.get(key);if(!b){const size=Math.ceil(Math.hypot(r[2],r[3])*2+8);b=document.createElement('canvas');b.width=b.height=size;const t=b.getContext('2d');t.imageSmoothingEnabled=false;t.translate(size/2,size/2);t.rotate(deg*Math.PI/180);t.drawImage(parts,...r,-anchor[0],-anchor[1],r[2],r[3]);cache.set(key,b);}
 c.drawImage(b,q(x-b.width),q(y-b.height),b.width*2,b.height*2);
}
function limb(c,leg){const idx=leg.far?2:0;for(const [i,p,n] of [[idx,leg.hip,leg.knee],[idx+1,leg.knee,leg.ankle]]){
 const name=['upper-near','lower-near','upper-far','lower-far'][i];sprite(c,name,p.x,p.y,-Math.atan2(n.x-p.x,n.y-p.y),A.anchors.linkPivots[i]);}
 sprite(c,leg.far?'foot-far':'foot-near',leg.foot.x,leg.foot.y,0,[20,39]);
}
function ladders(c,s){if(!ladder.naturalWidth)return;for(const l of s.level.ladders)for(let y=l.top;y<l.bottom;y+=26){const h=Math.min(26,l.bottom-y);c.drawImage(ladder,0,0,24,h/2,q(l.x-24),q(y),48,q(h));}}
function head(c,s,p){
 sprite(c,'head-closed',1552,p.y,0,[0,62]);
 if(!parts.naturalWidth)return;
 // Authored metal shutters slide within the lens housing on the native grid.
 // Keep the closed housing fixed: its registered 27x45 aperture is narrower
 // than the separately authored open head. Only its glass and shutters move.
 c.save();c.beginPath();c.rect(1696,q(p.y-52),54,90);c.clip();
 c.drawImage(parts,280,180,27,45,1696,q(p.y-52),54,90);
 const rise=q(s.machine.shutter*54);
 c.drawImage(parts,72,180,27,25,1696,q(p.y-52-rise),54,50);
 c.drawImage(parts,72,205,27,20,1696,q(p.y-2+rise),54,40);
 c.restore();
 if(s.machine.disabled&&brokenLens.naturalWidth){c.save();c.filter='brightness(.7)';c.drawImage(brokenLens,1552,q(p.y-124),208,224);c.restore();}
}
function cargo(c,s,p){
 // One registered carriage stays rigid; real authored hinge links release its clamps.
 sprite(c,'cargo-free',p.x,p.y,0,[9,62]);
 for(let n=0;n<4;n++)sprite(c,'spoke',p.x+158,p.y-18,n*Math.PI/2+s.machine.cargo.distance/45,[0,2]);
 const phase=s.machine.release;for(const [x,flip] of [[p.x+2,-1],[p.x+p.w-4,1]])sprite(c,'clamp',x,p.y-90,flip*(.12+phase*.8),[7,0]);
}
export function drawWardenWorld(c,s,camera,viewport){
 const g=s.machine,p=wardenGeometry(s);c.fillStyle='#0b1925';c.fillRect(camera.x,camera.y,viewport.width,viewport.height);c.save();c.filter='saturate(.62) brightness(.88)';
 if(scene.naturalWidth){const w=scene.naturalWidth*2,h=scene.naturalHeight*2,x=q(camera.x*.72+Math.max(0,(viewport.width-w)/2));c.drawImage(scene,x,q(1200-h+camera.y*.15),w,h);}
 const decor=drawDepthMidground(c,s);
 const floors=[...s.level.floors,...s.level.platforms];
 // Every steel pier runs from its platform to a real lower foundation.
 for(const platform of s.level.platforms)for(const x of [platform.x+20,platform.x+platform.w-24]){const base=s.level.floors.find(f=>f.y>platform.y&&x>=f.x&&x<=f.x+f.w);if(base)drawConnection(c,[[x,platform.y+20],[x,base.y]],'rail');}
 for(const f of s.level.floors)drawTerrain(c,{round:5,campaign:'story'},f.x,f.y,f.w,f.y===1120?80:140);
 // The carriage wheels follow a solid rail; raised runs have floor-reaching brackets.
 drawConnection(c,WARDEN_TRACK.map(([x,y])=>[x+150,y+58]),'rail');
 for(const x of [2060,2120])drawConnection(c,[[x,558],[x,1120]],'rail');
 for(const f of s.level.platforms)drawTerrain(c,{round:5,campaign:'story'},f.x,f.y,f.w,20);
 drawDepthWallFaces(c,s);
 ladders(c,s);
 for(const l of p.legs){c.fillStyle='#081017';c.fillRect(q(l.foot.x-42),938,84,4);if(l.far)limb(c,l);}
 sprite(c,'body',p.body.x,p.body.y,p.body.angle,[0,14]);
 for(const leg of p.legs)if(leg.far)sprite(c,'hub-far',leg.hip.x,leg.hip.y,0,[12,12]);
 drawConnection(c,[[1544,q(p.body.y+80)],[1584,q(p.body.y+80)],[1584,q(p.eye.y)]],'pipe');
 head(c,s,p.eye);if(emitter.naturalWidth)c.drawImage(emitter,q(p.emitter.x-34),q(p.eye.y-146),64,64);
 for(const l of p.legs)if(!l.far)limb(c,l);
 const capFrame=Math.min(3,Math.floor(g.stroke*3+.25));if(plunger.naturalWidth)c.drawImage(plunger,capFrame*80,0,80,64,1340,q(p.plunger.y-76),160,128);
 // Visible sprung actuator and pipe enter the optic's maintenance port.
 drawConnection(c,[[1420,q(p.plunger.y+8)],[1454,q(p.plunger.y+8)],[1454,q(p.eye.y-80)],[1572,q(p.eye.y-80)]],'cable');
 cargo(c,s,p.cargo);
 // Human service fixtures give both ledges and recall controls a purpose.
 for(const [x,y] of [[650,760],[1720,940],[2310,500]])tower.drawGrounded(c,g.disabled?2:0,{x:x-64,y:y-192,w:128,h:192},floors);
 const portal={x:2736,y:372,w:128,h:128},place=gate.placement(0,portal,floors);
 if(place){drawCycleGateField(c,{...place,active:g.disabled,frame:Math.floor(s.time*12),glow:.8,aperture:{x:2800,y:446,w:40,h:80}});gate.drawGrounded(c,0,portal,floors);}
 c.restore();
 if(p.telegraph||g.braced){c.fillStyle=g.braced?'#95e9de':'#d59f4c';for(let n=0;n<3;n++)c.fillRect(q(g.footX-34+n*24),934,18,4);}
 if(g.braced){const left=Math.max(0,1-g.braceAge/14);c.fillStyle='#172326';c.fillRect(q(g.footX-28),q(g.footY-18),56,6);c.fillStyle=left<.3?'#d69060':'#8bafa2';c.fillRect(q(g.footX-28),q(g.footY-18),q(56*left),6);}
 for(const wave of g.waves||[]){c.save();c.globalAlpha=Math.min(1,(2.8-wave.age)*3);for(let n=0;n<7;n++){c.fillStyle=n%2?'#b98154':'#e2bd88';const dx=-wave.dir*n*6;c.fillRect(q(wave.x+dx),q(936-(6-n)*3),4,q((7-n)*3));}c.restore();}
 const laser=g.laser;if(laser?.target&&laser.phase!=='cooldown'&&!g.disabled){const hit=laserTrace(s,p.emitter,laser.target),dx=hit.x-p.emitter.x,dy=hit.y-p.emitter.y,steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/2)),fire=laser.phase==='fire';
  // Render emission on the native grid rather than antialiasing diagonal strokes.
  c.fillStyle=fire?'#cf8058':laser.phase==='lock'?'#cb7658':'#907e61';const width=fire?8:2;
  for(let n=0;n<=steps;n++){if(laser.phase==='track'&&Math.floor(n/4)%2)continue;c.fillRect(q(p.emitter.x+dx*n/steps-width/2),q(p.emitter.y+dy*n/steps-width/2),width,width);}
  if(fire){c.fillStyle='#ffebc8';for(let n=0;n<=steps;n++)c.fillRect(q(p.emitter.x+dx*n/steps),q(p.emitter.y+dy*n/steps),2,2);}
  c.fillStyle=fire?'#ffebc8':'#d58b51';c.fillRect(q(p.emitter.x-2),q(p.emitter.y-2),4,4);
 }
 const blockAge=s.time-(g.blockAt??-10);if(blockAge<.25){c.fillStyle='#e4bb7c';const o=s.heroes[2];for(let n=0;n<4;n++)c.fillRect(q(o.x+o.face*(32+n*blockAge*50)),q(918-n*6-blockAge*20),2,2);}

 const slamAge=s.time-(g.slamAt??-10);if(slamAge<.45)for(let n=0;n<10;n++){const x=g.footX+(n-5)*12*slamAge*4,y=938-Math.sin(n*2.1)*slamAge*45+slamAge*slamAge*130;c.fillStyle=n%2?'#a48b65':'#63746e';c.fillRect(q(x),q(Math.min(938,y)),4,4);}
 const age=s.time-g.disabledAt;if(g.disabled&&age<1.2)for(let n=0;n<14;n++){const t=age+n*.03,x=1724+Math.cos(n*2.4)*t*95,y=p.eye.y+Math.sin(n*2.4)*t*80+120*t*t;c.fillStyle=n%2?'#d6ae58':'#80dad8';c.fillRect(q(x),q(y),4,4);}
 return {decor,ready:depthReady()&&!!(emitter.naturalWidth&&plunger.naturalWidth&&parts.naturalWidth&&scene.naturalWidth&&brokenLens.naturalWidth&&ladder.naturalWidth&&tower.image.naturalWidth&&gate.image.naturalWidth&&connectionsReady()),legs:p.legs,spine:p.spine,eye:p.eye,emitter:p.emitter,plunger:p.plunger,cargo:p.cargo,shutter:g.shutter,capFrame,sourceDensity:'512native component atlas and960native-width archive; one native pixel=2world units',contacts:p.legs.map(l=>({id:l.id,sole:l.foot.y,surface:l.id===g.activeLeg&&g.braced?860:940}))};
}
