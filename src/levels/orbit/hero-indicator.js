const snap=n=>Math.round(n/2)*2;
export function magneticSoles(h){const a=h.rotation||0,c=Math.cos(a),s=Math.sin(a),sole=h.magnetSole||{x:h.x,y:h.y+44};return [-1,1].map(side=>({side,x:sole.x+side*9*c,y:sole.y+side*9*s,tx:c,ty:s}));}
export function soleIndicatorPixels(h){return magneticSoles(h).flatMap(p=>[-3,-1,1,3].map(d=>({x:snap(p.x+d*p.tx-1),y:snap(p.y+d*p.ty-1)})));}
export function orbitHeroIndicator(h){
 if(!h.magnetSole)return null;
 const a=h.rotation||0,n={x:Math.sin(a),y:-Math.cos(a)},cx=h.x??h.magnetSole.x+n.x*22,cy=h.y===undefined?h.magnetSole.y+n.y*22:h.y+22,height=h.shieldUp?80:68;
 return{x:cx+n.x*height,y:cy+n.y*height,angle:a,healthX:cx+n.x*60,healthY:cy+n.y*60};
}
