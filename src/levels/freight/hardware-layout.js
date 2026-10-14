// Authored native contacts, measured after accepted presentation normalization.
export const FREIGHT_HARDWARE={
 fan:{native:[64,64],base:60,seat:[32,31],feed:[4,48],radius:19},
 burner:{native:[48,64],base:56,mouth:[8,44],feed:[40,31],hotRect:[4,39,10,11]}
};
export function fanPlacement(x,floor){const a=FREIGHT_HARDWARE.fan;return{x:x-a.seat[0]*2,y:floor-a.base*2,w:128,h:128,base:floor,hub:[x,floor+(a.seat[1]-a.base)*2],feed:[x+(a.feed[0]-a.seat[0])*2,floor+(a.feed[1]-a.base)*2]};}
export function burnerPlacement(portX,floor){const a=FREIGHT_HARDWARE.burner;return{x:portX-a.mouth[0]*2,y:floor-a.base*2,w:96,h:128,base:floor,port:[portX,floor+(a.mouth[1]-a.base)*2],feed:[portX+(a.feed[0]-a.mouth[0])*2,floor+(a.feed[1]-a.base)*2]};}
export function freightFanFeedRoute(){const port=fanPlacement(1660,640).feed;return[[1610,600],[1660,600],[1660,664],[port[0],664],port];}
export function freightBurnerFeedRoute(){const port=burnerPlacement(2530,360).feed;return[[2318,150],[2380,150],[2380,port[1]],port];}
