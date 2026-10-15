import {snapPixel} from '../../render/pixel-grid.js';
// One texel is one native pixel (two world units). These caches are never read back.
export const FOG_WIDTH=640,FOG_HEIGHT=384;
const wrap=(n,size)=>(n%size+size)%size;
const smooth=t=>t*t*(3-2*t);
function random(x,y,seed){let n=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(seed,1442695041);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function noise(x,y,nx,ny,seed){const ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy),at=(a,b)=>random(wrap(a,nx),wrap(b,ny),seed);const a=at(ix,iy)*(1-fx)+at(ix+1,iy)*fx,b=at(ix,iy+1)*(1-fx)+at(ix+1,iy+1)*fx;return a*(1-fy)+b*fy;}
export function fogPixel(x,y,seed=7){
 y=wrap(y,FOG_HEIGHT);x=wrap(x+Math.sin(y/FOG_HEIGHT*Math.PI*2)*40,FOG_WIDTH);
 let density=0;for(const [nx,ny,weight]of [[4,3,.58],[8,6,.27],[16,12,.11],[32,24,.04]])density+=noise(x/FOG_WIDTH*nx,y/FOG_HEIGHT*ny,nx,ny,seed+nx)*weight;
 const shade=Math.round(Math.max(0,Math.min(1,(density-.22)*1.9))*12);
 return [5+shade,9+shade*2,13+shade*2,255];
}
export function fogOffset(time,layer){return {x:snapPixel(time*(layer?-2:3)),y:snapPixel(time*(layer?.65:-.4))};}
const textures=[];
function texture(layer){if(textures[layer])return textures[layer];const canvas=document.createElement('canvas');canvas.width=FOG_WIDTH;canvas.height=FOG_HEIGHT;const c=canvas.getContext('2d'),pixels=c.createImageData(FOG_WIDTH,FOG_HEIGHT);for(let y=0;y<FOG_HEIGHT;y++)for(let x=0;x<FOG_WIDTH;x++)pixels.data.set(fogPixel(x,y,layer?29:7),(y*FOG_WIDTH+x)*4);c.putImageData(pixels,0,0);textures[layer]=canvas;return canvas;}
export function drawSewerFog(c,camera,width,height,time){
 const w=FOG_WIDTH*2,h=FOG_HEIGHT*2,offsets=[];c.save();c.imageSmoothingEnabled=false;
 for(let layer=0;layer<2;layer++){const image=texture(layer),offset=fogOffset(time,layer);offsets.push(offset);c.globalAlpha=layer?.3:1;const left=Math.floor((camera.x-offset.x)/w)*w+offset.x,top=Math.floor((camera.y-offset.y)/h)*h+offset.y;for(let y=top;y<camera.y+height;y+=h)for(let x=left;x<camera.x+width;x+=w)c.drawImage(image,x,y,w,h);}
 c.restore();return {layers:2,native:[FOG_WIDTH,FOG_HEIGHT],offsets,opaque:true,readbacks:0};
}
