import {snapPixel,snapAngle} from './pixel-grid.js?v=arc46';
export const SHIELD={width:28,height:48,upTop:-36,upWidth:48};
export function shieldTransform(h,pose,frame){
 const transition=pose==='shield-raise'||pose==='shield-lower';
 const t=transition?Math.max(0,Math.min(1,(frame/6-.4)/.6)):h.shieldUp||pose==='float'?1:0;
 return {width:SHIELD.width,height:SHIELD.height,x:snapPixel(28*(1-t)),y:snapPixel(20-42*t),angle:snapAngle(-Math.PI/2*t)};
}
