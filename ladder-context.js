// Shared by climbing and camera controls: directional actions have priority.
export function ladderAtHero(level,hero){
 return (level.ladders||[]).find(l=>Math.abs(hero.x-l.x)<26&&hero.y+44>=l.top-5&&hero.y+44<=l.bottom+5)||null;
}
