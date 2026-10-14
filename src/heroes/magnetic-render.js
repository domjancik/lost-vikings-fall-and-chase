import {drawHeroArt} from './hero-art.js?v=water114';
import {animationFor} from './sprite-render.js?v=water114';
import {snapPixel} from '../render/pixel-grid.js?v=orbit113';

const sources=new Map(),rotations=new Map(),SIZE=96,CENTER=48;
export const magneticRasterPhase=angle=>((Math.round(angle*180/Math.PI)%360)+360)%360;
function remember(cache,key,value,limit){if(cache.size>=limit)cache.delete(cache.keys().next().value);cache.set(key,value);return value;}
function raster(h,pose,frame,phase){
 const key=[h.id,h.skin,h.face,h.brass,pose,frame].join(':'),rotatedKey=key+':'+phase;
 if(rotations.has(rotatedKey))return rotations.get(rotatedKey);
 let pixels=sources.get(key);
 if(!pixels){
  const c=document.createElement('canvas');c.width=c.height=SIZE;const g=c.getContext('2d');
  g.setTransform(.5,0,0,.5,0,0);g.imageSmoothingEnabled=false;
  drawHeroArt(g,h,CENTER*2,CENTER*2-44,pose,frame);
  pixels=g.getImageData(0,0,SIZE,SIZE);remember(sources,key,pixels,48);
 }
 const c=document.createElement('canvas');c.width=c.height=SIZE;const g=c.getContext('2d'),out=g.createImageData(SIZE,SIZE);
 const a=phase*Math.PI/180,co=Math.cos(a),si=Math.sin(a);
 for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
  const dx=x-CENTER,dy=y-CENTER,sx=Math.round(CENTER+co*dx+si*dy),sy=Math.round(CENTER-si*dx+co*dy);
  if(sx<0||sy<0||sx>=SIZE||sy>=SIZE)continue;
  const from=(sy*SIZE+sx)*4,to=(y*SIZE+x)*4;out.data.set(pixels.data.subarray(from,from+4),to);
 }
 g.putImageData(out,0,0);return remember(rotations,rotatedKey,c,128);
}
// The physics sole and raster pivot are the same point. Rotation never scales
// the actor or interpolates foreground pixels across a contrasting edge.
export function drawMagneticHero(ctx,h){
 const {pose,frame}=animationFor(h),image=raster(h,pose,frame,magneticRasterPhase(h.rotation||0));
 const sole=h.magnetSole;ctx.drawImage(image,snapPixel(sole.x-CENTER*2),snapPixel(sole.y-CENTER*2),SIZE*2,SIZE*2);
}
