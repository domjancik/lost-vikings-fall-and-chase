import {orbitHeroIndicator,soleIndicatorPixels} from '../levels/orbit/hero-indicator.js?v=orbit117';
const colors=['#db6b3d','#69b5b2','#dfb952'];
// World-space feedback is composited after water/laser/stomp refraction. It
// must never become part of the scene texture sampled by those optical passes.
export function drawHeroFeedback(s,box,text){
 for(const h of s.heroes){
  if(h.sweptAway)continue;
  if(h.boots)for(const p of soleIndicatorPixels(h))box(h.magnet?'#b7e7df':'#669ba9',p.x,p.y,2,2);

  const badge=orbitHeroIndicator(h);
  if(h.id===s.active)text('▼',badge?.x??h.x,badge?.y??h.y-(h.shieldUp?58:46),colors[h.id],13,badge?.angle??0);
  for(let n=0;n<3;n++)box(n<h.hp?colors[h.id]:'#514953',(badge?.healthX??h.x)-10+n*8,badge?.healthY??h.y-38,5,3);
 }
}
