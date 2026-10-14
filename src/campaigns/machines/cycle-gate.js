import {snapPixel} from '../../render/pixel-grid.js?v=arc46';
export function cycleGatePose(g,time){const active=!!g.highArrival,frame=Math.floor(time*12);return {x:2536,y:132,w:128,h:128,nativeWidth:64,nativeHeight:64,floorY:260,active,frame,glow:active?.72+.18*Math.sin(frame*.35):0,aperture:{x:2600,y:206,w:40,h:80}};}
export function gateFieldContains(p,x,y){const a=p.aperture,r=a.w/2,top=a.y-a.h/2,cy=top+r;if(Math.abs(x-a.x)>r||y<top||y>a.y+a.h/2)return false;return y>=cy||(x-a.x)**2+(y-cy)**2<=r*r;}
export function drawCycleGateField(ctx,p){
 const a=p.aperture;ctx.save();
 if(p.active){const glow=ctx.createRadialGradient(a.x,a.y,8,a.x,a.y,86);glow.addColorStop(0,'rgba(146,255,233,'+p.glow*.5+')');glow.addColorStop(.5,'rgba(42,190,184,'+p.glow*.2+')');glow.addColorStop(1,'rgba(42,190,184,0)');ctx.fillStyle=glow;ctx.fillRect(a.x-86,a.y-86,172,172);}
 const r=a.w/2,top=a.y-a.h/2,bottom=a.y+a.h/2;ctx.beginPath();ctx.moveTo(a.x-r,bottom);ctx.lineTo(a.x-r,top+r);ctx.arc(a.x,top+r,r,Math.PI,0);ctx.lineTo(a.x+r,bottom);ctx.closePath();ctx.clip();if(p.active){const core=ctx.createRadialGradient(a.x,a.y,2,a.x,a.y,48);core.addColorStop(0,'#d2fff1');core.addColorStop(.35,'#67efd3');core.addColorStop(.75,'#247c80');core.addColorStop(1,'#143e48');ctx.fillStyle=core;}else ctx.fillStyle='#102329';ctx.fillRect(a.x-a.w/2,a.y-a.h/2,a.w,a.h);
 if(p.active){for(let n=0;n<10;n++){const phase=(n*9+p.frame*2)%a.h,y=snapPixel(a.y-a.h/2+phase),x=snapPixel(a.x+Math.sin((n+p.frame)*.4)*12);if(!gateFieldContains(p,x,y))continue;ctx.fillStyle=n%3===0?'#d9fff2':'#5ee6d4';ctx.globalAlpha=p.glow;ctx.fillRect(x,y,2,n%3===0?6:2);}ctx.globalAlpha=1;}
 ctx.restore();
}
