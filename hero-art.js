import {heroAnimationCell,HERO_CELL,HERO_ORIGIN} from './hero-frames.js?v=skins73';
import {shieldTransform} from './hero-geometry.js?v=vikings70';
import {snapPixel} from './pixel-grid.js?v=arc46';

const sheets=[],locomotion=[];let shield;
let selectedSkin='current';
export function setHeroSkin(skin){selectedSkin=skin==='previous'?'previous':'current';}
function ensureLoaded(){
 if(sheets.length)return;
 for(const name of ['erik','baleog','olaf'])sheets.push(load(`assets/vikings63/${name}.png`));
 for(const name of ['erik','baleog','olaf'])locomotion.push(load(`assets/vikings70/${name}.png`));
 shield=load('assets/vikings63/shield.png');
}
function load(src){
 const image=new Image();
 const promise=new Promise((resolve,reject)=>{image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(`Character asset failed: ${src}`));});
 image.src=src;return {image,promise};
}
export const heroesReady=()=>sheets.length===3&&[...sheets,...locomotion,shield].every(a=>a.image.complete&&a.image.naturalWidth);
export const whenHeroesReady=()=>{ensureLoaded();return Promise.all([...sheets,...locomotion,shield].map(a=>a.promise));};
const brass=new Map();let shieldData;
function bronze(image){
 if(brass.has(image))return brass.get(image);
 const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
 const g=c.getContext('2d'),p=(g.drawImage(image,0,0),g.getImageData(0,0,c.width,c.height));
 for(let n=0;n<p.data.length;n+=4){const v=p.data[n]*.3+p.data[n+1]*.6+p.data[n+2]*.1;
  if(v>35){p.data[n]=Math.min(255,v*1.18+18);p.data[n+1]=v*.91+7;p.data[n+2]=v*.55;}}
 g.putImageData(p,0,0);brass.set(image,c);return c;
}
function drawShield(ctx,h,pose,frame){
 if(!shieldData){const c=document.createElement('canvas');c.width=14;c.height=24;const g=c.getContext('2d');g.drawImage(shield.image,0,0);shieldData=g.getImageData(0,0,14,24).data;}
 const t=shieldTransform(h,pose,frame),cos=Math.cos(t.angle),sin=Math.sin(t.angle);
 // Inverse sample the same authored shield for every orientation on the world grid.
 for(let yy=-36;yy<=36;yy+=2)for(let xx=-36;xx<=36;xx+=2){
  const u=Math.floor((cos*xx+sin*yy+t.width/2)/2),v=Math.floor((-sin*xx+cos*yy+t.height/2)/2);
  if(u<0||u>=14||v<0||v>=24)continue;const n=(v*14+u)*4;
  if(!shieldData[n+3])continue;
  ctx.fillStyle=`rgb(${shieldData[n]},${shieldData[n+1]},${shieldData[n+2]})`;
  ctx.fillRect(snapPixel(t.x+xx),snapPixel(t.y+yy),2,2);
 }
}
export function drawHeroArt(ctx,h,x,y,pose,frame,scale=1){
 ensureLoaded();
 if(!heroesReady())return;
 const {cell,cols,sheet}=heroAnimationCell({...h,skin:h.skin||selectedSkin},pose,frame);
 ctx.save();ctx.translate(scale===1?snapPixel(x):x,scale===1?snapPixel(y):y);
 ctx.scale((h.face||1)*scale,scale);ctx.imageSmoothingEnabled=false;
 const source=sheet==='locomotion'?locomotion[h.id].image:sheets[h.id].image;
 const image=h.brass?bronze(source):source;
 ctx.drawImage(image,cell%cols*HERO_CELL,Math.floor(cell/cols)*HERO_CELL,HERO_CELL,HERO_CELL,
  -HERO_ORIGIN.x*2,-HERO_ORIGIN.y*2,HERO_CELL*2,HERO_CELL*2);
 // The opaque shield face covers the gripping palm in front as well as overhead.
 if(h.id===2)drawShield(ctx,h,pose,frame);
 ctx.restore();
}

