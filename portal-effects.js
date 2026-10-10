export const TRANSIT_DURATION=1.7;
const clamp=v=>Math.max(0,Math.min(1,v));
export function portalPose(time,width,height){const frame=Math.floor(time*12);return {frame,phase:frame/12,width,height};}
export function transitionPose(elapsed){const progress=clamp(elapsed/TRANSIT_DURATION);return {progress,drawIn:clamp(elapsed/.65),travel:clamp((elapsed-.4)/1),fade:clamp((elapsed-1.3)/.4),done:elapsed>=TRANSIT_DURATION};}
export function canContinue(key,repeat,elapsed){return !repeat&&elapsed>=TRANSIT_DURATION&&['Enter',' '].includes(key);}
// Rasterized through the same low-resolution surface as the world; apertures never resize.
export function drawPortal(ctx,x,y,width,height,time,color='#b5a0ff',active=true){const p=portalPose(time,width,height),t=p.phase;ctx.save();ctx.beginPath();ctx.ellipse(Math.round(x),Math.round(y),width/2,height/2,0,0,Math.PI*2);ctx.clip();ctx.fillStyle=active?'#100c25':'#14121b';ctx.fillRect(x-width/2,y-height/2,width,height);ctx.translate(Math.round(x),Math.round(y));ctx.scale(1,height/width);ctx.lineWidth=2;
 for(let n=0;n<7;n++){const radius=3+((n*5+t*12)%(width/2));ctx.strokeStyle=n%3===0?'#e9dcff':color;ctx.globalAlpha=active?.35+(n%3)*.2:.13;ctx.beginPath();ctx.arc(0,0,radius,t*2+n*.65,t*2+n*.65+Math.PI*1.35);ctx.stroke();}
 ctx.globalAlpha=active?1:.25;ctx.fillStyle='#f9f0ff';for(let n=0;n<9;n++){const a=n*2.4-t*1.7,r=4+((n*7-t*9+1000)%(width/2-3));ctx.fillRect(Math.round(Math.cos(a)*r),Math.round(Math.sin(a)*r),2,2);}ctx.restore();}
export function drawTransit(ctx,width,height,elapsed,origin,heroes,drawHero){const pose=transitionPose(elapsed),t=Math.floor(elapsed*24)/24,cx=width/2,cy=height/2;ctx.clearRect(0,0,width,height);const size=Math.hypot(width,height),expand=1-Math.pow(1-clamp(elapsed/.9),3),x=origin.x+(cx-origin.x)*expand,y=origin.y+(cy-origin.y)*expand,r=18+size*expand;
 ctx.save();ctx.beginPath();ctx.ellipse(Math.round(x),Math.round(y),r*.8,r,0,0,Math.PI*2);ctx.clip();ctx.fillStyle='#130e29';ctx.fillRect(0,0,width,height);
 for(let n=0;n<18;n++){const depth=((n/18+t*.9)%1),radius=4+Math.pow(depth,2)*size;ctx.strokeStyle=['#463678','#8069bd','#b399e1','#e4d1fa'][n%4];ctx.lineWidth=1+depth*5;ctx.beginPath();ctx.ellipse(Math.round(x),Math.round(y),Math.round(radius*.8),Math.round(radius),0,0,Math.PI*2);ctx.stroke();}
 ctx.strokeStyle='#cab1ed';ctx.lineWidth=1;for(let n=0;n<28;n++){const angle=n*Math.PI/14+t*.7,len=20+((n*43+t*260)%size);ctx.beginPath();ctx.moveTo(Math.round(x+Math.cos(angle)*len*.8),Math.round(y+Math.sin(angle)*len));ctx.lineTo(Math.round(x+Math.cos(angle)*(len+20+pose.travel*50)*.8),Math.round(y+Math.sin(angle)*(len+20+pose.travel*50)));ctx.stroke();}
 ctx.restore();
 if(elapsed<.85)for(const [i,h] of heroes.entries()){const delay=i*.06,k=clamp((elapsed-delay)/.7),ease=k*k;drawHero(ctx,h,Math.round(h.screenX+(x-h.screenX)*ease),Math.round(h.screenY+(y-h.screenY)*ease),Math.max(.015,h.scale*(1-ease)));}
 if(elapsed>.95&&elapsed<1.2){ctx.fillStyle='#e8daff';ctx.globalAlpha=.2*Math.sin((elapsed-.95)/.25*Math.PI);ctx.fillRect(0,0,width,height);}if(pose.fade){ctx.fillStyle='#100d1b';ctx.globalAlpha=pose.fade;ctx.fillRect(0,0,width,height);}ctx.globalAlpha=1;return pose;
}
