import {damage} from './health.js?v=arc46';
import {segmentHit,shieldHit} from './projectile-collision.js?v=arc46';
export function makeEnemy(x,floor,left,right,kind='sentry'){return {x,y:floor-44,left,right,kind,face:-1,hp:kind==='wraith'?1:2,speed:kind==='crawler'?48:66,phase:x*.013,shotAt:3+x/2000,hurt:0};}
export function hurtEnemy(s,e,amount=1){if(e.hp<=0||e.hurt>0)return false;e.hp=Math.max(0,e.hp-amount);e.hurt=.2;e.hitAt=s.time;if(!e.hp){e.deadAt=s.time;s.combat={time:s.time,x:e.x};}return true;}
export function updateEnemies(s,dt,walls){for(const e of s.enemies){e.hurt=Math.max(0,e.hurt-dt);if(e.hp<=0)continue;
 const target=s.heroes.filter(h=>!h.dead&&Math.abs(h.y-e.y)<100).sort((a,b)=>Math.abs(a.x-e.x)-Math.abs(b.x-e.x))[0];
 const aiming=target&&Math.abs(target.x-e.x)<430&&s.time>e.shotAt-.45;
 if(aiming)e.face=target.x<e.x?-1:1;else{e.x+=e.face*e.speed*dt;if(e.x<=e.left||e.x>=e.right){e.x=Math.max(e.left,Math.min(e.right,e.x));e.face*=-1;}}
 for(const w of walls)if(w.on&&e.y+44>w.top&&e.y<(w.bottom??Infinity)&&e.x+20>w.x&&e.x-20<w.x+w.w){e.x=e.face>0?w.x-20:w.x+w.w+20;e.face*=-1;}
 if(aiming&&s.time>=e.shotAt){s.shots.push({kind:e.kind==='wraith'?'ghost':'bolt',x:e.x+e.face*24,y:e.y+20,v:e.face*210,enemy:true});e.shotAt=s.time+2.3;}
 for(const h of s.heroes)if(Math.abs(h.x-e.x)<30&&Math.abs(h.y-e.y)<42){const o=s.heroes[2],hit=shieldHit(o,{x:h.x,y:h.y+20,v:(h.x-e.x)||e.face},e.x,e.y+20);if(!hit)damage(s,h);}
 }}
export function nearestEnemyHit(s,p,px,py){return s.enemies.filter(e=>e.hp>0).map(e=>({e,hit:segmentHit(px,py,p.x,p.y,{x:e.x-20,y:e.y,w:40,h:44})})).filter(v=>v.hit).sort((a,b)=>a.hit.t-b.hit.t)[0];}
