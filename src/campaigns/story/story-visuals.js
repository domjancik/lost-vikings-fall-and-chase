import {snapPixel} from '../../render/pixel-grid.js?v=ground51';
export function platformSupports(level,p){
 const out=[];
 for(let x=p.x+20;x+14<=p.x+p.w;x+=120){
  const lower=[...level.floors,...level.platforms].filter(f=>f!==p&&f.y>p.y+64&&x>=f.x&&x+14<=f.x+f.w).sort((a,b)=>a.y-b.y)[0];
  if(lower)out.push({x:snapPixel(x),y:snapPixel(p.y+62),w:14,h:snapPixel(lower.y+2-(p.y+62)),floor:lower.y});
 }
 return out;
}
export function foundationOffset(pixels,w,h){
 // Sparse stray pixels cannot define a load-bearing foundation. Require a
 // broad opaque base row; empty margins stay empty and silhouettes stay fixed.
 for(let y=h-1;y>=0;y--){let count=0;for(let x=0;x<w;x++)if(pixels[(y*w+x)*4+3]>=128)count++;
  if(count>=w*.7)return (h-y-1)*2;
 }
 return 0;
}
export function deviceDone(g,id){
 if(id.startsWith('ratchet-'))return !!g.gates.find(v=>v.id===id.slice(8))?.secured;
 if(id.startsWith('lift-'))return !!g.lifts.find(v=>id.startsWith('lift-'+v.id+'-')&&v.target===v.high);
 if(id.startsWith('body'))return !!g.transferred[Number(id.slice(4))];
 return !!({route:g.flags.route,isolate:g.flags.isolated,work:g.work>=1,confirm:g.resetting||g.reset>=1,escape:g.flags.hatch,wafer:g.flags.wafer,archive:g.archiveMounted}[id]);
}
export function advanceDeviceVisuals(g,dt){
 g.visuals??={};
 const ids=['route','isolate','work','confirm','escape','wafer','archive',...g.gates.map(d=>'ratchet-'+d.id),...g.lifts.flatMap(l=>[l.low,l.high].map(y=>'lift-'+l.id+'-'+y)),...g.transferred.map((_,i)=>'body'+i)];
 for(const id of ids){const target=id==='work'?Math.max(0,Math.min(1,g.work||0)):deviceDone(g,id)?1:0,current=g.visuals[id]||0;g.visuals[id]=current+Math.sign(target-current)*Math.min(Math.abs(target-current),dt/.35);}
}
