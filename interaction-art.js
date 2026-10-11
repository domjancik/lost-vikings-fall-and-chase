import {createAtlas} from './sprite-atlas.js?v=arc46';
import {interactionFrame} from './interaction-frames.js?v=ground51';
const atlas=createAtlas('assets/ground51/interaction-frames.png?v=ground51',8,4);
export function drawInteractionArt(ctx,kind,pose,x,bottom){
 if(!atlas.image.complete||!atlas.image.naturalWidth)return false;
 atlas.draw(ctx,interactionFrame(kind,pose),x-24,bottom-64,48,64);
 return true;
}
