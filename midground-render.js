import {middleLayout} from './midground-layout.js?v=scale50';
const images=new Map();
export function drawMiddleScenery(ctx,round,camera,view){
 if(!images.has(round)){const im=new Image();im.src='assets/scale50/middle-'+round+'.png?v=scale50';images.set(round,im);}
 const image=images.get(round),ready=!!(image.complete&&image.naturalWidth),pieces=middleLayout(round,camera,view);
 if(ready){ctx.save();ctx.globalAlpha=1;ctx.imageSmoothingEnabled=false;for(const p of pieces)ctx.drawImage(image,p.x,p.y,p.w,p.h);ctx.restore();}
 return {ready,source:image.src,anchor:round===5?'ceiling':'floor',pieces};
}
