export const WORLD_PIXEL=2;
export const rasterSize=(width,height)=>({width:Math.ceil(width/WORLD_PIXEL),height:Math.ceil(height/WORLD_PIXEL)});
export const snapPixel=value=>Math.round(value/WORLD_PIXEL)*WORLD_PIXEL;
export const ANGLE_STEP=Math.PI/36;
export const snapAngle=value=>Math.round(value/ANGLE_STEP)*ANGLE_STEP;
export const animationTime=time=>Math.floor(time*12+1e-8)/12;
export const spritePose=(x,y,w,h,angle=0)=>({x:snapPixel(x),y:snapPixel(y),w:Math.max(WORLD_PIXEL,snapPixel(w)),h:Math.max(WORLD_PIXEL,snapPixel(h)),angle:snapAngle(angle)});
