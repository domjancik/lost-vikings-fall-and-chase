import {transitionPose,transitionHeroPose,distortionBands} from './level-transition.js?v=alehall135';
import {drawTransit,drawPortal} from './portal-effects.js?v=transitions126';
import {drawWaterTransit} from '../levels/sewer/water-transit.js?v=sewer150';
let scratch;

export function drawTransitionWarp(ctx,source,method,phase,elapsed,anchor){
 const bands=distortionBands(method.kind,phase,elapsed,source.width,source.height,anchor);
 if(!bands.length)return{bands:0,readbacks:0};
 const left=Math.min(...bands.map(b=>b.sx)),top=Math.min(...bands.map(b=>b.sy));
 const width=Math.max(...bands.map(b=>b.sx+b.w))-left,height=Math.max(...bands.map(b=>b.sy+b.h))-top;
 scratch??=document.createElement('canvas');if(scratch.width!==width||scratch.height!==height){scratch.width=width;scratch.height=height;}
 const g=scratch.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,width,height);g.drawImage(source,left,top,width,height,0,0,width,height);
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;
 for(const b of bands)ctx.drawImage(scratch,b.sx-left,b.sy-top,b.w,b.h,b.dx,b.dy,b.w,b.h);
 ctx.restore();return{bands:bands.length,copy:[width,height],readbacks:0};
}
function actors(ctx,method,phase,time,anchor,heroes,drawHero){
 for(const h of heroes){const p=transitionHeroPose(method.kind,phase,time,h,anchor);if(!p||p.alpha<=0)continue;
  const gait=method.kind==='door'?{ground:true,climbing:false,face:1,vx:90,vy:0,walk:time*10,animTime:time}:{};
  ctx.save();ctx.globalAlpha=p.alpha;drawHero(ctx,{...h,...gait,entryTilt:p.rotation||0},p.x,p.y,p.scale);ctx.restore();
 }
}
function waterArrival(ctx,width,height,time,cover){
 if(cover<=0)return;const left=Math.floor(width*(1-cover));ctx.save();ctx.beginPath();ctx.moveTo(width,0);
 for(let y=0;y<=height;y+=4)ctx.lineTo(Math.floor(left+Math.sin(y*.065-time*9)*5),y);ctx.lineTo(width,height);ctx.closePath();ctx.clip();
 ctx.globalAlpha=Math.min(1,cover*1.35);ctx.fillStyle='#092329';ctx.fillRect(Math.max(0,left-6),0,width-left+6,height);ctx.globalAlpha=Math.min(1,cover*1.8);
 for(let n=0;n<60;n++){const x=Math.floor((n*71+time*180)%(width+80)-40),y=Math.floor((n*37+time*24)%height);ctx.fillStyle=['#16434a','#23545a','#40777a','#82a9a0'][n%4];ctx.fillRect(x,y,12+n%5*8,1+n%2);}
 for(let y=0;y<height;y+=5){ctx.fillStyle=y%3?'#23545a':'#82a9a0';ctx.fillRect(left-2-Math.round(Math.sin(y*.1-time*10)*2),y,5,2);}ctx.restore();
}
export function drawLevelTransition(ctx,width,height,method,phase,time,anchor,heroes,drawHero){
 const p=transitionPose(method.kind,phase,time);ctx.clearRect(0,0,width,height);ctx.save();ctx.imageSmoothingEnabled=false;
 if(phase==='exit'&&method.kind==='portal'){const result=drawTransit(ctx,width,height,time,anchor,heroes.map(h=>({...h,screenX:h.x,screenY:h.y,scale:1})),drawHero,method.color);ctx.restore();return result;}
 if(phase==='exit'&&method.kind==='water'){const result=drawWaterTransit(ctx,width,height,time);ctx.restore();return result;}
 if(phase==='entry'&&method.kind==='portal'){
  ctx.globalAlpha=(1-p.reveal)*.95;ctx.fillStyle='#091b20';ctx.fillRect(0,0,width,height);ctx.globalAlpha=1-Math.max(0,Math.min(1,(time-.75)/.35));
  drawPortal(ctx,anchor.x,anchor.y+7,28,52,time,method.color,true);ctx.globalAlpha=1;
 }
 if(method.kind==='door'||method.kind==='transfer'){
  const alpha=phase==='entry'?1-p.reveal:Math.max(0,Math.min(1,(time-.8)/.65));ctx.globalAlpha=alpha;ctx.fillStyle=method.kind==='door'?'#899d9e':'#142327';ctx.fillRect(0,0,width,height);ctx.globalAlpha=1;
  if(method.kind==='transfer')for(const h of heroes){ctx.globalAlpha=p.warp*.4;ctx.fillStyle=method.color;ctx.fillRect(h.x-11,0,22,height);for(let n=0;n<9;n++){ctx.globalAlpha=p.warp*.7;ctx.fillRect(h.x-10,Math.floor((n*41-time*130+height*20)%height),20,2);}}
  ctx.globalAlpha=1;
 }
 if(method.kind==='fall'){const cover=phase==='entry'?1-p.reveal:Math.max(0,Math.min(1,(time-.6)/.9));ctx.globalAlpha=cover;ctx.fillStyle='#0b100f';ctx.fillRect(0,0,width,height);ctx.globalAlpha=1;}
 if(method.kind==='fall')for(let n=0;n<18;n++){ctx.globalAlpha=(1-p.progress)*.45;ctx.fillStyle=method.color;ctx.fillRect(Math.floor(anchor.x+(n%9-4)*13),Math.floor((n*31+time*100)%height),1,3+n%3*2);}ctx.globalAlpha=1;
 actors(ctx,method,phase,time,anchor,heroes,drawHero);
 if(phase==='entry'&&method.kind==='water')waterArrival(ctx,width,height,time,p.cover);
 ctx.restore();return p;
}
