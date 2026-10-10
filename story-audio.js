export function mechanismSnapshot(s){if(s.campaign!=='story')return null;const g=s.machine;return {gates:g.gates.map(d=>({x:d.x,target:d.target,progress:d.progress})),lifts:g.lifts.map(l=>({x:l.x,y:l.y,target:l.target})),payloads:g.payloads.map(p=>({x:p.x,released:p.released,arrived:p.arrived})),flags:{...g.flags},copying:g.copying,resetting:g.resetting,work:g.work,operator:g.operator};}
export function mechanismSounds(now,old,add,motor){if(!now||!old)return;
 for(const [i,d]of now.gates.entries()){const p=old.gates[i];if(d.target!==p.target)add('lever',d.x);if(d.progress===1&&p.progress<1)add('unlock',d.x);}
 for(const [i,l]of now.lifts.entries()){const p=old.lifts[i];if(l.target!==p.target)add('lever',l.x+72);if(motor&&Math.abs(l.y-p.y)>.01)add('lift',l.x+72);}
 for(const [i,p]of now.payloads.entries()){const before=old.payloads[i];if(p.released&&!before.released)add('chain',p.x);if(p.arrived&&!before.arrived)add('impact',p.x);}
 for(const [key,value]of Object.entries(now.flags))if(value&&!old.flags[key])add(key==='copied'?'bell':'lever');
 if(now.copying&&!old.copying)add('mix',1200);if(now.resetting&&!old.resetting)add('pump',1140);if(now.operator!==null&&old.operator===null)add('lever',1500);if(now.work<old.work)add('wrong',1500);
}
