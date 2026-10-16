import {orbitRaster} from '../orbit/raster.js';

const mounts={
 valve:{origin:[986,512],pivot:[32,34],axis:[1050,580],width:64},
 winch:{origin:[1776,512],pivot:[22,30],axis:[1820,572],width:80},
};
export function sewerWheelMount(kind){return mounts[kind];}
const images=new Map();
function layers(kind){
 if(!images.has(kind))images.set(kind,['fixed','rotor','axle'].map(layer=>{
  const image=new Image();image.src=`assets/sewer141/${kind}-${layer}.png`;return image;
 }));
 return images.get(kind);
}
export function drawSewerWheel(c,kind,pose){
 const m=sewerWheelMount(kind),[fixed,rotor,axle]=layers(kind);
 const ready=[fixed,rotor,axle].every(i=>i.complete&&i.naturalWidth>0);
 if(ready){
  c.drawImage(fixed,...m.origin,m.width*2,128);
  const frame=orbitRaster(rotor,pose*Math.PI*1.5,{size:80,pivotX:m.pivot[0],pivotY:m.pivot[1]});
  if(frame)c.drawImage(frame,m.axis[0]-80,m.axis[1]-80,160,160);
  // The shaft cap and its directional glint stay fixed above the turning spokes.
  c.drawImage(axle,...m.origin,m.width*2,128);
 }
 return{kind:kind==='valve'?'valve':'inspection-winch',x:m.axis[0],y:m.axis[1],axis:m.axis,pivot:m.pivot,origin:m.origin,base:640,sole:640,sourceSole:64,pose,ready};
}
