import {snapPixel} from './pixel-grid.js?v=mid49';
export function middleLayout(round,camera,view,foundation=round===0?4:0){
 const w=round===7?576:384,h=w*2/3,shift=snapPixel(camera.x*.55),y=round===5?-100:610-h+foundation+2;
 const first=Math.floor((camera.x-shift)/w),last=Math.floor((camera.x+view.width-shift)/w);
 return Array.from({length:last-first+1},(_,n)=>({x:(first+n)*w+shift,y,w,h}));
}
