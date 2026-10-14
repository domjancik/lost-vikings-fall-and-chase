import {rotateNativeRaster} from '../freight/rotor.js?v=orbit113';
export const orbitPhase=a=>((Math.round(a*180/Math.PI)%360)+360)%360;
const images=new WeakMap();
// Small object rasters only; no viewport-sized rotation or repeated readback.
export function orbitRaster(image,angle,{size,pivotX,pivotY,crop,brightness=1}={}){
 if(!image.complete||!image.naturalWidth)return null;
 let entry=images.get(image);const key=JSON.stringify({size,pivotX,pivotY,crop,brightness});
 if(!entry||entry.key!==key){
  const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  if(crop)g.drawImage(image,...crop,size/2-pivotX,size/2-pivotY,crop[2],crop[3]);
  else g.drawImage(image,size/2-pivotX,size/2-pivotY);
  entry={key,data:g.getImageData(0,0,size,size),frames:new Map()};images.set(image,entry);
 }
 const phase=orbitPhase(angle);if(entry.frames.has(phase))return entry.frames.get(phase);
 const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');
 const pixels=rotateNativeRaster(entry.data.data,size,size,size/2,size/2,phase/5);
 if(brightness!==1)for(let i=0;i<pixels.length;i+=4)for(let k=0;k<3;k++)pixels[i+k]=Math.round(pixels[i+k]*brightness);
 g.putImageData(new ImageData(pixels,size,size),0,0);
 if(entry.frames.size>=8)entry.frames.delete(entry.frames.keys().next().value);entry.frames.set(phase,c);return c;
}
