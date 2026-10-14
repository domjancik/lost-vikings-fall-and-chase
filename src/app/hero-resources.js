import {WATER_AIR} from '../levels/water/campaign.js?v=water83';
import {WARDEN_BRACE_LIMIT} from '../levels/warden/campaign.js?v=warden104';
const clamp=(n,max)=>Math.max(0,Math.min(max,n));
export function heroResource(s,id){
 const h=s.heroes[id];if(!h||h.dead)return null;
 if(s.level.mechanic==='water'){
  const remaining=clamp(h.air??WATER_AIR,WATER_AIR);
  return{kind:'air',label:'AIR',remaining,max:WATER_AIR,ratio:remaining/WATER_AIR,critical:remaining<=3};
 }
 if(s.level.mechanic==='warden'&&id===2&&!s.machine.disabled){
  const g=s.machine;
  if(g.fatigue>0)return{kind:'recover',label:'REST',remaining:g.fatigue,max:2,ratio:1-clamp(g.fatigue,2)/2,critical:false};
  const remaining=clamp(WARDEN_BRACE_LIMIT-(g.braced?g.braceAge:0),WARDEN_BRACE_LIMIT);
  return{kind:'strength',label:'STR',remaining,max:WARDEN_BRACE_LIMIT,ratio:remaining/WARDEN_BRACE_LIMIT,critical:g.braced&&remaining<=4};
 }
 return null;
}
export function mountHeroResource(card){
 const meter=document.createElement('span');meter.className='hero-resource';meter.hidden=true;
 meter.innerHTML='<span class="resource-label"></span><span class="resource-track"><span class="resource-fill"></span></span><span class="resource-seconds"></span>';
 meter.setAttribute('role','meter');card.append(meter);return meter;
}
export const resourcePaintKey=r=>[r.kind,Math.ceil(r.remaining),r.remaining.toFixed(1),r.ratio.toFixed(2),r.critical].join(':');
export function updateHeroResource(s,id,card){
 const meter=card.querySelector('.hero-resource'),r=heroResource(s,id);meter.hidden=!r;card.classList.toggle('has-resource',!!r);
 card.parentElement.classList.toggle('has-resources',s.level.mechanic==='water'||s.level.mechanic==='warden');
 if(!r){delete meter.dataset.kind;delete meter.dataset.paint;return;}
 const paint=resourcePaintKey(r);
 if(meter.dataset.paint===paint)return;meter.dataset.paint=paint;
 meter.dataset.kind=r.kind;meter.classList.toggle('critical',r.critical);
 meter.querySelector('.resource-label').textContent=r.label;
 meter.querySelector('.resource-seconds').textContent=Math.ceil(r.remaining)+'s';
 meter.querySelector('.resource-fill').style.width=(r.ratio*100).toFixed(1)+'%';
 const label=(r.kind==='air'?'Air':r.kind==='recover'?'Brace recovery':'Shield strength')+': '+r.remaining.toFixed(1)+' seconds'+(r.kind==='recover'?' until ready':' remaining');
 meter.setAttribute('aria-label',label);meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax',String(r.max));meter.setAttribute('aria-valuenow',r.remaining.toFixed(1));meter.title=label;
}
