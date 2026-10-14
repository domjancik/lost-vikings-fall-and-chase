import {snapPixel,snapAngle} from '../render/pixel-grid.js?v=arc46';
export const SHIELD={width:28,height:48,upTop:-36,upWidth:48};
export function shieldTransform(h,pose,frame){
 if(pose==='climb'&&!h.shieldUp)return {width:SHIELD.width,height:SHIELD.height,x:0,y:12,angle:0};
 const transition=pose==='shield-raise'||pose==='shield-lower';
 const t=transition?Math.max(0,Math.min(1,h.shieldPose===undefined?frame/6:(h.shieldPose-.4)/.6)):h.shieldUp||pose==='float'?1:0;
 // Riders stand through the middle of the overhead shield, as on a deck.
 return {width:SHIELD.width,height:SHIELD.height,x:snapPixel(28*(1-t)),y:snapPixel(20+(SHIELD.upTop-20)*t),angle:snapAngle(-Math.PI/2*t)};
}
