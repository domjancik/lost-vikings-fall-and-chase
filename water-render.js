import {drawCycleGateField} from './cycle-gate.js?v=gate61';
import {createAtlas} from './sprite-atlas.js?v=fan66';
import {drawTerrain} from './terrain-render.js?v=terrain48';
import {drawConnection,connectionsReady} from './connection-render.js?v=connections53';
import {snapPixel} from './pixel-grid.js?v=arc46';
import {waterAirPockets,waterJet,waterSheltered,waterBanks} from './water-campaign.js?v=water83';
import {waterCompressorHose} from './water-connections.js?v=water87';
import {WATER87,water87GroundPlacement,water87Port,drawWater87Pontoon,drawWater87Bell,drawWater87Crank,drawWater87Valve,drawWater87Sluice,drawWater87Gate,drawWater87Nozzle,drawWater87Cradle,water87Ready} from './water-art87.js?v=water87';
const exitAtlas=createAtlas('assets/gate61/gate.png',1,1);
const scene=new Image(),ladder=new Image();scene.src='assets/water83/scene-raw.png';ladder.src='assets/platform56/ladder.png';
const rect=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(snapPixel(x),snapPixel(y),snapPixel(w),snapPixel(h));};
function ladderDraw(c,l){if(!ladder.naturalWidth)return;for(let y=l.top;y<l.bottom;y+=26){const h=Math.min(26,l.bottom-y);c.drawImage(ladder,0,0,24,h/2,l.x-24,y,48,h);}}
export function drawWaterWorld(c,s,camera,viewport){
 const g=s.machine,f=g.float,placements=[];
 rect(c,'#0a1b28',camera.x,camera.y,viewport.width,viewport.height);
 // Preserve the scene's actual authored density. Its foundation stays beneath the basin floor.
 if(scene.naturalWidth){const w=scene.naturalWidth*2,h=scene.naturalHeight*2,x=snapPixel((2400-w)/2+camera.x*.78),y=snapPixel(1120-h+camera.y*.12);c.drawImage(scene,x,y,w,h);}
 // The overhead intake has a complete pipe route, not a floating emitter.
 drawConnection(c,[[240,160],[710,160],[710,320]],'pipe');
 const valvePlacement=water87GroundPlacement(1100,900),valveInlet=water87Port(valvePlacement,WATER87.valve.inlet);
 drawConnection(c,[[valveInlet.x,valveInlet.y],[valveInlet.x,680],[804,680],[804,320],[710,320]],'pipe');
 drawConnection(c,[[1732,976],[1810,976]],'cable');
 const nozzle=drawWater87Nozzle(c,710,444);
 // Supports continue to a real lower surface.
 for(const p of s.level.platforms)for(const x of [p.x+8,p.x+p.w-20]){rect(c,'#405459',x,p.y+20,12,1000-p.y-20);rect(c,'#9ba998',x,p.y+20,2,1000-p.y-20);}
 // The water ends against actual retaining masonry, never an exposed plane edge.
 for(const bank of waterBanks())drawTerrain(c,{round:5,campaign:'story'},bank.x,bank.top,bank.w,bank.bottom-bank.top);
 for(const p of s.level.floors)drawTerrain(c,{round:5,campaign:'story'},p.x,p.y,p.w,p.y===1000?120:20);
 for(const p of s.level.platforms)drawTerrain(c,{round:5,campaign:'story'},p.x,p.y,p.w,20);
 for(const l of s.level.ladders)ladderDraw(c,l);
 // A retracting segmented service gate preserves the collision boundary throughout motion.
 const bottom=850-400*g.valvePose;
 drawWater87Gate(c,774,120,bottom);
 // Hose attaches to the compressor's outlet and the bell's crown as the surface descends.
 const pontoonPlacement={x:snapPixel(f.x-96),y:snapPixel(f.y-WATER87.pontoon.deckY*2)},outlet=water87Port(pontoonPlacement,WATER87.pontoon.outlet),bellCrown=water87Port({x:snapPixel(f.x-96),y:820},WATER87.mobileBell.crown);
 drawConnection(c,waterCompressorHose(outlet,bellCrown),'cable',{time:s.time,phase:2});
 // A separate native flexible tow line terminates at the bell's left skid.
 const tow=water87Port(pontoonPlacement,WATER87.pontoon.tow);if(984-tow.y>=32)drawConnection(c,[[tow.x,tow.y],[tow.x-40,tow.y],[tow.x-40,984],[f.x-70,984]],'cable',{time:s.time*.25,phase:0});
 const cradle=drawWater87Cradle(c,f.x,1000);placements.push(cradle,drawWater87Bell(c,940,900),drawWater87Bell(c,f.x,1000,true));
 const pontoon=drawWater87Pontoon(c,f.x,f.y),valve=drawWater87Valve(c,1100,900,g.valvePose),crank=drawWater87Crank(c,1660,1000,{...g,time:s.time}),sluice=drawWater87Sluice(c,1900,1000,g.drainPose);
 placements.push(pontoon,valve,crank,sluice);
 // Portal is powered by the receding water, with a moving interior and fixed grounded pedestal.
 const pose={x:2236,y:412,w:128,h:128},place=exitAtlas.placement(0,pose,[{x:2100,y:540,w:300}]);if(place){drawCycleGateField(c,{...place,active:s.power,glow:.8,frame:Math.floor(s.time*12),aperture:{x:place.x+64,y:place.y+74,w:40,h:80}});exitAtlas.drawGrounded(c,0,pose,[{x:2100,y:540,w:300}]);placements.push({cell:'portal',x:2300,visibleBottom:place.visibleBottom,floorY:540});}
 return {ready:!!(water87Ready()&&scene.naturalWidth&&ladder.naturalWidth&&exitAtlas.image.naturalWidth&&connectionsReady()),waterY:g.waterY,jet:waterJet(s),sheltered:waterSheltered(s),placements,cradle,crank,sluice,valve,pontoon,nozzle,airPockets:waterAirPockets(s),floatDeck:f.y,gateBottom:bottom,sourceDensity:'generated96px native devices and128px cradle; two world units per source pixel'};
}
export function drawWaterOverlay(c,s){
 if(s.level.mechanic!=='water')return;
 const y=snapPixel(s.machine.waterY),pockets=waterAirPockets(s);
 c.save();c.beginPath();c.rect(320,y,1780,1000-y);
 for(const p of pockets)c.rect(p.x,p.y,p.w,p.h);
 c.clip('evenodd');rect(c,'#195f7940',320,y,1780,1000-y);c.restore();
 for(let x=320;x<2100;x+=26){const rise=Math.floor(Math.sin(x*.02+s.time*2)*2)*2;rect(c,'#78c5c9',x,y+rise,18,2);rect(c,'#318495',x+6,y+4+rise,14,2);}
 const jet=waterJet(s);if(jet.strength>.02){const end=waterSheltered(s)?s.heroes[2].y-36:1000;c.save();c.globalAlpha=jet.strength;rect(c,'#5cc7d538',jet.x+10,444,36,end-444);for(let k=0;k<18;k++){const yy=444+((s.time*300+k*41)%Math.max(1,end-444));rect(c,'#87dcda',jet.x+8+(k%3)*12,yy,4,Math.max(2,Math.min(10,end-yy))); }c.restore();}
 for(const h of s.heroes){if(!h.underwater&&!h.inAirPocket)continue;const air=Math.ceil(h.air/2);for(let n=0;n<6;n++)rect(c,n<air?'#a6ecdf':'#40545c',h.x-18+n*6,h.y-46,4,4);}
}


