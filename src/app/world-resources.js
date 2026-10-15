import {heroResource} from './hero-resources.js?v=orbit116';
import {snapPixel} from '../render/pixel-grid.js?v=water114';
export function worldResource(s,id){
 const h=s.heroes[id],r=heroResource(s,id);if(!r)return null;
 return{...r,heroId:id,x:snapPixel(h.x),y:snapPixel(h.y-(h.id===2&&h.shieldUp?86:66)),width:40};
}
export function worldResources(s,scale=1){
 // Screen labels retain an 11px minimum font. Account for that at the wide
 // mobile 1x view instead of packing only the smaller world-space bar.
 const reach=Math.max(72,80/scale),gap=Math.ceil(Math.max(26,20/scale)/2)*2;
 const rs=s.heroes.map(h=>worldResource(s,h.id)),placed=[];
 for(const r of rs.filter(Boolean)){r.anchorX=r.x;r.anchorY=r.y;
  const neighbors=rs.some(other=>other&&other!==r&&Math.abs(r.x-other.x)<reach&&Math.abs(r.anchorY-(other.anchorY??other.y))<gap*2);
  r.tag=neighbors?['E','B','O'][r.heroId]:'';
  while(placed.some(p=>Math.abs(r.x-p.x)<reach&&Math.abs(r.y-p.y)<gap))r.y-=gap;
  placed.push(r);
 }
 return rs;
}
export function drawWorldResources(ctx,s,text,scale=1){
 const rs=worldResources(s,scale).filter(Boolean),heroColors=['#edab77','#bfc4df','#add2b2'];
 for(const r of rs)if(r.y!==r.anchorY){ctx.fillStyle=heroColors[r.heroId];ctx.fillRect(r.x,r.y+8,2,r.anchorY-r.y);}
 for(const r of rs){
  const x=r.x-r.width/2,y=r.y,color=r.critical?'#ee886b':r.kind==='air'?'#91d4dc':r.kind==='recover'?'#a5cda1':'#dfbd70';
  ctx.fillStyle='#091726';ctx.fillRect(x-2,y-2,r.width+4,8);
  ctx.fillStyle='#35434b';ctx.fillRect(x,y,r.width,4);
  ctx.fillStyle=color;ctx.fillRect(x,y,Math.round(r.width*r.ratio/2)*2,4);
  if(r.tag){ctx.fillStyle=heroColors[r.heroId];ctx.fillRect(x-2,y-2,4,8);}
  text((r.tag?r.tag+' · ':'')+r.label+' '+Math.ceil(r.remaining)+'s',r.x,y-4,color,8);
 }
}
