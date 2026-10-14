import {middleLayout} from './midground-layout.js?v=ground51';
import {foundationOffset} from '../campaigns/story/story-visuals.js?v=ground51';
const images=new Map();
const foundations=new Map([[0,4]]);
export function drawMiddleScenery(ctx,round,camera,view){
 if(!images.has(round)){const im=new Image();im.onload=()=>{if(round===5||typeof document==='undefined')return;const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);foundations.set(round,foundationOffset(g.getImageData(0,0,c.width,c.height).data,c.width,c.height));};im.src='assets/scale67/middle-'+round+'.png?v=edge67';images.set(round,im);}
 const image=images.get(round),ready=!!(image.complete&&image.naturalWidth),pieces=middleLayout(round,camera,view,foundations.get(round)||0);
 if(ready){ctx.save();ctx.globalAlpha=1;ctx.imageSmoothingEnabled=false;for(const p of pieces)ctx.drawImage(image,p.x,p.y,p.w,p.h);ctx.restore();}
 return {ready,source:image.src,anchor:round===5?'ceiling':'floor',foundation:foundations.get(round)||0,contact:round===5?-100:612,pieces};
}
