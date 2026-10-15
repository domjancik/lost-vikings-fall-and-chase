import {drawTerrain} from '../../render/terrain-render.js';
import {drawConnection,drawConnectionTile} from '../../render/connection-render.js';
import {createAtlas} from '../../render/sprite-atlas.js';
import {drawCycleGateField} from '../../campaigns/machines/cycle-gate.js';
import {orbitRaster} from '../orbit/raster.js';
import {railContact} from '../orbit/magnetic.js';
import {lodeBallastPoint,lodeControl} from './campaign.js?v=lode123';
import {snapPixel as q} from '../../render/pixel-grid.js';
const load=path=>{const i=new Image();i.src='assets/'+path;return i;};
const far=load('lode123/far-native.png'),middle=load('lode123/middle-native.png'),stator=load('lode123/stator-native.png'),kit=load('lode123/kit-native.png');
const hardware=load('orbit121/hardware-native.png'),plate=load('orbit121/plate-native.png'),ladder=load('platform56/ladder.png');
const gate=createAtlas('assets/gate61/gate.png',1,1),ready=i=>i.complete&&i.naturalWidth;
function part(c,n,x,y,flip=false){if(!ready(kit))return;c.save();c.translate(q(x),q(y));if(flip){c.translate(128,0);c.scale(-1,1);}c.drawImage(kit,n%4*64,Math.floor(n/4)*64,64,64,0,0,128,128);c.restore();}
function pier(c,x,top,bottom){if(bottom<=top||!ready(hardware))return;c.drawImage(hardware,213,0,22,11,q(x-22),q(top),44,22);for(let y=top+22;y<bottom-22;y+=44){const h=Math.min(44,bottom-22-y);c.drawImage(hardware,218,11,14,h/2,q(x-14),q(y),28,h);}c.drawImage(hardware,213,44,22,11,q(x-22),q(bottom-22),44,22);}
function beam(c,left,right,y){c.save();c.translate(q(left),q(y));c.rotate(-Math.PI/2);pier(c,0,0,right-left);c.restore();}
// A telescoping chain run can have a final segment shorter than one native
// connection tile. Clip the authored link instead of stretching or dropping it.
function chain(c,points){
 const snapped=points.map(p=>p.map(q)),v=snapped.filter((p,n)=>!n||p[0]!==snapped[n-1][0]||p[1]!==snapped[n-1][1]);
 for(let n=1;n<v.length;n++){const a=v[n-1],b=v[n],horizontal=a[1]===b[1],length=Math.abs(b[0]-a[0])+Math.abs(b[1]-a[1]);if(!length)continue;const d=horizontal?Math.sign(b[0]-a[0]):Math.sign(b[1]-a[1]),end=length<32?[a[0]+(horizontal?d*32:0),a[1]+(horizontal?0:d*32)]:b;
 c.save();c.beginPath();c.rect(horizontal?Math.min(a[0],b[0]):a[0]-16,horizontal?a[1]-16:Math.min(a[1],b[1]),horizontal?length:32,horizontal?32:length);c.clip();drawConnection(c,[a,end],'cable',{anchors:false});c.restore();}
 for(const p of v.slice(1,-1))drawConnectionTile(c,14,p[0],p[1]);
}
const rails=new Map();
function railArt(p){if(!ready(plate))return null;const key=p.w;if(rails.has(key))return rails.get(key);const b=document.createElement('canvas'),size=p.w===440?256:384;b.width=b.height=size;const c=b.getContext('2d');c.imageSmoothingEnabled=false;const x=(size-p.w/2)/2,y=size/2-12;
 c.drawImage(plate,10,36,12,25,x,y,12,25);for(let a=12;a<p.w/2-12;a+=20){const w=Math.min(20,p.w/2-12-a);c.drawImage(plate,115,36,w,25,x+a,y,w,25);}c.drawImage(plate,170,36,12,25,x+p.w/2-12,y,12,25);c.drawImage(plate,85,36,23,25,size/2-11,y,23,25);
 const image=new Image();image.src=b.toDataURL();rails.set(key,image);return image;}
