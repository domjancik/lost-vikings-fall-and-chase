export function orbitHeroIndicator(h){
 if(!h.magnetSole)return null;
 const a=h.rotation||0,n={x:Math.sin(a),y:-Math.cos(a)},height=h.id===2&&h.shieldUp?106:86;
 return{x:h.magnetSole.x+n.x*height,y:h.magnetSole.y+n.y*height,angle:a,
  healthX:h.magnetSole.x+n.x*(height+12),healthY:h.magnetSole.y+n.y*(height+12)};
}
