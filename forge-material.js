import {snapPixel,snapAngle,animationTime} from './pixel-grid.js?v=far45';
export const ORE_LOAD_TIME=4/3;
const clamp=v=>Math.max(0,Math.min(1,v));
export function oreReady(s){const g=s.machine;return g.ore&&(g.oreCutAt===undefined||s.time-g.oreCutAt>=ORE_LOAD_TIME);}
export function forgeMaterialPose(s){const g=s.machine;if(!g.ore)return {stage:'hanging',age:0,x:940,y:420,angle:0};const age=animationTime(Math.max(0,s.time-(g.oreCutAt??(s.time-2)))),fall=clamp((age-.18)/.5),pour=clamp((age-.68)/.62);return {stage:age<.18?'cut':age<.68?'fall':age<ORE_LOAD_TIME?'pour':'loaded',age,x:snapPixel(940+28*fall),y:snapPixel(420+24*fall*fall),angle:snapAngle(pour*.7),pour};}
export function drawForgeMaterial(ctx,s,part,box,text){const g=s.machine,p=forgeMaterialPose(s),t=animationTime(s.time);
 // Keep the hoist, basket, release chain and ore as separate pieces from the original sprite cell.
 const chain=(x,y,h)=>{for(let yy=y;yy<y+h;yy+=12)part(7,.43,0,.16,.38,x-4,yy,8,12);};
 chain(940,335,p.stage==='hanging'?54:Math.max(16,54-p.age*65));
 if(p.stage==='hanging'){chain(940,472,104);part(7,0,.4,1,.6,906,389,68,84);text('Z · CUT RELEASE CHAIN',940,316,s.level.accent,11);}
 else if(p.stage!=='loaded'){
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);part(7,0,p.stage==='pour'?.68:.4,1,p.stage==='pour'?.32:.6,-34,p.stage==='pour'?8:-31,68,p.stage==='pour'?44:84);ctx.restore();
  const cut=1-Math.min(p.age/.45,1);if(cut>0){chain(snapPixel(940+p.age*20),snapPixel(552+p.age*80),16);ctx.strokeStyle='#fff1b4';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(922,586-p.age*45);ctx.lineTo(958,552+p.age*45);ctx.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;box(i%2?'#ffbc70':'#fff6c2',940+Math.cos(a)*p.age*100,566+Math.sin(a)*p.age*100,4,4);}}
  if(p.age>=.68){for(let i=0;i<6;i++){const k=clamp((p.age-.68-i*.035)/.34);if(k>=1)continue;const x=snapPixel(984+(1000-984)*k+(i%2)*2),y=snapPixel(440+48*k-Math.sin(k*Math.PI)*12);part(7,.25,.4,.48,.23,x-7,y-7,14,14);}}
  (text.status||text)(p.stage==='cut'?'CHAIN CUT!':p.stage==='fall'?'ORE RELEASED':'POURING INTO CRUCIBLE',1000,395,'#ffe3a0',11);
 }
 if(oreReady(s)){
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);part(7,0,.68,1,.32,-34,8,68,44);ctx.restore();
  // Material stays visible in the forge and responds to each redirected flame.
  const hit=Math.max(0,1-(s.time-(g.lastForgeHit??-10))/.55);for(let i=0;i<4;i++){part(7,.25,.4,.48,.23,976+i*11,478-(i%2)*4,18,14);if(g.heat){box(['#bc72de','#db8187','#ffb358','#ffe5a0'][g.heat],978+i*11,480-(i%2)*4,12,6);}}
  if(hit){ctx.strokeStyle='#fff1b5';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(1000,488,snapPixel(15+(1-hit)*35),snapPixel(6+(1-hit)*12),0,0,Math.PI*2);ctx.stroke();for(let i=0;i<7;i++)box('#ffd282',1000+Math.cos(i*2.4)*(1-hit)*45,480-Math.sin(i*2.4)*(1-hit)*30-(1-hit)*20,4,4);}
  if(g.heat<3)(text.status||text)('ORE LOADED · '+g.heat+'/3 HEAT',1000,395,'#ffd695',11);
 }
}

