import {snapPixel as q} from '../../render/pixel-grid.js';
import {ALEHALL_LOFT} from './layout.js?v=pub147';

export const ALEHALL_WINDOWS=[{x:1192,y:534,w:66,h:38},{x:1512,y:534,w:66,h:38}];
export const alehallCoastPlacement=camera=>({x:q(camera.x*.82-120),y:q(310+camera.y*.35),w:768,h:384});
export function alehallSkyPlacement(camera,view){const far=alehallCoastPlacement(camera),x=Math.floor(camera.x/2)*2,y=Math.min(Math.floor(camera.y/2)*2,far.y);return{x,y,w:Math.ceil((camera.x+view.width-x)/2)*2,h:far.y+2-y,pixel:2};}
export function alehallSkyPixels(edge,width,height=64){
 const pixels=new Uint8ClampedArray(width*height*4),tone=[0,0,0];
 for(let x=0;x<width;x++)for(let k=0;k<3;k++)tone[k]+=edge[x*4+k]/width;
 // Broaden cloud tones as they recede upward. Copying each edge pixel straight
 // upward creates visible vertical columns; the exact join row stays untouched.
 for(let y=0;y<height;y++){const t=y/(height-1),blend=t*t*(3-2*t),radius=Math.round((1-t)*width/4);for(let x=0;x<width;x++){const i=(y*width+x)*4;for(let k=0;k<3;k++){let value=0;for(let dx=-radius;dx<=radius;dx++){const wrapped=((x+dx)%(width*2)+width*2)%(width*2),sample=wrapped<width?wrapped:width*2-1-wrapped;value+=edge[sample*4+k];}value/=radius*2+1;pixels[i+k]=Math.round(tone[k]+(value-tone[k])*blend);}pixels[i+3]=255;}}
 return pixels;
}
let skySource=null,skyCanvas=null;
export function drawAlehallSky(c,image,camera,view){
 if(!image.complete||!image.naturalWidth)return;
 if(skySource!==image){skyCanvas=document.createElement('canvas');skyCanvas.width=image.naturalWidth;skyCanvas.height=64;const g=skyCanvas.getContext('2d');g.drawImage(image,0,0);const edge=g.getImageData(0,0,skyCanvas.width,1).data;g.putImageData(new ImageData(alehallSkyPixels(edge,skyCanvas.width),skyCanvas.width,64),0,0);skySource=image;}
 const p=alehallSkyPlacement(camera,view),far=alehallCoastPlacement(camera),g=skyCanvas.getContext('2d'),tone=g.getImageData(0,0,1,1).data;
 c.fillStyle=`rgb(${tone[0]},${tone[1]},${tone[2]})`;c.fillRect(p.x,p.y,p.w,p.h);c.imageSmoothingEnabled=false;
 for(let col=Math.floor((p.x-far.x)/far.w);col<=Math.floor((p.x+p.w-far.x)/far.w);col++){const flip=Math.abs(col)%2===1;c.save();c.translate(far.x+col*far.w+(flip?far.w:0),far.y-126);c.scale(flip?-1:1,1);c.drawImage(skyCanvas,0,0,far.w,128);c.restore();}
 return p;
}
export function alehallWindowScenery(camera){
 const far=alehallCoastPlacement(camera);
 return ALEHALL_WINDOWS.map(opening=>{
  const tiles=[];
  for(let row=Math.floor((opening.y-far.y)/far.h);row<=Math.floor((opening.y+opening.h-1-far.y)/far.h);row++)
   for(let col=Math.floor((opening.x-far.x)/far.w);col<=Math.floor((opening.x+opening.w-1-far.x)/far.w);col++)
    tiles.push({x:far.x+col*far.w,y:far.y+row*far.h,w:far.w,h:far.h,flipX:Math.abs(col)%2===1,flipY:Math.abs(row)%2===1});
  return{opening,tiles};
 });
}
export function drawAlehallWindowScenery(c,image,camera){
 const groups=alehallWindowScenery(camera);
 if(!image.naturalWidth)return groups;
 for(const {opening,tiles}of groups){
  c.save();c.beginPath();c.rect(opening.x,opening.y,opening.w,opening.h);c.clip();c.imageSmoothingEnabled=false;
  // Reflect only the continuation beyond the retained scene. Shared world
  // anchoring keeps both windows on one panorama; exterior pixels are untouched.
  for(const t of tiles){c.save();c.translate(t.x+(t.flipX?t.w:0),t.y+(t.flipY?t.h:0));c.scale(t.flipX?-1:1,t.flipY?-1:1);c.drawImage(image,0,0,t.w,t.h);c.restore();}
  c.restore();
 }
 return groups;
}
export const alehallLoftBacking=()=>({x:ALEHALL_LOFT.x+20,y:ALEHALL_LOFT.y+ALEHALL_LOFT.h,w:ALEHALL_LOFT.w-44,h:760-ALEHALL_LOFT.y-ALEHALL_LOFT.h,collision:false,attachment:'rear of loft posts, underside and room floor'});

// Cutaway partition above the storeroom door. Its lower edge is the lintel,
// not an invisible obstacle across the walking opening.
export const alehallRoomPartition=()=>({
 header:{x:1680,y:480,w:720,h:166},
 doorway:{x:1708,y:646,w:72,h:114},
 shadow:{x:1774,y:646,w:626,h:142,threshold:64,floor:760},
 collision:false
});
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function alehallRoomShade(x,y){
 const p=alehallRoomPartition().shadow;
 if(x<p.x||x>=p.x+p.w||y<p.y||y>=p.y+p.h)return 0;
 return smooth((x-p.x)/p.threshold)*(1-smooth((y-p.floor)/(p.y+p.h-p.floor)));
}
