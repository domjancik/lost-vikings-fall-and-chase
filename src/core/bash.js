import {snapPixel,animationTime} from '../render/pixel-grid.js?v=arc46';
export const BASH_DURATION=.36;
export function startBash(s,dt){const h=s.heroes[s.active];if(h.id!==0||!h.ground||!(h.bashBuffer>0)||Math.abs(h.vx)<130||s.cooldown>0)return false;h.bash=BASH_DURATION;h.bashBuffer=0;h.bashFace=h.face;h.vx=h.face*320;h.moveX=h.vx*dt;s.cooldown=.46;return true;}
export function bashImpact(s,x,y){s.impact={kind:'bash',x,y,time:s.time};}
export function drawBashEffects(ctx,s,box,text){
 const h=s.heroes[0];if(h.bash>0){const phase=Math.floor(animationTime(s.time)*24)%3;for(let i=0;i<4;i++)box(i%2?'#cda678':'#8d7659',h.x-h.face*(24+i*10+phase*2),h.y+38-i%2*5,8+i*2,2);if(h.bash>.12){for(let i=0;i<3;i++)box('#fff0bc',h.x-h.face*(30+i*7),h.y+10+i*8,12,2);}}
 if(!s.impact)return;const age=animationTime(s.time-s.impact.time);if(age<0||age>.4)return;const {x,y}=s.impact,r=8+age*95;for(let i=0;i<8;i++){const a=i*Math.PI/4;box(i%2?'#e9b55f':'#fff0ba',x+Math.cos(a)*r,y+Math.sin(a)*r,age<.15?6:4,4);}if(age<.25)text('BASH!',snapPixel(x),snapPixel(y-36),'#fff0bc',16);
}
