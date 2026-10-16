import {drawSewerDarkness} from '../levels/sewer/render.js?v=sewer145';
import {createState} from '../core/engine.js?v=sewer145';
import {drawScene} from '../render/scene-render95.js?v=sewer145';
import {drawWaterOverlay} from '../levels/water/render.js?v=water142';
import {previewFrame} from './campaign-picker.js?v=sewer145';
import {campaignFamily} from './campaign-progress.js?v=campaign137';
const cache=new Map();
// These are the production scene atlases, shared by the browser's image cache.
// Explicit readiness prevents a slow connection from freezing a partial shot.
const atlases=['terrain48/terrain','ground51/interaction-frames','campaign46/machines',
 'pixel/foreground-tiles','pixel/world-objects','pixel/puzzle-machines','pixel/inventory-sprites',
 'pixel/machine-states','pixel/background-fx','pixel/vertical-props'].map(path=>{
 const image=new Image();image.src='assets/'+path+'.png?v=menu95';return image;
});
// Isolated initial state: no simulation, controls, sound or mutation of the live game.
export function levelPreview(campaign,round){
 const key=campaign+':'+round;if(cache.has(key))return cache.get(key);
 const state=createState(round,campaignFamily(campaign)),frame=previewFrame(state),canvas=document.createElement('canvas');
 canvas.width=frame.width/2;canvas.height=frame.height/2;canvas.setAttribute('aria-hidden','true');
 const result={canvas,ready:false};cache.set(key,result);let attempts=0,loadedAt=0;
 function paint(){
  const ctx=canvas.getContext('2d');ctx.setTransform(.5,0,0,.5,-frame.x/2,-frame.y/2);ctx.imageSmoothingEnabled=false;
  const metadata=drawScene(ctx,state,frame,frame);drawWaterOverlay(ctx,state);drawSewerDarkness(ctx,state,frame,frame);
  if(metadata.ready&&atlases.every(i=>i.complete&&i.naturalWidth)&&!loadedAt)loadedAt=performance.now();
  // Repaint after scene loads so dependent atlas onload handlers have also settled.
  if(loadedAt&&performance.now()-loadedAt>=500){result.ready=true;canvas.dataset.ready='true';return;}
  if(++attempts<300)setTimeout(paint,100);else{result.failed=true;canvas.dataset.ready='failed';cache.delete(key);}
 }
 paint();return result;
}
