const clamp=t=>Math.max(0,Math.min(1,t));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
// Retained environment cell12: dark aperture at native(31,27), with a
// conservative15-native-pixel clear radius. The rim is rear architecture.
export const SEWER_OUTLET={sprite:{x:3090,y:812},mouth:{x:3152,y:866,radius:30},throat:{x:3164,y:870},captureX:2780,speed:230,depthTravel:120};
export function sewerOutletPoint(t){
 t=clamp(t);const x=2700+520*t-68*t*t,y=770+96*t*t;
 const dx=520-136*t,dy=192*t,length=Math.hypot(dx,dy);
 return{x,y,radius:30-16*smooth((t-.5)*2),tx:dx/length,ty:dy/length};
}
const atX=x=>sewerOutletPoint((520-Math.sqrt(520*520-272*(Math.max(2700,Math.min(3152,x))-2700)))/136);
export function sewerOutletSurface(x){
 let p=atX(x);for(let n=0;n<4;n++)p=atX(x-p.ty*p.radius);
 return p.y-p.tx*p.radius;
}
export function sewerOutletTouches(h){
 if(h.x<SEWER_OUTLET.captureX||h.x>SEWER_OUTLET.mouth.x)return false;
 let p=atX(h.x);for(let n=0;n<4;n++)p=atX(h.x+p.ty*p.radius);
 return h.y+44>=sewerOutletSurface(h.x)&&h.y-28<=p.y+p.tx*p.radius;
}
const samples=Array.from({length:129},(_,i)=>({...sewerOutletPoint(i/128),t:i/128,distance:0}));
for(let i=1;i<samples.length;i++)samples[i].distance=samples[i-1].distance+Math.hypot(samples[i].x-samples[i-1].x,samples[i].y-samples[i-1].y);
export const SEWER_OUTLET_LENGTH=samples.at(-1).distance;
export function sewerOutletAtDistance(distance){
 distance=Math.max(0,Math.min(SEWER_OUTLET_LENGTH,distance));
 const i=Math.max(1,samples.findIndex(p=>p.distance>=distance)),a=samples[i-1],b=samples[i],u=(distance-a.distance)/(b.distance-a.distance);
 return{...sewerOutletPoint(a.t+(b.t-a.t)*u),distance};
}
function startDistance(x){
 const t=(520-Math.sqrt(520*520-272*(Math.max(2700,Math.min(SEWER_OUTLET.mouth.x,x))-2700)))/136;
 const i=Math.min(127,Math.floor(t*128)),u=t*128-i;
 return samples[i].distance+(samples[i+1].distance-samples[i].distance)*u;
}
export function sewerOutletJourney(origin,travel){
 const start=startDistance(origin.x),remaining=SEWER_OUTLET_LENGTH-start;
 // A late jump into the mouth still needs time to tip and settle from its
 // actual arrival pose. Do not jump left or shrink on the capture frame.
 const front=Math.max(110,remaining),total=front+SEWER_OUTLET.depthTravel;
 const distance=Math.min(total,Math.max(0,travel)),p=sewerOutletAtDistance(start+remaining*clamp(distance/front)),depth=clamp((distance-front)/SEWER_OUTLET.depthTravel),sink=smooth(distance/100);
 const center={x:p.x+(SEWER_OUTLET.throat.x-p.x)*smooth(depth),y:(origin.y+8)*(1-sink)+p.y*sink+(SEWER_OUTLET.throat.y-p.y)*smooth(depth)};
 const rotation=(Math.PI/2+Math.atan2(p.ty,p.tx))*smooth(distance/110);
 const approachScale=1-.45*smooth((distance-front+80)/80),scale=depth===1?0:Math.max(1/48,Math.round(approachScale*(1-smooth(depth))*48)/48);
 return{center,rotation,scale,depth,total,travel:distance,done:depth===1,
  sole:{x:center.x-Math.sin(rotation)*36*scale,y:center.y+Math.cos(rotation)*36*scale}};
}
