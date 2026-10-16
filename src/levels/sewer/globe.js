const approach=(a,b,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),d);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const createSewerGlobe=()=>({phase:'fall',x:235,y:520,vx:90,vy:240,bounces:0,legs:0,legCount:6,age:0,phaseTime:0,distance:0,rotation:0,stepAt:0});
const cue=(s,name,volume)=>{const g=s.machine,p=g.globe;g.events.push({name,x:p.x,y:p.y,id:g.eventSerial++,volume});if(g.events.length>16)g.events.shift();};
export function stepSewerGlobe(s,dt){
 const g=s.machine.globe;if(!g||g.phase==='gone')return;
 g.age+=dt;g.phaseTime+=dt;const oldX=g.x;
 if(g.phase==='fall'||g.phase==='bounce'){
  g.vy+=1250*dt;g.x+=g.vx*dt;g.y+=g.vy*dt;g.rotation=Math.sin(g.age*7)*.12;
  if(g.y+24>=760&&g.vy>0){g.y=736;g.bounces++;cue(s,'globeBounce',g.bounces===1?.45:.22);
   if(g.bounces>=2){g.phase='settle';g.phaseTime=0;g.vy=0;}
   else{g.phase='bounce';g.vy*=-.35;g.vx*=.92;}
  }
 }else if(g.phase==='settle'){
  g.vx=approach(g.vx,0,650*dt);g.x+=g.vx*dt;g.rotation=approach(g.rotation,0,dt);
  if(g.phaseTime>=.4){g.phase='hop';g.phaseTime=0;g.vy=-380;g.vx=90;cue(s,'globeWake',.6);}
 }else if(g.phase==='hop'){
  g.legs=smooth((g.phaseTime-.05)/.32);g.vy+=1250*dt;g.x+=g.vx*dt;g.y+=g.vy*dt;g.rotation=approach(g.rotation,0,dt);
  const sole=g.y+24+20*g.legs;
  if(g.vy>0&&sole>=760){g.y=716;g.vy=0;g.legs=1;g.phase='run';g.phaseTime=0;cue(s,'globeFeet',.3);}
 }else if(g.phase==='run'){
  g.vx=approach(g.vx,210,250*dt);g.x+=g.vx*dt;g.y=716;g.rotation=0;
  if(g.distance-g.stepAt>12){g.stepAt=g.distance;cue(s,'globeFeet',.12);}
  if(g.x>670){g.phase='gone';g.vx=0;}
 }
 g.distance+=Math.max(0,g.x-oldX);
}
export const sewerGlobeIntro=s=>s.level.mechanic==='sewer'&&s.machine.globe?.phase!=='gone';
export function sewerGlobeCamera(s,fallback){if(!sewerGlobeIntro(s))return fallback;const g=s.machine.globe;return {x:Math.min(425,270+Math.max(0,g.x-320)*.4),y:650,vx:0,vy:0};}
export function sewerGlobeViewport(s,view){if(!sewerGlobeIntro(s)||view.width>=500)return view;return {...view,width:500,height:Math.round(view.height*500/view.width)};}
