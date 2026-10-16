import {drawCycleWorld} from '../campaigns/machines/cycle-render.js?v=alehall135';
import {drawStoryBackground,drawStoryWorld} from '../campaigns/story/story-render.js?v=alehall135';
import {drawWorld} from './world-render.js?v=alehall135';
import {drawInventoryWorld} from './inventory-render.js?v=alehall135';
import {drawParallax} from './parallax-render.js?v=zoom127';
import {platforms,W,H} from '../core/engine.js?v=alehall135';
import {snapPixel} from './pixel-grid.js?v=menu95';
const image=src=>{const i=new Image();i.src=src+'?v=menu95';return i;};
const art=image('assets/pixel/arcade-pub.png'),arcade=Array.from({length:5},(_,i)=>image('assets/pixel/arcade-background-'+(i+1)+'.png'));
const inventory=Array.from({length:3},(_,i)=>image('assets/pixel/inventory-background-'+(i+1)+'.png'));
const vertical=[9,10].map(i=>image('assets/pixel/depth-near-'+i+'.png')),scenery=image('assets/pixel/parallax-scenes.png');
// Both the live game and its static level cards use this exact scene renderer.
export function drawScene(ctx,s,camera,view,text=()=>{}){
 const box=(c,x,y,w,h)=>{ctx.fillStyle=c;ctx.fillRect(snapPixel(x),snapPixel(y),snapPixel(w),snapPixel(h));};
 if(s.campaign==='cycle'){const cycleArt=drawCycleWorld(ctx,s,camera,view,text);return{cycleArt,ready:cycleArt.ready};}
 if(s.campaign==='story'){const storyBackground=drawStoryBackground(ctx,s,camera,view);drawStoryWorld(ctx,s,text,box);return{storyBackground,ready:storyBackground.ready&&storyBackground.middle.ready};}
 const background=s.round>=9?vertical[s.round-9]:s.round>=6?inventory[s.round-6]:s.round>0?arcade[s.round-1]:art;
 box('#151b27',Math.min(camera.x,0),0,Math.max(W,view.width),790);
 const metadata={ready:false};
 if(background.complete&&background.naturalWidth){
  const parallax=drawParallax(ctx,background,scenery,s.round,camera,view,{time:s.time});
  metadata.parallax=parallax.layers;metadata.backgroundEffects={ready:parallax.effectsReady,poses:parallax.effects};
  metadata.background={round:s.round,source:background.src,crop:parallax.crop,width:Math.max(1440,view.width),height:790};
  metadata.ready=parallax.layers.every(l=>l.ready)&&parallax.effectsReady;
 }
 if(s.round===0)box('#10142466',0,0,W,H);
 drawWorld(ctx,s,platforms,text,box);if(s.round<6)drawInventoryWorld(ctx,s,text,box);
 return metadata;
}
