import {heroAnimationCell,HERO_CELL,HERO_ORIGIN} from './hero-frames.js?v=trial82';
import {imagegen81} from './imagegen81-registration.js?v=trial82';
import {shieldTransform} from './hero-geometry.js?v=vikings70';
import {snapPixel} from '../render/pixel-grid.js?v=arc46';
import {drawProceduralHeroArt} from './hero-procedural.js?v=skins76';
import {normalizeSkin} from './hero-skins.js?v=trial82';

const sheets=[],locomotion=[],trial=[],native85=[],imagegen88=[],imagegen90=[];let shield;
let selectedSkin='current';
export function setHeroSkin(skin){selectedSkin=normalizeSkin(skin);if(selectedSkin==='imagegen88')ensureImagegen88();if(selectedSkin==='imagegen90')ensureImagegen90();}
function ensureImagegen88(){if(imagegen88.length)return;for(const name of ['erik','baleog','olaf'])imagegen88.push(load(`assets/vikings88/${name}-native.png`));}
function ensureImagegen90(){if(imagegen90.length)return;for(const name of ['erik','baleog','olaf'])imagegen90.push(load(`assets/vikings90/${name}-native.png`));}
function ensureLoaded(){
 if(sheets.length)return;
 for(const name of ['erik','baleog','olaf'])sheets.push(load(`assets/vikings63/${name}.png`));
 for(const name of ['erik','baleog','olaf'])locomotion.push(load(`assets/vikings70/${name}.png`));
 for(const art of imagegen81)trial.push(load(art.path));
 for(const name of ['erik','baleog','olaf'])native85.push(load(`assets/vikings85-native/${name}-native.png`));
 shield=load('assets/vikings63/shield.png');
}
function load(src){
 const image=new Image();
 const promise=new Promise((resolve,reject)=>{image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(`Character asset failed: ${src}`));});
 image.src=src;return {image,promise};
}
const selectedGenerated=()=>selectedSkin==='imagegen90'?imagegen90:selectedSkin==='imagegen88'?imagegen88:[];
export const heroesReady=()=>sheets.length===3&&[...sheets,...locomotion,...trial,...native85,shield,...selectedGenerated()].every(a=>a.image.complete&&a.image.naturalWidth);
export const whenHeroesReady=()=>{ensureLoaded();if(selectedSkin==='imagegen88')ensureImagegen88();if(selectedSkin==='imagegen90')ensureImagegen90();return Promise.all([...sheets,...locomotion,...trial,...native85,shield,...selectedGenerated()].map(a=>a.promise));};
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
 if((h.skin||selectedSkin)==='procedural'){drawProceduralHeroArt(ctx,h,x,y,pose,frame,scale);return;}
 ensureLoaded();
 if((h.skin||selectedSkin)==='imagegen88'){ensureImagegen88();if(!imagegen88.every(a=>a.image.complete&&a.image.naturalWidth))return;}
 if((h.skin||selectedSkin)==='imagegen90'){ensureImagegen90();if(!imagegen90.every(a=>a.image.complete&&a.image.naturalWidth))return;}
 if(!heroesReady())return;
 const {cell,cols,sheet}=heroAnimationCell({...h,skin:h.skin||selectedSkin},pose,frame);
 ctx.save();ctx.translate(scale===1?snapPixel(x):x,scale===1?snapPixel(y):y);
 ctx.scale((h.face||1)*scale,scale);ctx.imageSmoothingEnabled=false;
 if(sheet==='imagegen81'){
  const r=imagegen81[h.id].cells[cell],source=trial[h.id].image;
  ctx.drawImage(h.brass?bronze(source):source,r.sx,r.sy,r.sw,r.sh,r.dx,r.dy,r.dw,r.dh);
  // Olaf's generated front shield is already part of this frame.
  ctx.restore();return;
 }
 const source=sheet==='imagegen90'?imagegen90[h.id].image:sheet==='imagegen88'?imagegen88[h.id].image:sheet==='native85'?native85[h.id].image:sheet==='locomotion'?locomotion[h.id].image:sheets[h.id].image;
 const image=h.brass?bronze(source):source;
 const generated=['imagegen88','imagegen90'].includes(sheet),size=generated?80:HERO_CELL,origin=generated?{x:40,y:48}:HERO_ORIGIN;
 ctx.drawImage(image,cell%cols*size,Math.floor(cell/cols)*size,size,size,
  -origin.x*2,-origin.y*2,size*2,size*2);
 // The opaque shield face covers the gripping palm in front as well as overhead.
 if(h.id===2&&!['native85','imagegen88','imagegen90'].includes(sheet))drawShield(ctx,h,pose,frame);
 ctx.restore();
}

