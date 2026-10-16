export const ALEHALL_LOFT={x:640,y:610,w:260,h:24};
export const ALEHALL_CASK={start:1020,park:840,max:1060,top:706,w:96};
export const ALEHALL_DELIVERY_X=1260;
// Open packing stand beside the hearth, safely clear of its stone/fire recess.
export const alehallDryingCups=g=>g.wrapPose<=.5?[]:Array.from({length:3},(_,i)=>({x:ALEHALL_DELIVERY_X-16+i*16,bottom:724,alpha:Math.min(1,(g.wrapPose-.5)*2)}));
