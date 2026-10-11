import {snapPixel} from './pixel-grid.js?v=mid49';
export function middleLayout(round,camera,view){
 const w=768,h=512,shift=snapPixel(camera.x*.55),y=round===5?-100:610-h;
 const first=Math.floor((camera.x-shift)/w),last=Math.floor((camera.x+view.width-shift)/w);
 return Array.from({length:last-first+1},(_,n)=>({x:(first+n)*w+shift,y,w,h}));
}
