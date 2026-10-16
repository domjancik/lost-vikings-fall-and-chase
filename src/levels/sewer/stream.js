import {SHIELD} from '../../heroes/hero-geometry.js';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
// This geometry is shared by the wetting/force test and the native-grid renderer.
// The upper service pipe remains pressurised; gravity bends its leftward jet.
export function sewerSprayGeometry(s){
 const j=s.machine.jet,floorY=s.level.layout.floorY,empty={incoming:[],reflected:[],blocker:null,floor:null};
 if(j.pose<=.01)return empty;
 const radius=j.h/2,sourceY=j.y+radius,run=j.w,endX=j.outletX-run;
 const drop=Math.max(0,floorY-radius-sourceY);
 const at=x=>({x,y:sourceY+drop*((j.outletX-x)/run)**2,radius});
 const o=s.heroes[2],plane=o.x+SHIELD.width;
 const contact=at(plane),shieldTop=o.y+20-SHIELD.height/2,shieldBottom=shieldTop+SHIELD.height;
 const blocks=!o.dead&&o.shield&&!o.shieldUp&&o.face===1&&plane> endX&&plane<j.outletX&&contact.y>=shieldTop&&contact.y<=shieldBottom;
 const stop=blocks?plane:endX,incoming=[];
 const count=Math.max(1,Math.ceil((j.outletX-stop)/8));
 for(let n=0;n<=count;n++)incoming.push(at(j.outletX+(stop-j.outletX)*n/count));
 const reflected=[];
 if(blocks){
  // The vertical face reverses horizontal momentum; the heavy water fans down
  // beside the shield instead of vanishing along the whole service gallery.
  const last=incoming.at(-1),distance=Math.max(12,floorY-last.y-radius),length=30+distance*.55;
  for(let n=0;n<=12;n++){const t=n/12,r=radius*(1-t*.65);reflected.push({x:last.x+length*t,y:last.y+(floorY-last.y-r)*t*t,radius:r});}
 }
 const end=(blocks?reflected:incoming).at(-1);
 return {incoming,reflected,blocker:blocks?o.id:null,floor:{x:end.x,y:floorY},pose:clamp(j.pose,0,1)};
}

export function sewerSprayTouches(g,rect){
 // Only the incoming pressurised jet knocks heroes back. The downward splash
 // and thin floor runoff are cosmetic, so the protected route stays safe.
 return g.incoming.some(p=>p.x>=rect.x&&p.x<=rect.x+rect.w&&p.y+p.radius>rect.y&&p.y-p.radius<rect.y+rect.h);
}
