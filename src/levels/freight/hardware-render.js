import {rotateNativeRaster,rotorFrameIndex} from './rotor.js?v=orbit113';
import {FREIGHT_HARDWARE as ART,fanPlacement,burnerPlacement} from './hardware-layout.js?v=orbit113';
const load=name=>{const image=new Image();image.src='assets/freight112/'+name+'-native.png?v=freight112';return image;};
const housing=load('fan-housing'),rotor=load('fan-rotor'),burner=load('burner-body'),mouth=load('burner-mouth');
const rotorFrames=new Map();let rotorData=null;
function rotorFrame(frame){
 if(!rotor.complete||!rotor.naturalWidth)return null;
 if(rotorFrames.has(frame))return rotorFrames.get(frame);
 if(!rotorData){const source=document.createElement('canvas');source.width=source.height=64;const g=source.getContext('2d');g.drawImage(rotor,0,0);rotorData=g.getImageData(0,0,64,64).data;}
 const a=ART.fan,data=rotateNativeRaster(rotorData,64,64,...a.seat,frame);
 // Blades behind the fixed iron aperture are occluded on the native raster.
 for(let y=0;y<64;y++)for(let x=0;x<64;x++)if((x-a.seat[0])**2+(y-a.seat[1])**2>a.radius**2)data[(y*64+x)*4+3]=0;
 const result=document.createElement('canvas');result.width=result.height=64;result.getContext('2d').putImageData(new ImageData(data,64,64),0,0);rotorFrames.set(frame,result);return result;
}
export function drawFreightFan(ctx,s,x,floor,power){
 ctx.imageSmoothingEnabled=false;
 const p=fanPlacement(x,floor),frame=rotorFrameIndex(s.time,power),r=rotorFrame(frame);
 if(housing.complete&&housing.naturalWidth)ctx.drawImage(housing,p.x,p.y,p.w,p.h);
 if(r)ctx.drawImage(r,p.x,p.y,p.w,p.h);
 return{kind:'fan',x,bottom:floor,hub:p.hub,feed:p.feed,frame,housingStable:true,native:ART.fan.native};
}
export function drawFreightBurner(ctx,s,x,floor,warning,firing){
 ctx.imageSmoothingEnabled=false;
 const p=burnerPlacement(x,floor),a=ART.burner;
 if(burner.complete&&burner.naturalWidth)ctx.drawImage(burner,p.x,p.y,p.w,p.h);
 if((warning||firing)&&mouth.complete&&mouth.naturalWidth){const [rx,ry,rw,rh]=a.hotRect;ctx.save();ctx.globalAlpha*=firing?1:.35+.25*Math.sin(s.time*10)**2;ctx.drawImage(mouth,p.x+rx*2,p.y+ry*2,rw*2,rh*2);ctx.restore();}
 return{kind:'burner',x,port:p.port,feed:p.feed,bottom:p.base,mount:x+52,floor,warning,firing,native:a.native};
}
export function freightHardwareReady(){return[housing,rotor,burner,mouth].every(image=>image.complete&&image.naturalWidth);}
