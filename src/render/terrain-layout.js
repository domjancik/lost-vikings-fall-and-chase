import {snapPixel} from './pixel-grid.js?v=arc46';
export function terrainMaterial(round,campaign){return campaign==='story'?round:[7,1,0,4,5,6,7,4,0,5,2][round];}
export function terrainPlan(x,y,w,h){
 x=snapPixel(x);y=snapPixel(y);w=snapPixel(w);h=snapPixel(h);
 const tiles=[],add=(role,column,dx,dy,sx,sy,sw,sh)=>tiles.push({role,column,x:dx,y:dy,sx,sy,sw,sh,w:sw*2,h:sh*2});
 for(let yy=y+32;yy<y+h;yy+=64)for(let xx=x;xx<x+w;xx+=64){const variant=((Math.floor(xx/64)*73856093^Math.floor(yy/64)*19349663)>>>0)%17===0?5:4;add('infill',variant,xx,yy,0,0,32,32);}
 for(let xx=x;xx<x+w;xx+=64)add('top',1,xx,y,0,0,32,16);
 if(w>=128){add('top',0,x,y,0,0,32,16);add('top',2,x+w-64,y,0,0,32,16);}
 else{add('top',0,x,y,0,0,8,16);add('top',2,x+w-16,y,24,0,8,16);}
 for(let yy=y+32;yy<y+h;yy+=64){add('left',3,x,yy,0,0,8,32);add('right',6,x+w-16,yy,24,0,8,32);}
 for(let xx=x;xx<x+w;xx+=64)add('bottom',7,xx,y+h-8,0,28,32,4);
 return {clip:{x,y,w,h},tiles};
}
