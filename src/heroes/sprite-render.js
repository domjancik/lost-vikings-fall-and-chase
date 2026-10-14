import {drawHeroArt} from './hero-art.js?v=water114';
export {heroesReady,whenHeroesReady} from './hero-art.js?v=water114';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function animationFor(h){
 let pose='idle',frame=Math.floor((h.animTime||0)*[2.7,2.2,2.4][h.id]+[0,1.4,2.8][h.id])%4;
 if(h.hurt>0||h.hit>0){pose='hurt';frame=Math.floor((h.hurt||h.hit)*20)%3;}
 else if(h.swing>0){pose='sword';frame=clamp(Math.floor((.24-h.swing)/.24*6),0,5);}
 else if(h.bow>0){pose='bow';frame=clamp(Math.floor((.28-h.bow)/.28*4),0,3);}
 else if(h.bash>0){pose='bash';frame=clamp(Math.floor((.36-h.bash)/.36*6),0,5);}
 else if(h.id===2&&h.shieldPose!==undefined&&Math.abs(h.shieldPose-(h.shieldUp?1:h.shield?.4:0))>.075){
  pose=h.shieldUp?'shield-raise':'shield-lower';frame=clamp(Math.floor((h.shieldPose-.4)/.6*6+1e-8),0,6);
  // Generated lower cells are authored as elapsed lowering progress. The
  // physical pose above is an absolute raised fraction, so reverse it once.
  if(!h.shieldUp&&(!h.skin||['current','native85','imagegen88','imagegen90'].includes(h.skin)))frame=6-frame;
 }
 else if(h.climbing){pose='climb';frame=((Math.floor(h.climbPhase||0)%4)+4)%4;}
 else if(h.id===0&&h.swimming){pose=['procedural','imagegen90'].includes(h.skin)?'swim':'fall';frame=pose==='swim'?Math.floor((h.animTime||0)*6)%8:0;}
 else if(!h.ground){pose=h.id===2&&h.shieldUp?'float':h.vy<0?'rise':'fall';frame=pose==='float'?h.vy<-40?0:h.turn||Math.abs(h.vx||0)<35?3:1+Math.floor((h.animTime||0)*4)%2:Math.abs(h.vy)>280?1:0;}
 else if(h.land>0){pose='land';frame=clamp(Math.floor((.12-h.land)/.12*3),0,2);}
 else if(Math.abs(h.magnet?h.magV||0:h.vx||0)>7){
  pose=h.turn?'turn':'run';
  // walk is accumulated travel / 9, not elapsed time. A full left/right
  // stride needs room for contact, compression, passing and flight.
  const strideDistance=[128,112,104][h.id];
  frame=Math.floor((h.walk||0)*72/strideDistance+1e-8)%8;
 }
 else if(h.id===2&&h.lookDirection&&h.ground&&!h.climbing&&!h.shieldUp&&(!h.skin||['current','native85','imagegen88','imagegen90'].includes(h.skin))){pose=h.lookDirection<0?'look-up':'look-down';frame=0;}
 else if(h.id===2&&h.shieldUp){pose='overhead';}
 return {pose,frame};
}

export function drawSprite(g,h,x,y,scale=1){const {pose,frame}=animationFor(h);drawHeroArt(g,h,x,y,pose,frame,scale);}
