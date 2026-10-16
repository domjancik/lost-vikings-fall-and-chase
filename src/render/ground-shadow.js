import {alehallSurfaces} from '../levels/pub/campaign.js?v=pub151';
// Project beneath the feet onto the closest solid terrain, never onto a fixed offset from the sprite.
export function groundShadow(state,hero,pubPlatforms){
 let surfaces=state.campaign==='arcade'&&state.round===0?[{x:0,y:610,w:1440},...pubPlatforms]:[...state.level.floors,...state.level.platforms];
 if(state.level.mechanic==='cargo')surfaces.push({x:500,y:state.machine.liftY,w:180});
 if(state.campaign==='cycle'){if(state.machine.carrier)surfaces.push(state.machine.carrier);if(state.level.mechanic==='water')surfaces.push({x:state.machine.float.x-82,y:state.machine.waterY-12,w:164});if(state.level.mechanic==='clockwork')surfaces.push(state.machine.counter);}
 if(state.campaign==='story')surfaces.push(...state.machine.lifts.map(l=>({x:l.x,y:l.y,w:l.w})));
 if(state.level.mechanic==='alehall')surfaces=alehallSurfaces(state);
 const feet=hero.y+44;
 const below=surfaces.filter(p=>hero.x>=p.x&&hero.x<=p.x+p.w&&p.y>=feet-2).sort((a,b)=>a.y-b.y)[0];
 if(!below)return null;
 const height=Math.max(0,below.y-feet);
 return {x:hero.x,y:below.y,radius:Math.max(7,17-height*.025),opacity:Math.max(.12,.34-height*.0005)};
}
