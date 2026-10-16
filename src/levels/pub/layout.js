export const ALEHALL_LOFT={x:640,y:610,w:260,h:24};
export const ALEHALL_CASK={start:1440,park:1260,max:1468,top:706,w:96};
export const ALEHALL_DELIVERY_X=1550;
// The complete loading berth follows its cask, away from the loft approach.
export const alehallBerthSteps=[[-120,748,36],[-96,734,24],[-72,720,24],[48,720,24],[72,734,24],[84,748,36]].map(([dx,y,w])=>({x:ALEHALL_CASK.park+dx,y,w}));
