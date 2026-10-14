export const ROTOR_PHASES=72;
export function rotorFrameIndex(time,power){return power>.05?((Math.floor(time*48)%ROTOR_PHASES)+ROTOR_PHASES)%ROTOR_PHASES:0;}
// Inverse nearest-pixel sampling only. The unchanging housing is never sampled.
// A bounded72-frame cache is populated once at native64x64, never per-screen.
export function rotateNativeRaster(data,width,height,cx,cy,frame){
 const out=new Uint8ClampedArray(data.length),angle=frame*Math.PI*2/ROTOR_PHASES,co=Math.cos(angle),si=Math.sin(angle);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const dx=x-cx,dy=y-cy,sx=Math.round(cx+dx*co+dy*si),sy=Math.round(cy-dx*si+dy*co);
  if(sx<0||sy<0||sx>=width||sy>=height)continue;
  const from=(sy*width+sx)*4,to=(y*width+x)*4;for(let k=0;k<4;k++)out[to+k]=data[from+k];
 }
 return out;
}
