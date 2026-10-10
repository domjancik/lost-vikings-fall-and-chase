// Visual clearance includes the widest glow, door bob and projectile trail.
export const ghostLayout={sourceX:650,y:476,maxX:790};
export const portalBounds=o=>({x:o.x-34,y:o.y-58,w:68,h:104});
export const ghostEyeBounds=()=>({x:ghostLayout.sourceX-28,y:ghostLayout.y-34,w:56,h:62});
export function ghostShotBounds(p){const xs=[p.x,...(p.trail||[]).map(q=>q.x)];return {x:Math.min(...xs)-16,y:p.y-6,w:Math.max(...xs)-Math.min(...xs)+32,h:12};}
export const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
