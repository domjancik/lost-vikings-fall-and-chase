import {cycleFanConnections} from './cycle-fan-connections.js?v=fan66';
import {backdropY} from './vertical-parallax.js?v=vertical65';
import {cycleGatePose,drawCycleGateField} from './cycle-gate.js?v=gate61';
import {drawRefractionWorld} from './refraction-render.js?v=vertical65';
import {cycleRailStatus,railSignals} from './cycle-rail.js?v=rail60';
import {createAtlas} from './sprite-atlas.js?v=fan66';
import {drawTerrain} from './terrain-render.js?v=terrain48';
import {snapPixel} from './pixel-grid.js?v=arc46';
import {drawConnection,drawConnectionTile,connectionsReady} from './connection-render.js?v=connections53';
const atlas=createAtlas('assets/cycle52/machines.png',4,4),fan=createAtlas('assets/cycle52/fan.png',4,1),gate=createAtlas('assets/gate61/gate.png',1,1);
const load=name=>{const i=new Image();i.src='assets/cycle52/'+name+'.png';return i;};
const scene=load('scene'),ladder=new Image(),carrier=load('carrier');
ladder.src='assets/platform56/ladder.png';
export function drawCycleWorld(ctx,s,camera,viewport,text=()=>{}){
 if(s.level.mechanic==='refraction')return drawRefractionWorld(ctx,s,camera,viewport);
 const g=s.machine,c=g.carrier,box=(color,x,y,w,h)=>{ctx.fillStyle=color;ctx.fillRect(snapPixel(x),snapPixel(y),snapPixel(w),snapPixel(h));};
 box('#172f3a',camera.x,camera.y,viewport.width,viewport.height);
 if(scene.complete&&scene.naturalWidth){const w=scene.naturalWidth*2,h=scene.naturalHeight*2,offset=snapPixel(camera.x*.75);for(let x=offset-w;x<camera.x+viewport.width;x+=w)ctx.drawImage(scene,x,backdropY(camera.y,1120-h),w,h);}
 // Structural piers meet a lower deck or the recovery floor, never thin air.
 for(const p of s.level.platforms){const base=s.level.floors.filter(f=>f.y>p.y&&p.x+20>=f.x&&p.x+20<=f.x+f.w).sort((a,b)=>a.y-b.y)[0]?.y??1120;for(const x of [p.x+16,p.x+p.w-32]){box('#263f48',x,p.y+24,16,base-p.y-24);box('#77938c',x,p.y+24,4,base-p.y-24);}}
 // Authored structural rails form a physical loop, with explicit junctions.
 const rail=cycleRailStatus(g);ctx.save();ctx.filter='brightness(.4)';
 drawConnection(ctx,[[850,302],[2210,302],[2210,982],[850,982],[850,302]],'rail');
 drawConnection(ctx,[[850,542],[2210,542]],'rail');
 drawConnectionTile(ctx,28,850,542,3);drawConnectionTile(ctx,28,2210,542,1);ctx.restore();
 ctx.save();ctx.filter='brightness(1.7)';drawConnection(ctx,rail.points,'rail');ctx.restore();
 // Inlaid signal chevrons indicate both the live circuit and travel direction.
 const signals=railSignals(rail.points,s.time,g.released);for(const p of signals){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation*Math.PI/2);for(const [color,offset]of [['#133331',2],['#b6fff0',0]]){ctx.fillStyle=color;for(let n=0;n<4;n++){ctx.fillRect(-6+n*2+offset,-6+n*2+offset,4,2);ctx.fillRect(-6+n*2+offset,6-n*2+offset,4,2);}}ctx.restore();}
 for(const p of s.level.floors)drawTerrain(ctx,{round:5,campaign:'story'},p.x,p.y,p.w,p.y===1120?80:64);
 for(const p of s.level.platforms)drawTerrain(ctx,{round:5,campaign:'story'},p.x,p.y,p.w,28);
 if(ladder.complete&&ladder.naturalWidth)for(let y=500;y<1120;y+=26){const h=Math.min(26,1120-y);ctx.drawImage(ladder,0,0,24,h/2,626,y,48,h);}
 atlas.draw(ctx,g.released?11:10,418,876,64,64);
 if(g.cutAt>=0&&s.time-g.cutAt<.4){const t=s.time-g.cutAt;box('#d7b37a',450-t*100,894+t*40,12,4);box('#d7b37a',450+t*100,894+t*40,12,4);}
 atlas.draw(ctx,12+Math.min(2,Math.floor(g.brakePose*2.99)),1038,326,64,64);
 // Flanged air duct and flexible brake control terminate on actual housings.
 const fanFrame=g.released?Math.floor(s.time*9)%4:0,fanRect={x:1296,y:812,w:128,h:128},fanSurfaces=[...s.level.floors,...s.level.platforms];
 const fanContact=fan.placement(fanFrame,fanRect,fanSurfaces),fanRoutes=fanContact?cycleFanConnections(fanContact):null;
 const duct=fanRoutes?drawConnection(ctx,fanRoutes.duct,'pipe'):{anchors:[]};
 const brakeCable=fanRoutes?drawConnection(ctx,fanRoutes.cable,'cable',{time:s.time,phase:0}):{anchors:[]};
 const selectorCable=drawConnection(ctx,[[1632,232],[1744,232],[1744,128],[816,128],[816,542],[850,542]],'cable',{time:s.time,phase:2});
 // The selector operates the actual low/high branch, not a random track point.
 drawConnectionTile(ctx,c.high===260?31:30,850,542,1);
 drawConnectionTile(ctx,g.brakePose<.5?30:31,1134,364);
 // The hinge lens stays exposed at the actual projectile collision position.
 atlas.draw(ctx,4+Math.min(3,Math.floor(g.damper*3.99)),1268,456,64,64);
 fan.drawGrounded(ctx,fanFrame,fanRect,fanSurfaces);
 const draft=g.brakePose===1&&g.damper===1;
 if(draft)for(let n=0;n<18;n++){const y=940-((s.time*180+n*43)%680),x=1298+(n*26)%128;box('#a0e5e5',x,y,2,12);}
 atlas.draw(ctx,12+Math.min(2,Math.floor(g.selectorPose*2.99)),1568,196,64,64);
 box(rail.queued?'#e9b66b':'#b6fff0',1554,260,8,12);
 text(rail.queued?rail.requested.toUpperCase()+' QUEUED':rail.active.toUpperCase()+' ACTIVE',1600,150,rail.queued?'#e9b66b':'#b6fff0',11);
 // Native row2 is the rear railing; row8 is the actual walking deck.
 if(carrier.complete&&carrier.naturalWidth)ctx.drawImage(carrier,snapPixel(c.x),snapPixel(c.y)-16,160,64);
 const gatePose=cycleGatePose(g,s.time);drawCycleGateField(ctx,gatePose);ctx.save();if(gatePose.active){ctx.shadowColor='#78ffe0';ctx.shadowBlur=6*gatePose.glow;}const gateContact=gate.drawGrounded(ctx,0,gatePose,[...s.level.platforms,...s.level.floors]);ctx.restore();
 return {ready:connectionsReady()&&[scene,ladder,carrier,atlas.image,fan.image,gate.image].every(i=>i.complete&&i.naturalWidth),nativeScene:[scene.naturalWidth,scene.naturalHeight],gate:{...gatePose,ready:!!gateContact,bottom:gateContact?.visibleBottom,gap:gateContact?gateContact.surface.y-gateContact.visibleBottom:null},rail:{...rail,signals},fan:fanContact?{frame:fanFrame,y:fanContact.y,bottom:fanContact.visibleBottom,surfaceY:fanContact.surface.y,gap:fanContact.surface.y-fanContact.visibleBottom}:null,carrier:{x:snapPixel(c.x),y:snapPixel(c.y)},draft,connections:{ready:connectionsReady(),frame:Math.floor(s.time*5)%4,brake:brakeCable.anchors,duct:duct.anchors,selector:selectorCable.anchors}};
}
