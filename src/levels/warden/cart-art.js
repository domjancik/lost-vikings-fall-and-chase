import {snapPixel as q} from '../../render/pixel-grid.js?v=arc46';
export const CART_ART={nativeSize:[192,128],sourceBounds:[5,23,182,84],worldPixel:2,deck:[19,71,150],wheelBottom:107,wheelSupportOffset:70,
 ports:{wheel:[98,62],clampLeft:[20,26],clampRight:[167,26]},
 pieces:{wheelNear:{center:[36,92],radius:16},wheelFar:{center:[156,92],radius:16},wheel:{center:[98,62],radius:9}}};
export function cartPlacement(p){return{x:q(p.x-CART_ART.deck[0]*2),y:q(p.y-CART_ART.deck[1]*2),w:384,h:256};}
export function cartPort(p,name){const r=cartPlacement(p),[x,y]=CART_ART.ports[name];return{x:r.x+x*2,y:r.y+y*2};}
export function cartWheelPlacement(p,name){
 const r=cartPlacement(p),[x,y]=CART_ART.pieces[name].center;
 return{x:r.x+x*2,y:q(p.y+CART_ART.wheelSupportOffset-(CART_ART.wheelBottom-y)*2),visibleBottom:q(p.y+CART_ART.wheelSupportOffset)};
}
export function circleRows({center:[x,y],radius}){
 const rows=[];for(let row=-radius;row<radius;row++){
  const half=Math.floor(Math.sqrt(radius*radius-(row+.5)*(row+.5)));
  if(half)rows.push({x:x-half,y:y+row,w:half*2});
 }return rows;
}
export function createCartPieces(image){
 const body=document.createElement('canvas');body.width=192;body.height=128;
 const b=body.getContext('2d');b.imageSmoothingEnabled=false;b.drawImage(image,0,0);
 const pieces={};b.globalCompositeOperation='destination-out';
 for(const [name,spec]of Object.entries(CART_ART.pieces)){
  const {center:[x,y],radius}=spec,c=document.createElement('canvas');c.width=c.height=radius*2;
  const t=c.getContext('2d');t.imageSmoothingEnabled=false;
  // Native atlas extraction: each source pixel belongs to either the rigid
  // body or one moving component. No resampling, painted overlay or readback.
  for(const row of circleRows(spec)){b.fillRect(row.x,row.y,row.w,1);t.drawImage(image,row.x,row.y,row.w,1,row.x-x+radius,row.y-y+radius,row.w,1);}
  pieces[name]=c;
 }return{body,...pieces};
}
