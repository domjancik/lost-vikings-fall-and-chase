import {WARDEN_BRACE_LIMIT} from './campaign.js?v=warden104';
import {snapPixel as q} from '../../render/pixel-grid.js?v=arc46';
export function braceSweat(s){
 const g=s.machine,o=s.heroes[2];
 if(!g.braced||g.disabled||o.dead||g.braceAge<.3)return[];
 const strain=Math.min(1,g.braceAge/WARDEN_BRACE_LIMIT),count=2+Math.floor(strain*5),result=[];
 for(let n=0;n<count;n++){
  const age=(g.braceAge+n*.173)%.8,side=n%2?1:-1;
  result.push({x:q(o.x+side*(12+age*17)),y:q(o.y-30+age*12+age*age*36),alpha:Math.min(1,age/.08)*Math.max(0,1-age/.8),h:age<.15?2:4});
 }
 return result;
}
export function drawBraceSweat(c,s){
 const drops=braceSweat(s);c.save();
 for(const p of drops){c.globalAlpha=p.alpha;c.fillStyle='#75b3bd';c.fillRect(p.x,p.y,2,p.h);c.fillStyle='#c3ded4';c.fillRect(p.x,p.y,2,2);}
 c.restore();return drops.length;
}
