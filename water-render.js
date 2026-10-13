import {drawCycleGateField} from './cycle-gate.js?v=gate61';
import {createAtlas} from './sprite-atlas.js?v=fan66';
import {drawWaterTerrain,waterTerrainReady} from './water-terrain92.js?v=water92';
import {drawWaterEffects,drawWaterPlants,waterDecorReady} from './water-effects92.js?v=water92';
import {drawConnection,connectionsReady} from './connection-render.js?v=connections53';
import {snapPixel} from './pixel-grid.js?v=arc46';
import {waterAirPockets,waterJet,waterSheltered,waterBanks} from './water-campaign.js?v=water83';
import {waterCompressorHose} from './water-connections.js?v=water92';
import {WATER92,water92GroundPlacement,water92Port,drawWater92Pontoon,drawWater92Bell,drawWater92Crank,drawWater92Valve,drawWater92Sluice,drawWater92Gate,drawWater92Nozzle,drawWater92NozzleLip,water92NozzlePlacement,drawWater92Cradle,water92Ready} from './water-art92.js?v=water92';
const exitAtlas=createAtlas('assets/gate61/gate.png',1,1);
const scene=new Image(),ladder=new Image();scene.src='assets/water92/scene-native.png';ladder.src='assets/platform56/ladder.png';
const rect=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(snapPixel(x),snapPixel(y),snapPixel(w),snapPixel(h));};
function ladderDraw(c,l){if(!ladder.naturalWidth)return;for(let y=l.top;y<l.bottom;y+=26){const h=Math.min(26,l.bottom-y);c.drawImage(ladder,0,0,24,h/2,l.x-24,y,48,h);}}
export function drawWaterWorld(c,s,camera,viewport){
 const g=s.machine,f=g.float,placements=[];
 rect(c,'#0a1b28',camera.x,camera.y,viewport.width,viewport.height);
 // Preserve the scene's actual authored density. Its foundation stays beneath the basin floor.
 if(scene.naturalWidth){const w=scene.naturalWidth*2,h=scene.naturalHeight*2,x=snapPixel(camera.x*.78),y=snapPixel(1120-h+camera.y*.12);c.drawImage(scene,x,y,w,h);}
 // The overhead intake has a complete pipe route, not a floating emitter.
 const intake=water92NozzlePlacement(710,444).inlet;
 drawConnection(c,[[240,160],[intake.x,160],[intake.x,intake.y]],'pipe');
 const valvePlacement=water92GroundPlacement(1100,900),valveInlet=water92Port(valvePlacement,WATER92.valve.inlet);
 drawConnection(c,[[valveInlet.x,valveInlet.y],[valveInlet.x,680],[804,680],[804,intake.y],[intake.x,intake.y]],'pipe');
 drawConnection(c,[[1732,976],[1810,976]],'cable');
 const nozzle=drawWater92Nozzle(c,710,444);
 // Supports continue to a real lower surface.
 for(const p of s.level.platforms)for(const x of [p.x+4,p.x+p.w-28])drawWaterTerrain(c,x,p.y+20,24,1000-p.y-20);
 // The water ends against actual retaining masonry, never an exposed plane edge.
 for(const bank of waterBanks())drawWaterTerrain(c,bank.x,bank.top,bank.w,bank.bottom-bank.top);
 for(const p of s.level.floors)drawWaterTerrain(c,p.x,p.y,p.w,p.y===1000?120:20);
 for(const p of s.level.platforms)drawWaterTerrain(c,p.x,p.y,p.w,20);
 drawWaterPlants(c,s);
 for(const l of s.level.ladders)ladderDraw(c,l);
 // A retracting segmented service gate preserves the collision boundary throughout motion.
 const bottom=850-400*g.valvePose;
 drawWater92Gate(c,774,120,bottom);
 // Hose attaches to the compressor's outlet and the bell's crown as the surface descends.
 const pontoonPlacement={x:snapPixel(f.x-96),y:snapPixel(f.y-WATER92.pontoon.deckY*2)},outlet=water92Port(pontoonPlacement,WATER92.pontoon.outlet),bellCrown=water92Port({x:snapPixel(f.x-96),y:820},WATER92.mobileBell.crown);
 drawConnection(c,waterCompressorHose(outlet,bellCrown),'cable',{time:s.time,phase:2});
 // A separate native flexible tow line terminates at the bell's left skid.
 const tow=water92Port(pontoonPlacement,WATER92.pontoon.tow);if(984-tow.y>=32)drawConnection(c,[[tow.x,tow.y],[tow.x-40,tow.y],[tow.x-40,984],[f.x-70,984]],'cable',{time:s.time*.25,phase:0});
 const cradle=drawWater92Cradle(c,f.x,1000);placements.push(cradle,drawWater92Bell(c,940,900),drawWater92Bell(c,f.x,1000,true));
 const pontoon=drawWater92Pontoon(c,f.x,f.y),valve=drawWater92Valve(c,1100,900,g.valvePose),crank=drawWater92Crank(c,1660,1000,{...g,time:s.time}),sluice=drawWater92Sluice(c,1900,1000,g.drainPose);
 placements.push(pontoon,valve,crank,sluice);
 // Portal is powered by the receding water, with a moving interior and fixed grounded pedestal.
 const pose={x:2236,y:412,w:128,h:128},place=exitAtlas.placement(0,pose,[{x:2100,y:540,w:300}]);if(place){drawCycleGateField(c,{...place,active:s.power,glow:.8,frame:Math.floor(s.time*12),aperture:{x:place.x+64,y:place.y+74,w:40,h:80}});exitAtlas.drawGrounded(c,0,pose,[{x:2100,y:540,w:300}]);placements.push({cell:'portal',x:2300,visibleBottom:place.visibleBottom,floorY:540});}
 return {ready:!!(water92Ready()&&waterTerrainReady()&&waterDecorReady()&&scene.naturalWidth&&ladder.naturalWidth&&exitAtlas.image.naturalWidth&&connectionsReady()),waterY:g.waterY,jet:waterJet(s),sheltered:waterSheltered(s),placements,cradle,crank,sluice,valve,pontoon,nozzle,airPockets:waterAirPockets(s),floatDeck:f.y,gateBottom:bottom,sourceDensity:'generated96px native devices and128px cradle; two world units per source pixel'};
}
export function drawWaterOverlay(c,s){drawWaterEffects(c,s);if(s.level.mechanic==='water')drawWater92NozzleLip(c,710,444);}
