import {snapPixel} from './pixel-grid.js?v=arc46';
import {ladderAtHero} from './ladder-context.js?v=look58';
export function cameraLookDirection(s,input,paused=false,previousLook=0){
 if(paused)return Math.sign(previousLook);
 const h=s.heroes[s.active];
 if(h.swimming||h.climbing||h.dead||ladderAtHero(s.level,h))return 0;
 return Number(!!input.down)-Number(!!input.up);
}
export function cameraTarget(hero,view,level={},look=0){const width=level.worldWidth??1440;return {x:view.width>width?(width-view.width)/2:Math.max(0,Math.min(width-view.width,hero.x+(hero.vx||0)*.12-view.width/2)),y:Math.max(level.worldTop??0,Math.min((level.worldBottom??790)-view.height,hero.y+22-view.height*.57+look*Math.min(180,view.height*.45)))};}
export function parallaxOffsets(camera){return [.22,.55,.82].map((speed,i)=>({layer:i,speed,x:snapPixel(-Math.max(0,camera.x)*speed),y:snapPixel(-camera.y*speed)}));}
