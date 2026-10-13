import {snapPixel} from './pixel-grid.js?v=arc46';

export const HERO_CELL=64;
export const HERO_ORIGIN={x:32,y:40,sole:62};
export function heroAnimationCell(h,pose,frame=0){const f=Math.max(0,Math.floor(frame));
 if(['native85','imagegen88','imagegen90'].includes(h.skin))return{sheet:h.skin,cell:native85Cell(h,pose,f),cols:8};
 if(h.skin==='imagegen81'&&['run','turn'].includes(pose)&&!(h.id===2&&h.shieldUp))return{sheet:'imagegen81',cell:f%8,cols:h.id===1?8:4};
 if(h.skin==='previous')return{sheet:'legacy',cell:heroCell(h.id,pose,f),cols:8};
 if(['run','turn','idle','climb','overhead','float'].includes(pose)){
  const id=h.id,stride=Math.floor(f/2)%4;let cell;
  if(pose==='run'||pose==='turn')cell=(id===2&&h.shieldUp?8:0)+stride;
  else if(pose==='climb')cell=(id===2?20:12)+f%4;
  else if(id===2&&pose==='float')cell=28+Math.min(f,3);
  else cell=(id===2?h.shieldUp?24:16:8)+f%4;
  return{sheet:'locomotion',cell,cols:id===2?8:4};
 }
 return{sheet:'legacy',cell:heroCell(h.id,pose,f),cols:8};
}
function native85Cell(h,pose,f){
 const id=h.id,up=id===2&&h.shieldUp;
 if(pose==='run'||pose==='turn')return(up?26:0)+f%8;
 if(pose==='idle'||pose==='overhead')return(up||pose==='overhead'?34:8)+f%4;
 if(pose==='look-up')return 12;
 if(pose==='look-down')return 13;
 if(pose==='climb')return(up?52:14)+f%4;
 if(pose==='rise')return 18+Math.min(f,1);
 if(pose==='fall')return 20+Math.min(f,1);
 if(pose==='land')return 22+Math.min(f,2);
 if(pose==='hurt')return 25;
 if(id===0&&pose==='bash')return 26+Math.min(f,5);
 if(id===1&&pose==='sword')return 26+Math.min(f,5);
 if(id===1&&pose==='bow')return 32+Math.min(5,Math.round(f*5/3));
 if(id===2&&pose==='float')return 56+Math.min(f,3);
 if(id===2&&pose==='shield-raise')return 38+Math.min(f,6);
 if(id===2&&pose==='shield-lower')return 45+6-Math.min(f,6);
 throw new Error(`unsupported native85 hero pose ${id}:${pose}`);
}
export function heroPlacement(h){
 return {x:snapPixel(h.x)-64,y:snapPixel(h.y)-80,sole:62,facing:h.face||1};
}
export function heroCell(id,pose,frame=0){
 const f=Math.max(0,Math.floor(frame));
 const common={run:()=>f%8,turn:()=>f%8,idle:()=>8+f%4,
  rise:()=>12+Math.min(f,1),fall:()=>14+Math.min(f,1),
  climb:()=>16+f%4,land:()=>20+Math.min(f,2),hurt:()=>23};
 if(common[pose])return common[pose]();
 if(id===0&&pose==='bash')return 24+Math.min(f,5);
 if(id===1&&pose==='sword')return 24+Math.min(3,Math.floor(f*4/6));
 if(id===1&&pose==='bow')return 28+Math.min(f,3);
 if(id===2&&['float','overhead','shield-raise','shield-lower'].includes(pose)){
  if(pose==='shield-raise'||pose==='shield-lower')return 24+Math.min(f,6);
  return 28+f%4;
 }
 throw new Error(`unsupported hero pose ${id}:${pose}`);
}
