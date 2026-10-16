import {snapPixel as q} from '../../render/pixel-grid.js';
import {ALEHALL_LOFT} from './layout.js?v=pub147';

export const ALEHALL_WINDOWS=[{x:1192,y:534,w:66,h:38},{x:1512,y:534,w:66,h:38}];
export const alehallCoastPlacement=camera=>({x:q(camera.x*.82-120),y:q(310+camera.y*.35),w:768,h:384});
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
