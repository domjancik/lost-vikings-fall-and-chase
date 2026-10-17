import {sewerGlobeIntro} from '../levels/sewer/globe.js?v=sewer136';

export function cinematicHudHidden(s,arrival=null,completion=null){
 return !!arrival||!!completion||(s.level.mechanic==='alehall'&&['inspect','crack','fall'].includes(s.machine.phase))||sewerGlobeIntro(s);
}
export function syncCinematicHud(root,hidden){
 root.classList.toggle('cinematic',hidden);
 for(const element of root.querySelectorAll('.below,.mobile-controls,.game-bottom')){
  element.inert=hidden; // Hidden touch/crew controls must also leave keyboard focus.
  if(hidden)element.setAttribute('aria-hidden','true');else element.removeAttribute('aria-hidden');
 }
}
