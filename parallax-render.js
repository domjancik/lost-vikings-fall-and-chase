import {drawBackground} from './background-render.js?v=far45';
import {depthScenes,depthLayout} from './background-depth.js?v=far45';
import {snapPixel} from './pixel-grid.js?v=far45';
import {drawBackgroundEffects} from './background-effects.js?v=far45';
const images=new Map();let fxAtlas;function effectAtlas(){if(!fxAtlas){fxAtlas=new Image();fxAtlas.src='assets/pixel/background-fx.png?v=pipeline44';}return fxAtlas;}
function sceneImages(round){if(!images.has(round)){const scene=depthScenes[round],far=new Image(),near=new Image();far.src=scene.farSource+'?v=pipeline44';near.src=scene.nearSource+'?v=pipeline44';images.set(round,{far,near});}return images.get(round);}
const ready=image=>!!image&&(image.naturalWidth===undefined?image.width>0:image.complete&&image.naturalWidth>0);
export function groundedLayer(camera,size,visibleFraction,ground=610){const height=snapPixel(size*visibleFraction),y=snapPixel(ground-camera.y-height);return {y,height,bottom:y+height,ground};}
export function drawParallax(ctx,image,atlas,round,camera,view,assets={}){const {far,near}=assets.far&&assets.near?assets:sceneImages(round),layout=depthLayout(round,camera,view),loaded=ready(far)&&ready(near);ctx.save();ctx.translate(camera.x,camera.y);ctx.globalAlpha=1;let crop;const effects=[],animate=Number.isFinite(assets.time),atlasFx=animate?(assets.effects||effectAtlas()):null;
 if(loaded){crop=drawBackground(ctx,far,layout.far.x,layout.far.y,layout.far.width,layout.far.height);if(animate)effects.push(...drawBackgroundEffects(ctx,round,'far',assets.time,layout,atlasFx));ctx.drawImage(near,layout.near.x,layout.near.y,layout.near.width,layout.near.height);if(animate)effects.push(...drawBackgroundEffects(ctx,round,'near',assets.time,layout,atlasFx));}
 else crop=drawBackground(ctx,image,layout.near.x,layout.near.y,layout.near.width,layout.near.height);
 ctx.restore();return {crop,effects,effectsReady:!!atlasFx&&ready(atlasFx),layers:[{...layout.far,source:far.src,ready:loaded},{...layout.near,source:near.src,ready:loaded,cutout:true,authoredAlpha:true,openings:depthScenes[round].openings,bottom:610-camera.y}],width:layout.far.width,height:790};}
