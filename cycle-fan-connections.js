import {snapPixel} from './pixel-grid.js?v=arc46';

export function cycleFanConnections(housing){
 // Ports measured on the authored64px fan: left rim(8,31), top rim(32,6).
 const left=[snapPixel(housing.x+housing.w*8/64),snapPixel(housing.y+housing.h*31/64)];
 const top=[snapPixel(housing.x+housing.w/2),snapPixel(housing.y+housing.h*6/64)];
 return {cable:[[1094,364],[1200,364],[1200,left[1]],left],
  duct:[[1300,518],[1300,top[1]-64],[top[0],top[1]-64],top]};
}
