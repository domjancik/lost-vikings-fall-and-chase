import {lightWallHit} from './optics.js?v=sewer132';
import {snapPixel} from '../../render/pixel-grid.js';
import {segmentHit} from '../../core/projectile-collision.js';
export const SEWER_HATCH_TRAVEL=200,SEWER_LANDING_TRAVEL=100;
// These are physical foreground volumes shared by lighting and movement.
// Decorative rear masonry and its mounted fixtures never occlude the walkable plane.
export function sewerOccluders(s){const g=s.machine,l=s.level.layout,top=s.level.worldTop;return [
 ...l.solids.map(a=>({...a,y:top,h:a.y+a.h-top,kind:'ceiling'})),
 ...s.level.platforms.map(a=>({...a,h:24,kind:'platform'})),
 {x:2160,y:760-SEWER_LANDING_TRAVEL*g.rope.pose,w:160,h:20,kind:'landing'},
 {x:0,y:760,w:2700,h:120,kind:'floor'},{x:2700,y:800,w:160,h:80,kind:'floor'},
 {x:1180,y:580-190*g.valve.pose,w:32,h:180,kind:'shutter'},
 {x:2020,y:600-SEWER_HATCH_TRAVEL*g.hatch.pose,w:40,h:160,kind:'shutter'},
 ...g.gates.map(a=>({x:a.x,y:a.y-a.h*a.pose,w:a.w,h:a.h,kind:'shutter'}))
 ];}
// Lantern opaque bounds relative to its wick: x±12, y-34..+12.
// Sweep that housing too, so the rendered lamp and emitter stop together.
export function sewerLampPoint(s,point,origin=point){
 const walls=sewerOccluders(s);if(walls.some(a=>origin.x>a.x&&origin.x<a.x+a.w&&origin.y>a.y&&origin.y<a.y+a.h))return null;
 const dx=point.x-origin.x,dy=point.y-origin.y,length=Math.hypot(dx,dy);let t=1;
 if(length)for(const a of walls){const hit=segmentHit(origin.x,origin.y,point.x,point.y,{x:a.x-14,y:a.y-14,w:a.w+28,h:a.h+50});if(hit)t=Math.min(t,Math.max(0,hit.t-2/length));}
 const result={...point,x:snapPixel(origin.x+dx*t),y:snapPixel(origin.y+dy*t)};
 if(walls.some(a=>result.x>=a.x&&result.x<=a.x+a.w&&result.y>=a.y&&result.y<=a.y+a.h))return null;
 return result;
}
// One deterministic flame sample drives the rendered wick, mask and gameplay.
// Housing anchors stay rigid. Only the burning wick shifts by one native pixel.
function fireLight(s,point,key,walls,baseIntensity=1){
 let seed=0;for(const c of key)seed=(seed*31+c.charCodeAt(0))%997;
 const phase=seed*.071,t=s.time||0;
 const flicker=.94+.025*Math.sin(t*8.1+phase)+.018*Math.sin(t*13.7+phase*1.7)+.012*Math.sin(t*3.3+phase*.6);
 const dx=snapPixel(1.2*(Math.sin(t*3.1+phase)-Math.sin(phase)));
 const dy=snapPixel(1.2*(Math.sin(t*4.7+phase*.7)-Math.sin(phase*.7)));
 const housingX=point.x,housingY=point.y;
 let x=snapPixel(housingX+dx),y=snapPixel(housingY+dy);
 // A fluttering flame cannot cross the wall its rigid lantern already stopped at.
 if((dx||dy)&&walls.some(a=>{const hit=lightWallHit(housingX,housingY,x,y,a);return hit&&hit.t<1;})){x=housingX;y=housingY;}
 return {...point,x,y,housingX,housingY,intensity:baseIntensity*flicker,
  aimSlope:.009*(Math.sin(t*2.8+phase)-Math.sin(phase))};
}
// Shared trapezoid: renderer clips precisely the same swaying cone used by AI.
export function sewerLightCone(l){const endX=l.x+l.face*l.radius,endY=l.y+l.face*l.radius*(l.aimSlope||0),spread=l.radius*.36+14;return [{x:l.x,y:l.y-14},{x:endX,y:endY-spread},{x:endX,y:endY+spread},{x:l.x,y:l.y+14}];}
export function sewerLights(s){
 const g=s.machine,walls=sewerOccluders(s),out=g.lamps.filter(a=>a.lit).map(a=>fireLight(s,{...a,radius:215,focused:false,face:1},a.id,walls));
 if(g.introTime<2.8)out.push(fireLight(s,{x:230,y:390,radius:300,focused:false,face:1,tavern:true},'tavern',walls,Math.min(1,(2.8-g.introTime)/1.2)));
 if(!g.lamp.lit)return out;
 let point,origin;
 if(g.lamp.hookId)point=g.hooks.find(a=>a.id===g.lamp.hookId);
 else {
  const h=s.heroes.find(a=>a.inventory.includes('inspectionLamp'));
  if(h){point={x:h.x+h.face*22,y:h.y+8,face:h.face};origin={x:h.x,y:h.y+8};}
  else{const a=s.items.find(a=>a.type==='inspectionLamp');if(a)point={x:a.x,y:a.y+32,face:1};}
 }
 if(point)point=sewerLampPoint(s,point,origin);
 if(point){
  const flame=fireLight(s,point,'inspection-lamp',walls);
  out.push({...flame,radius:g.lamp.focused?580:205,focused:g.lamp.focused,portable:true});
  if(g.lamp.focused)out.push({...flame,radius:80,focused:false,spill:true,intensity:flame.intensity*.65});
 }
 return out;
}
export function sewerLightAt(s,x,y){let value=0;const walls=sewerOccluders(s);for(const l of sewerLights(s)){const dx=x-l.x,dy=y-l.y,d=Math.hypot(dx,dy);if(d>=l.radius)continue;if(l.focused&&dx*l.face<0)continue;if(l.focused&&Math.abs(dy-dx*(l.aimSlope||0))>Math.abs(dx)*.36+14)continue;if(walls.some(a=>{const hit=lightWallHit(l.x,l.y,x,y,a);return hit&&hit.t<1-1e-7;}))continue;value=Math.max(value,Math.min(1,(1-d/l.radius)*1.8)*(l.intensity??1));}return value;}

// Illuminate an opaque device's visible face from the immediately adjacent air.
// This never removes its shadow or samples light through its solid interior.
export function sewerFaceLight(s,solid,y){return Math.max(sewerLightAt(s,solid.x-2,y),sewerLightAt(s,solid.x+solid.w+2,y));}
