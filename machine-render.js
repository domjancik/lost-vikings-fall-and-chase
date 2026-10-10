import {machinePose} from './machine-animation.js?v=far45';
import {snapPixel,animationTime} from './pixel-grid.js?v=far45';
const atlas=new Image();atlas.src='assets/pixel/machine-states.png?v=pipeline44';
const flames=new Image();flames.src='assets/pixel/background-fx.png?v=pipeline44';
// Equal fixed source cells preserve pivots and scale across every state.
export function drawMachine(ctx,s,kind,x,bottom,w,h){
 if(!atlas.complete||!atlas.naturalWidth)return false;
 const p=machinePose(s),row={oven:0,bowl:1,dragon:2}[kind],frame=p[kind+'Frame'];
 const cw=atlas.width/4,ch=atlas.height/3;
 ctx.save();
 if(kind==='dragon'){ctx.beginPath();ctx.rect(1148,400,292,210);ctx.clip();}
 ctx.drawImage(atlas,frame*cw,row*ch,cw,ch,snapPixel(x-w/2),snapPixel(bottom-h),snapPixel(w),snapPixel(h));
 if(kind==='oven'&&s.machine.ovenMode&&p.ovenFrame===1){
  // Fire remains inside the window; the copper housing stays still.
  ctx.save();ctx.beginPath();ctx.rect(snapPixel(x-w*.14),snapPixel(bottom-h*.47),snapPixel(w*.28),snapPixel(h*.27));ctx.clip();
  if(flames.complete&&flames.naturalWidth)ctx.drawImage(flames,p.flameFrame*flames.width/8,0,flames.width/8,flames.height/4,snapPixel(x-w*.17),snapPixel(bottom-h*.53),snapPixel(w*.34),snapPixel(h*.38));
  ctx.restore();
 }
 if(kind==='dragon'&&p.dragonFrame===2&&flames.complete&&flames.naturalWidth){
  ctx.save();ctx.translate(snapPixel(x-w*.3),snapPixel(bottom-h*.48));ctx.rotate(-Math.PI/2);
  ctx.drawImage(flames,p.flameFrame*flames.width/8,0,flames.width/8,flames.height/4,-20,-24,40,62);ctx.restore();
 }
 ctx.restore();return true;
}
export function drawSafeDoor(ctx,s,drawSprite){
 drawSprite(15,970,390,94,82);
 if(!s.machine.safe)return;
 const p=machinePose(s),x=950;
 ctx.fillStyle='#171525';ctx.fillRect(x,326,40,52);
 ctx.fillStyle='#a26c32';ctx.fillRect(snapPixel(x-p.safeOpen),326,Math.max(4,40-p.safeOpen),52);
 ctx.fillStyle='#f3c869';ctx.fillRect(snapPixel(x-p.safeOpen),328,4,48);
}
