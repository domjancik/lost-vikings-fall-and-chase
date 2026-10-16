import {orbitRope} from './campaign.js?v=orbit134';
export function orbitCameraFocus(s,fallback){
 if(s.level.mechanic!=='orbit')return fallback;
 if(s.machine.operator!==s.active){const h=s.heroes[s.active];if(h.id===1&&h.magnet?.plateId===0&&(s.machine.plates[0].phase==='orbit'||s.time-(s.machine.lastPawlAt??-10)<.7)){const order=[0,2,3],recent=s.time-(s.machine.lastPawlAt??-10)<.7,n=recent?s.machine.lastSwitch??0:order.find(n=>!s.machine.ropeCut[n])??3,r=orbitRope(s,n);return {...fallback,x:(h.x+r.x)/2,y:(h.y+r.y-22)/2};}if(h.id===1&&h.magnet?.plateId===2&&!s.machine.ropeCut[4])return{...fallback,x:(h.x+2110)/2};return s.machine.hookDocked&&h.id===1&&h.magnet?.plateId===1?{...fallback,x:h.x+100}:fallback;}
 const k=s.machine.hook;return{x:k.x+(k.plateId!==null?90:0),y:k.y-22,vx:k.vx,vy:k.vy};
}

// A narrow portrait view cannot frame a full worker and a remote rope at2x.
// Widen the working view only for magnetic aiming and crane operation.
export function orbitViewport(s,view){if(s.level.mechanic!=='orbit')return view;const h=s.heroes[s.active],working=s.machine.operator===s.active||h.id===1&&h.magnet;if(!working||view.width>=360)return view;const width=360;return{...view,width,height:view.height*width/view.width};}
