import {TRANSIT_DURATION} from '../../render/portal-effects.js?v=transitions126';
const clamp=v=>Math.max(0,Math.min(1,v));
export function sweptHeroPose(h,travel){
 if(travel==null||h.sweptAway)return null;
 if(h.escapePose)return{rotation:h.escapePose.rotation,scale:h.escapePose.scale,magnetSole:{x:h.x,y:h.y+44},ground:false,climbing:false};
 return{rotation:.75*clamp(travel/100),magnetSole:{x:h.x,y:h.y+44},ground:false,climbing:false};
}
export function waterTransitPose(elapsed,width,height){
 const t=Math.max(0,elapsed),cover=clamp(t/.65);
 return {cover,travel:clamp((t-.15)/1.2),flow:Math.floor(t*96),fade:clamp((t-1.25)/.45),done:t>=TRANSIT_DURATION,width,height};
}
// A full-width downstream wash follows the actual three individual captures.
// No portal aperture or duplicated shrinking crew: they are already in the pipe.
export function drawWaterTransit(ctx,width,height,elapsed){
 const p=waterTransitPose(elapsed,width,height),t=Math.floor(Math.max(0,elapsed)*24)/24;
 ctx.clearRect(0,0,width,height);ctx.save();
 const front=Math.round(width*(1-p.cover));ctx.beginPath();ctx.rect(front,0,width-front,height);ctx.clip();
 ctx.fillStyle='#092329';ctx.fillRect(0,0,width,height);
 for(let n=0;n<42;n++){
  const x=Math.round(((n*71+p.flow*2)%(width+80)+width+80)%(width+80)-40),y=Math.round((n*37+p.flow*.25)%height),w=12+n%5*8;
  ctx.fillStyle=['#16434a','#23545a','#40777a','#82a9a0'][n%4];
  ctx.fillRect(x,y,w,1+n%2);ctx.fillRect(x+w-3,y+2,7,1);
 }
 for(let n=0;n<9;n++){
  const x=Math.round((n*53+p.flow*3+width*10)%width),y=Math.round(height/2+Math.sin(n*1.9+t*4)*height*.3+p.flow*.15);
  ctx.strokeStyle='#a4b9a5';ctx.lineWidth=1;ctx.strokeRect(x,y,2+n%3,2+n%3);
 }
 ctx.fillStyle=`rgba(2,12,16,${p.fade})`;ctx.fillRect(0,0,width,height);ctx.restore();return p;
}
