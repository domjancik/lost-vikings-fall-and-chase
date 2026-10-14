export function rotationBounds(rect,anchor,angle){
 const [, ,w,h]=rect,c=Math.cos(angle),s=Math.sin(angle);
 const corners=[[0,0],[w,0],[0,h],[w,h]].map(([x,y])=>[(x-anchor[0])*c-(y-anchor[1])*s,(x-anchor[0])*s+(y-anchor[1])*c]);
 const x=Math.floor(Math.min(...corners.map(p=>p[0])))-2,y=Math.floor(Math.min(...corners.map(p=>p[1])))-2;
 return{x,y,w:Math.ceil(Math.max(...corners.map(p=>p[0])))+2-x,h:Math.ceil(Math.max(...corners.map(p=>p[1])))+2-y};
}
export function createRenderCache(limit=96){
 const values=new Map();return{
  get(key){const v=values.get(key);if(v!==undefined){values.delete(key);values.set(key,v);}return v;},
  set(key,value){values.delete(key);values.set(key,value);if(values.size>limit)values.delete(values.keys().next().value);return value;},
  get size(){return values.size;}
 };
}
export function partitionLadders(actual,base){
 const key=l=>l.x+':'+l.top+':'+l.bottom,keys=new Set(base.map(key));
 return{static:base,dynamic:actual.filter(l=>!keys.has(key(l)))};
}
export function visibleChunks(view,level,size=512){
 const result=[],right=Math.min(level.worldWidth,view.x+view.width),bottom=Math.min(level.worldBottom,view.y+view.height);
 for(let yy=Math.floor(Math.max(level.worldTop,view.y)/size)*size;yy<bottom;yy+=size){
  for(let xx=Math.floor(Math.max(0,view.x)/size)*size;xx<right;xx+=size){
   const y=Math.max(yy,level.worldTop);result.push({x:xx,y,w:Math.min(size,level.worldWidth-xx),h:Math.min(yy+size,level.worldBottom)-y});
  }
 }
 return result;
}