function lever(c,s,id){const o=lodeControl(s,id),g=s.machine,active=id==='call'?!g.liftWanted:g.liftWanted;part(c,active?4:3,o.x-64,o.y-76);return{kind:id,x:o.x,y:o.y,active,materialBase:o.y+44};}
let wheelImage;
function spinningWheel(c,x,y,angle){
 if(!ready(kit))return;
 if(!wheelImage){const b=document.createElement('canvas');b.width=b.height=64;const g=b.getContext('2d');g.imageSmoothingEnabled=false;g.beginPath();g.arc(33,33,23,0,Math.PI*2);g.clip();g.drawImage(kit,128,0,64,64,0,0,64,64);wheelImage=new Image();wheelImage.src=b.toDataURL();}
 const b=orbitRaster(wheelImage,angle,{size:80,pivotX:33,pivotY:33});if(b)c.drawImage(b,q(x-80),q(y-80),160,160);
}
export function drawLodeWorld(c,s,camera,view){const g=s.machine,contacts=[];c.imageSmoothingEnabled=false;c.fillStyle='#102632';c.fillRect(camera.x,camera.y,view.width,view.height);
 const planes={far:{x:q(camera.x*.88),y:q(-40+camera.y*.09)},middle:{x:q(camera.x*.62),y:q(-20+camera.y*.025)}};
 if(ready(far))for(let x=planes.far.x-1536;x<camera.x+view.width;x+=1536)c.drawImage(far,x,planes.far.y,1536,1280);
 if(ready(middle))for(let x=planes.middle.x-1536;x<camera.x+view.width;x+=1536){c.drawImage(middle,x,planes.middle.y,1536,1280);for(const [dx,phase]of [[510,0],[1040,Math.PI]]){const y=q(650+Math.sin(s.time*.18+phase)*120+planes.middle.y);drawConnection(c,[[x+dx,planes.middle.y+390],[x+dx,y+14]],'cable');c.save();c.filter='brightness(.5)';part(c,0,x+dx-64,y-24);c.restore();}}
 // Ground every gallery and service gantry in the lower slab.
 for(const [x,top,bottom]of [[1140,748,1260],[1710,748,1260],[2390,748,1260],[2920,748,1260],[2390,364,700],[2630,364,700],[3240,180,1260],[3460,180,1260]]){pier(c,x,top,bottom);contacts.push({kind:'pier',x,top,bottom});}
 beam(c,2700,3500,180);beam(c,3070,3250,548);drawConnection(c,[[2660,650],[2660,768],[3260,768],[3260,180],[3040,180],[3040,g.plates[2].y-24]],'cable');
 // Guarded counterweight shaft is behind the walk plane, not an invisible obstacle.
 c.fillStyle='#12232a';c.fillRect(3100,580,120,650);for(let y=600;y<1230;y+=32){c.fillStyle='#2e4145';c.fillRect(3100,y,120,4);}pier(c,3090,548,1260);pier(c,3230,548,1260);
 const ballast=lodeBallastPoint(s);chain(c,[[3040,g.plates[2].y-24],[3040,200],[3160,200],[3160,240],[ballast.x,240],[ballast.x,ballast.y+12]]);
 for(const f of s.level.floors)drawTerrain(c,{campaign:'story',round:5},f.x,f.y,f.w,f.y===1260?80:48);
 // Large service drum is one uniformly normalized native source, never stretched.
 beam(c,890,1110,1238);if(ready(stator))c.drawImage(stator,700,678,600,600);contacts.push({kind:'stator',body:[720,700,560,556],foundation:1260});
 for(const p of g.plates.slice(1)){const source=railArt(p),size=p.w===440?256:384;const b=source&&orbitRaster(source,p.angle,{size,pivotX:size/2,pivotY:size/2});if(b)c.drawImage(b,q(p.x-size),q(p.y-size),size*2,size*2);contacts.push({kind:'rail',id:p.id,x:p.x,y:p.y,w:p.w,h:p.h,angle:p.angle,nativePixel:2});}
 // Hinged axle sits in its permanent, floor-supported bearing.
 pier(c,2100,746,1260);if(ready(hardware))c.drawImage(hardware,96,0,32,32,2068,692,64,64);
 const wheel=lodeControl(s,'bridge'),p=g.plates[1],r=railContact(p,24);c.save();c.translate(q(r.x+r.nx*28),q(r.y+r.ny*28));c.rotate(p.angle);spinningWheel(c,0,0,g.winding*Math.PI*4+(Math.PI/2-p.angle)*2);c.restore();

 // Rope ends visibly separate after the cut, while the bracket remains fixed.
 beam(c,1996,2100,612);pier(c,2100,612,1260);drawConnection(c,[[1996,724],[2100,724]],'cable');part(c,g.brakeCut?11:10,1932,618);if(g.brakeCut){c.fillStyle='#c4a166';const t=g.brakePose;c.fillRect(q(1996+Math.sin(t*4)*8),q(676+t*16),4,12);}
 part(c,g.recovery?9:8,1076,584);for(const l of s.level.ladders)if(ready(ladder))for(let y=l.top;y<l.bottom;y+=26){const h=Math.min(26,l.bottom-y);c.drawImage(ladder,0,0,24,h/2,1756,q(y),48,h);}drawConnection(c,[[1140,700],[1140,778],[1780,778],[1780,700]],'cable');
 part(c,1,3160-54,600-24);part(c,0,ballast.x-64,ballast.y-26);contacts.push({kind:'ballast',wheelTop:ballast.y-2,contactPlane:ballast.y,bottom:ballast.y+92,banked:g.banked,worldX:ballast.x,worldY:ballast.y});
 // Fixed hoist pulleys turn with the actual opposing displacement, not a clock.
 for(const x of [3040,3160])spinningWheel(c,x,180,(576-g.plates[2].y)/32*(x===3040?1:-1));
 contacts.push(lever(c,s,'call'),lever(c,s,'cabin'));
 const e=g.sentry,n=e.hp?5+Math.floor(e.clock*5)%2:7;part(c,n,e.x-64,e.y-108,e.dir<0);contacts.push({kind:'sentry',x:e.x,sole:e.y,hp:e.hp});
 if(e.warning>0&&e.hp){c.fillStyle='#d28e66';for(let n=0;n<3;n++)c.fillRect(q(e.x-12+n*10),594,6,q(e.warning*10+2));}
 for(const shot of s.shots){c.save();c.translate(q(shot.x),q(shot.y));c.rotate(Math.atan2(shot.vy||0,shot.vx));c.fillStyle=shot.kind==='arrow'?'#e0c595':'#a3e9e2';c.fillRect(-18,-2,22,4);c.fillRect(0,-4,6,8);c.restore();}
 gate.draw(c,0,2416,188,128,128);drawCycleGateField(c,{active:!!s.power,frame:Math.floor(s.time*12),glow:.72+.18*Math.sin(s.time*4),aperture:{x:2480,y:264,w:40,h:80}});
 return{ready:[far,middle,stator,kit,hardware,plate,gate.image].every(ready),release:'lode123',planes,contacts,brakePose:g.brakePose,bridgeAngle:p.angle,liftY:g.plates[2].y,bankPose:g.bankPose};
}
