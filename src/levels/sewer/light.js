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
export function sewerLights(s){const g=s.machine,out=g.lamps.filter(a=>a.lit).map(a=>({...a,radius:215,focused:false,face:1}));if(g.introTime<2.8)out.push({x:230,y:390,radius:300,focused:false,face:1,tavern:true,intensity:Math.min(1,(2.8-g.introTime)/1.2)});if(!g.lamp.lit)return out;let point,origin;if(g.lamp.hookId)point=g.hooks.find(a=>a.id===g.lamp.hookId);else {const h=s.heroes.find(a=>a.inventory.includes('inspectionLamp'));if(h){point={x:h.x+h.face*22,y:h.y+8,face:h.face};origin={x:h.x,y:h.y+8};}else{const a=s.items.find(a=>a.type==='inspectionLamp');if(a)point={x:a.x,y:a.y+32,face:1};}}if(point)point=sewerLampPoint(s,point,origin);if(point){out.push({...point,radius:g.lamp.focused?580:205,focused:g.lamp.focused,portable:true});if(g.lamp.focused)out.push({...point,radius:80,focused:false,spill:true,intensity:.65});}return out;}
export function sewerLightAt(s,x,y){let value=0;const walls=sewerOccluders(s);for(const l of sewerLights(s)){const dx=x-l.x,dy=y-l.y,d=Math.hypot(dx,dy);if(d>=l.radius)continue;if(l.focused&&dx*l.face<0)continue;if(l.focused&&Math.abs(dy)>Math.abs(dx)*.36+14)continue;if(walls.some(a=>{const hit=lightWallHit(l.x,l.y,x,y,a);return hit&&hit.t<1-1e-7;}))continue;value=Math.max(value,Math.min(1,(1-d/l.radius)*1.8)*(l.intensity??1));}return value;}

// Illuminate an opaque device's visible face from the immediately adjacent air.
// This never removes its shadow or samples light through its solid interior.
export function sewerFaceLight(s,solid,y){return Math.max(sewerLightAt(s,solid.x-2,y),sewerLightAt(s,solid.x+solid.w+2,y));}
