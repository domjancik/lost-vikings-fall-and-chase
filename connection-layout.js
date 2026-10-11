import {snapPixel} from './pixel-grid.js?v=arc46';
export const CONNECTION_TILE=32;
const sets={pipe:{h:0,v:1,bend:2,anchor:6},cable:{h:8,v:9,bend:10,anchor:14},rail:{h:24,v:25,bend:26,anchor:29}};
export const connectionFrame=(time,phase=0)=>(Math.floor(time*5)+phase)%4;
const direction=(a,b)=>b[0]>a[0]?0:b[1]>a[1]?1:b[0]<a[0]?2:3;
function rotation(a,b){for(let r=0;r<4;r++)if([(2+r)%4,(1+r)%4].includes(a)&&[(2+r)%4,(1+r)%4].includes(b))return r;throw Error('Route must turn at each corner');}
export function connectionPlan(points,style='cable',{frame=0,phase=0}={}){
 const set=sets[style];if(!set)throw Error('Unknown connection material');
 const anchors=points.map(p=>p.map(snapPixel)),closed=anchors.length>2&&anchors[0].every((v,i)=>v===anchors.at(-1)[i]),vertices=closed?anchors.slice(0,-1):anchors;
 if(vertices.length<2)throw Error('Route needs two anchors');
 const tiles=[],corners=[],half=16,count=closed?vertices.length:vertices.length-1;
 for(let i=0;i<count;i++){
  const a=vertices[i],b=vertices[(i+1)%vertices.length],horizontal=a[1]===b[1];
  if(!horizontal&&a[0]!==b[0])throw Error('Route must be orthogonal');
  const length=Math.abs(b[0]-a[0])+Math.abs(b[1]-a[1]);if(length<32)throw Error('Route segment too short');
  const from=closed||i>0?half:0,to=closed||i<count-1?half:0,sign=Math.sign(horizontal?b[0]-a[0]:b[1]-a[1]);
  const low=Math.min(horizontal?a[0]+sign*from:a[1]+sign*from,horizontal?b[0]-sign*to:b[1]-sign*to),span=length-from-to;
  for(let n=0;n<span;n+=32){const remaining=Math.min(32,span-n),x=horizontal?low+n:a[0]-half,y=horizontal?a[1]-half:low+n;
   const cell=style==='cable'?(horizontal?16:20)+(frame+phase+i)%4:horizontal?set.h:set.v;
   tiles.push({cell,x,y,w:32,h:32,rotation:0,clip:remaining<32?{x,y,w:horizontal?remaining:32,h:horizontal?32:remaining}:null});
  }
 }
 for(let i=closed?0:1;i<(closed?vertices.length:vertices.length-1);i++){
  const p=vertices[i],prev=vertices[(i-1+vertices.length)%vertices.length],next=vertices[(i+1)%vertices.length],r=rotation(direction(p,prev),direction(p,next));
  const tile={cell:set.bend,x:p[0]-half,y:p[1]-half,w:32,h:32,rotation:r,clip:null};corners.push(tile);tiles.push(tile);
 }
 return {style,anchors,tiles,corners,closed,terminals:closed?[]:[vertices[0],vertices.at(-1)]};
}
