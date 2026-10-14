export function orbitCameraFocus(s,fallback){
 if(s.level.mechanic!=='orbit'||s.machine.operator!==s.active)return fallback;
 const k=s.machine.hook;return{x:k.x,y:k.y-22,vx:k.vx,vy:k.vy};
}
