import {snapPixel} from './pixel-grid.js?v=far45';
// Fit distant scenery in screen space so gameplay zoom does not zoom the sky.
export function storyFarLayout(camera,view){
 const size=snapPixel(Math.max(view.width,view.height)*1.08),margin=(size-view.height)/2;
 const anchor=snapPixel(camera.x+(view.width-size)/2-camera.x*.16);
 const low=Math.ceil((camera.y+view.height-size)/2)*2,high=Math.floor(camera.y/2)*2;
 const y=Math.max(low,Math.min(high,snapPixel(camera.y-margin-camera.y*.08)));
 const first=anchor+Math.floor((camera.x-anchor)/size)*size,tiles=[];
 for(let x=first;x<camera.x+view.width;x+=size)tiles.push(x);
 return {size,y,anchor,tiles,speed:.16,verticalSpeed:.08};
}
