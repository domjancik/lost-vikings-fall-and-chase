import {snapPixel} from './pixel-grid.js?v=arc46';
export function cameraTarget(hero,view,level={}){const width=level.worldWidth??1440;return {x:view.width>width?(width-view.width)/2:Math.max(0,Math.min(width-view.width,hero.x+(hero.vx||0)*.12-view.width/2)),y:Math.max(level.worldTop??0,Math.min((level.worldBottom??790)-view.height,hero.y+22-view.height*.57))};}
export function parallaxOffsets(camera){return [.22,.55,.82].map((speed,i)=>({layer:i,speed,x:snapPixel(-Math.max(0,camera.x)*speed),y:snapPixel(-camera.y*speed)}));}
