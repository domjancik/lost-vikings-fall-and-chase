const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=v=>{const t=clamp(v);return t*t*(3-2*t);};
export const EXIT_DURATION=1.7,ENTRY_DURATION=1.25;
export function departureAnchor(s){
 if(s.campaign==='arcade'&&s.round===0)return{x:1356,y:550};
 const e=s.level.exit||{x:1356,y:610};return{x:e.x,y:e.y-(s.campaign==='story'?60:s.level.mechanic==='lode'?52:54)};
}

export function departureMethod(s){
 if(s.level.mechanic==='sewer')return{kind:'water',color:'#82bfc1'};
 if(s.campaign==='story'&&s.round===6)return{kind:'transfer',color:'#d8c58d'};
 if(s.campaign==='story'&&s.round===7)return{kind:'door',color:'#c5dadd'};
 return{kind:'portal',color:s.campaign==='cycle'?'#67efd3':s.campaign==='story'?s.level.accent:'#b399e1'};
}
export function arrivalMethod(s,previous=null){
 if(s.level.mechanic==='sewer')return{kind:'fall',color:'#bfa47b'};
 if(previous)return{...previous};
 if(s.campaign==='story'&&s.round===6)return{kind:'portal',color:s.level.accent};
 if(s.campaign==='story'&&s.round===7)return{kind:'transfer',color:'#d8c58d'};
 if(s.level.mechanic==='water')return{kind:'water',color:'#82bfc1'};
 if(s.round===0&&s.campaign!=='cycle')return{kind:'door',color:'#c5dadd'};
 return departureMethod(s);
}
export function transitionPose(kind,phase,elapsed){
 const duration=phase==='entry'?ENTRY_DURATION:EXIT_DURATION,t=Math.max(0,elapsed),progress=clamp(t/duration),done=t>=duration;
 const warp=done?0:phase==='entry'?Math.pow(1-progress,1.4):Math.sin(Math.PI*clamp(t/1.1));
 return{progress,done,duration,warp:Math.max(0,warp),reveal:phase==='entry'?smooth(t/.95):1-smooth((t-.7)/.65),cover:phase==='entry'?1-smooth(t/.9):smooth(t/.85),kind,phase};
}
export const canAdvance=state=>!!state&&state.phase==='wait'&&state.done;
export function arrivalSpawns(s,kind){return s.heroes.map(h=>{
 const floor=(s.level.floors||[{x:0,y:610,w:1440}]).filter(f=>h.x>=f.x&&h.x<=f.x+f.w&&f.y>=h.y+44&&f.y-h.y-44<=16).sort((a,b)=>a.y-b.y)[0];
 return kind!=='fall'&&floor&&!h.ground?{...h,y:floor.y-44,prevY:floor.y-44,ground:true,vy:0}:{...h};
});}
export function createTravelKeys(){
 const held=new Set(),blocked=new Set();
 return{blocked,press(code,entering=false){held.add(code);if(entering)blocked.add(code);return blocked.has(code);},beginEntry(){for(const code of held)blocked.add(code);},release(code){held.delete(code);blocked.delete(code);},clear(){held.clear();blocked.clear();}};
}

export function transitionHeroPose(kind,phase,elapsed,h,anchor){
 if(kind==='fall'||kind==='water'&&phase==='exit')return null;
 const t=phase==='entry'?smooth((elapsed-h.id*.07)/.9):smooth((elapsed-h.id*.06)/.7),entry=phase==='entry';
 if(kind==='portal')return{x:Math.round(entry?anchor.x+(h.x-anchor.x)*t:h.x+(anchor.x-h.x)*t),y:Math.round(entry?anchor.y+(h.y-anchor.y)*t:h.y+(anchor.y-h.y)*t),scale:entry?Math.max(.05,Math.round(t*12)/12):Math.max(.02,Math.round((1-t)*12)/12),alpha:entry?t:1-t*.6};
 if(kind==='water')return{x:Math.round(h.x-110*(1-t)),y:Math.round(h.y-28*(1-t)),scale:1,alpha:t,rotation:(1-t)*.6};
 if(kind==='door')return{x:Math.round(h.x+(entry?-52*(1-t):t*80)),y:h.y,scale:1,alpha:entry?t:1-t};
 return{x:h.x,y:h.y,scale:1,alpha:entry?t:1-t};
}

// Source AND destination rectangles stay inside the native framebuffer. The
// scratch copy is sampled only with integer drawImage rectangles, never readback.
export function distortionBands(kind,phase,elapsed,width,height,anchor){
 const p=transitionPose(kind,phase,elapsed),amp=Math.round(p.warp*(kind==='portal'?9:kind==='water'?6:4));
 if(!amp||width<2||height<2)return[];
 const bands=[],radius=Math.min(Math.max(width,height)*.58,200),step=4,time=Math.floor(elapsed*30)/30;
 for(let y=0;y<height;y+=step){
  let left=0,right=width,dx=0,dy=0;
  if(kind==='portal'){
   const d=(y-anchor.y)/radius;if(Math.abs(d)>=1)continue;
   const span=Math.sqrt(1-d*d)*radius;left=Math.max(0,Math.floor(anchor.x-span));right=Math.min(width,Math.ceil(anchor.x+span));
   dx=Math.round(Math.sin(d*7-time*8)*amp*(1-Math.abs(d)));dy=Math.round(-d*amp*(phase==='entry'?-1:1));
  }else if(kind==='water'){dx=Math.round(Math.sin(y*.065-time*8)*amp);dy=Math.round(amp*.6);}
  else if(kind==='fall'){dx=Math.round(Math.sin(y*.08+time*11)*amp*.35);dy=amp;}
  else{dx=Math.round(Math.sin(y*.08-time*5)*amp*.4);dy=kind==='transfer'?-amp:0;}
  const sx=Math.max(left,-dx),sy=Math.max(y,-dy),endX=Math.min(right,width-dx),endY=Math.min(y+step,height,height-dy);
  if(endX>sx&&endY>sy)bands.push({sx,sy,dx:sx+dx,dy:sy+dy,w:endX-sx,h:endY-sy});
 }
 return bands;
}
