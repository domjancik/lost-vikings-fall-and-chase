import {snapPixel} from './pixel-grid.js?v=arc46';

// World-space coordinates: subtracting the camera leaves only slow depth travel.
// Spend existing image overscan, preserving the art's scale and aspect ratio.
export function farSceneY(cameraY,viewHeight,imageHeight,worldTop=0,worldBottom=790){
 const overflow=Math.max(0,imageHeight-viewHeight),maxCamera=Math.max(worldTop,worldBottom-viewHeight);
 const travel=maxCamera-worldTop,speed=travel?Math.min(.18,overflow*.8/travel):.18;
 const screen=-overflow*.8+(maxCamera-cameraY)*speed;
 const y=snapPixel(cameraY+Math.max(-overflow,Math.min(0,screen)));
 return {y,verticalSpeed:speed};
}

// Whole puzzle backdrops extend beneath the foreground floor as the view descends.
export function backdropY(cameraY,anchorY,speed=.22){
 return snapPixel(anchorY+Math.max(0,cameraY)*(1-speed));
}
