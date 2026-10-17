export const ALEHALL_LOFT={x:640,y:610,w:260,h:24};
export const ALEHALL_CASK={start:1020,park:840,max:1060,top:706,w:96};
export const ALEHALL_DELIVERY_X=1260;
// Measured props-native cell7: basin opening and front lip in native pixels.
// Ground registration uses its material sole row57, not the64px cell edge.
export const ALEHALL_DRYER={bottom:760,footRow:57,opening:{x:22,y:26,w:20,h:6},front:{x:16,y:31,w:33,h:17}};
export const alehallDryingCups=g=>g.wrapPose<=.5?[]:Array.from({length:3},(_,i)=>({x:ALEHALL_DELIVERY_X-12+i*12,bottom:ALEHALL_DRYER.bottom+(32-ALEHALL_DRYER.footRow)*2,alpha:Math.min(1,(g.wrapPose-.5)*2)}));
