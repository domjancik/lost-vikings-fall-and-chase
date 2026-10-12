import {drawCycleGateField} from './cycle-gate.js?v=gate61';
import {createAtlas} from './sprite-atlas.js?v=fan66';
import {drawTerrain} from './terrain-render.js?v=terrain48';
import {drawConnection,connectionsReady} from './connection-render.js?v=connections53';
import {snapPixel} from './pixel-grid.js?v=arc46';
import {waterAirPockets,waterJet,waterSheltered} from './water-campaign.js?v=water83';
const atlas=createAtlas('assets/water83/machines-native.png',4,3),motion=createAtlas('assets/water83/motion-native.png',8,4);
const exitAtlas=createAtlas('assets/gate61/gate.png',1,1),nozzle=createAtlas('assets/water83/nozzle-native.png',1,1);
const scene=new Image(),ladder=new Image();scene.src='assets/water83/scene-raw.png';ladder.src='assets/platform56/ladder.png';
const rect=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(snapPixel(x),snapPixel(y),snapPixel(w),snapPixel(h));};
function ladderDraw(c,l){if(!ladder.naturalWidth)return;for(let y=l.top;y<l.bottom;y+=26){const h=Math.min(26,l.bottom-y);c.drawImage(ladder,0,0,24,h/2,l.x-24,y,48,h);}}
export function drawWaterWorld(c,s,camera,viewport){
 const g=s.machine,f=g.float,placements=[];
 rect(c,'#0a1b28',camera.x,camera.y,viewport.width,viewport.height);
 // Preserve the scene's actual authored density. Its foundation stays beneath the basin floor.
 if(scene.naturalWidth){const w=scene.naturalWidth*2,h=scene.naturalHeight*2,x=snapPixel((2400-w)/2+camera.x*.78),y=snapPixel(1120-h+camera.y*.12);c.drawImage(scene,x,y,w,h);}
 const grounded=(n,x,floorY)=>{const p=atlas.drawGrounded(c,n,{x:x-96,y:floorY-192,w:192,h:192},[{x:0,y:floorY,w:2400}]);if(p)placements.push({cell:n,x,visibleBottom:p.visibleBottom,floorY});};
 const moving=(n,x,floorY)=>{const p=motion.drawGrounded(c,n,{x:x-96,y:floorY-192,w:192,h:192},[{x:0,y:floorY,w:2400}]);if(p)placements.push({cell:'motion-'+n,x,visibleBottom:p.visibleBottom,floorY});};
 // The overhead intake has a complete pipe route, not a floating emitter.
 drawConnection(c,[[240,160],[710,160],[710,384]],'pipe');
 drawConnection(c,[[940,856],[804,856],[804,490]],'cable');
 drawConnection(c,[[1660,956],[1900,956],[1900,996]],'pipe');
 nozzle.draw(c,0,662,384,96,96);
 // Supports continue to a real lower surface.
 for(const p of s.level.platforms)for(const x of [p.x+8,p.x+p.w-20]){rect(c,'#405459',x,p.y+20,12,1000-p.y-20);rect(c,'#9ba998',x,p.y+20,2,1000-p.y-20);}
 for(const p of s.level.floors)drawTerrain(c,{round:5,campaign:'story'},p.x,p.y,p.w,p.y===1000?120:48);
 for(const p of s.level.platforms)drawTerrain(c,{round:5,campaign:'story'},p.x,p.y,p.w,20);
 for(const l of s.level.ladders)ladderDraw(c,l);
 // A retracting segmented service gate preserves the collision boundary throughout motion.
 const bottom=850-400*g.valvePose;
 c.save();c.beginPath();c.rect(760,120,28,Math.max(0,bottom-120));c.clip();
 if(atlas.image.naturalWidth)for(let y=120;y<bottom;y+=168)c.drawImage(atlas.image,96+39,192+4,18,84,756,y,36,168);
 c.restore();rect(c,'#ae8750',748,120,52,18);
 grounded(2,940,900);grounded(1,f.x,1000);
 // Hose attaches to the compressor's outlet and the bell's crown as the surface descends.
 const hoseTop=Math.min(g.waterY-152,752);drawConnection(c,[[f.x-26,g.waterY-104],[f.x-26,hoseTop],[f.x-110,hoseTop],[f.x-110,800],[f.x,800],[f.x,840]],'cable',{time:s.time,phase:2});
 // A separate native flexible tow line terminates at the bell's left skid.
 const towTop=g.waterY+2;if(968-towTop>=32)drawConnection(c,[[f.x-76,towTop],[f.x-76,968]],'cable',{time:s.time*.25,phase:0});
 motion.draw(c,Math.floor(s.time*6)%8,f.x-96,g.waterY-12-104,192,192);
 moving(16+Math.min(7,Math.floor(g.valvePose*8)),940,900);
 // The handwheel turns through registered native frames while winding; its chain visibly disappears after cutting.
 if(!g.chainCut)grounded(5,1660,1000);
 else if(g.wound===1)grounded(8,1660,1000);
 else if(g.wound===0)grounded(6,1660,1000);
 else moving(8+Math.floor(g.wound*40)%8,1660,1000);
 if(g.chainCut&&s.time-g.chainAt<.6){const t=s.time-g.chainAt;if(atlas.image.naturalWidth)c.drawImage(atlas.image,108,141,10,34,1620,snapPixel(914+t*t*120),20,68);}
 moving(24+Math.min(7,Math.floor(g.drainPose*8)),1900,1000);
 // Portal is powered by the receding water, with a moving interior and fixed grounded pedestal.
 const pose={x:2236,y:412,w:128,h:128},place=exitAtlas.placement(0,pose,[{x:2100,y:540,w:300}]);if(place){drawCycleGateField(c,{...place,active:s.power,glow:.8,frame:Math.floor(s.time*12),aperture:{x:place.x+64,y:place.y+74,w:40,h:80}});exitAtlas.drawGrounded(c,0,pose,[{x:2100,y:540,w:300}]);placements.push({cell:'portal',x:2300,visibleBottom:place.visibleBottom,floorY:540});}
 return {ready:!!(atlas.image.naturalWidth&&motion.image.naturalWidth&&scene.naturalWidth&&ladder.naturalWidth&&exitAtlas.image.naturalWidth&&nozzle.image.naturalWidth&&connectionsReady()),waterY:g.waterY,jet:waterJet(s),sheltered:waterSheltered(s),placements,airPockets:waterAirPockets(s),floatDeck:g.waterY-12,gateBottom:bottom,sourceDensity:'native assets; two world units per source pixel'};
}
export function drawWaterOverlay(c,s){
 if(s.level.mechanic!=='water')return;
 const y=snapPixel(s.machine.waterY),pockets=waterAirPockets(s);
 c.save();c.beginPath();c.rect(320,y,1780,1000-y);
 for(const p of pockets)c.rect(p.x+12,p.y,p.w-24,p.h);
 c.clip('evenodd');rect(c,'#195f7940',320,y,1780,1000-y);c.restore();
 for(let x=320;x<2100;x+=26){const rise=Math.floor(Math.sin(x*.02+s.time*2)*2)*2;rect(c,'#78c5c9',x,y+rise,18,2);rect(c,'#318495',x+6,y+4+rise,14,2);}
 const jet=waterJet(s);if(jet.strength>.02){const end=waterSheltered(s)?s.heroes[2].y-36:1000;c.save();c.globalAlpha=jet.strength;rect(c,'#5cc7d538',jet.x+10,444,36,end-444);for(let k=0;k<18;k++){const yy=444+((s.time*300+k*41)%Math.max(1,end-444));rect(c,'#87dcda',jet.x+8+(k%3)*12,yy,4,Math.max(2,Math.min(10,end-yy))); }c.restore();}
 for(const h of s.heroes){if(!h.underwater&&!h.inAirPocket)continue;const air=Math.ceil(h.air/2);for(let n=0;n<6;n++)rect(c,n<air?'#a6ecdf':'#40545c',h.x-18+n*6,h.y-46,4,4);}
}
