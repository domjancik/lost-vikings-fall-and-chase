import {snapPixel,snapAngle,animationTime} from './pixel-grid.js?v=arc46';
export function projectilePose(p,alpha=1){return {x:snapPixel((p.prevX??p.x)+(p.x-(p.prevX??p.x))*alpha),y:snapPixel((p.prevY??p.y)+(p.y-(p.prevY??p.y))*alpha),angle:snapAngle(Math.atan2(p.vy||0,p.v||0))};}
export function environmentPose(s){const g=s.machine,hit=g.lastBankHit;return {phase:animationTime(s.time)*4,mirrorAngle:snapAngle(Math.atan2([440,340,240][g.lane]-586,255)),hitStrength:hit?Math.max(0,1-animationTime(s.time-hit.time)/.7):0,nextLane:[1,0,2][Math.min(g.score,2)]};}
export function drawProjectile(ctx,p,alpha,time){
 const pose=projectilePose(p,alpha),arrow=p.kind==='arrow'||p.kind==='bank';
 const color=p.kind==='bank'?'#ff91e0':p.kind.includes('fire')?'#ffae47':p.kind.includes('ghost')?'#91efba':p.kind==='spark'?'#75e7ef':p.kind==='bolt'?'#f28aaf':'#fff0b3';
 if(p.trail?.length>1){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.globalAlpha=.38;ctx.beginPath();p.trail.forEach((q,i)=>i?ctx.lineTo(snapPixel(q.x),snapPixel(q.y)):ctx.moveTo(snapPixel(q.x),snapPixel(q.y)));ctx.lineTo(pose.x,pose.y);ctx.stroke();ctx.restore();}
 ctx.save();ctx.translate(pose.x,pose.y);ctx.rotate(pose.angle);ctx.fillStyle=color;
 if(arrow){ctx.fillRect(-12,-1,23,2);ctx.fillStyle='#fff6d5';ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(6,-5);ctx.lineTo(6,5);ctx.closePath();ctx.fill();ctx.fillStyle=color;ctx.fillRect(-12,-4,5,3);ctx.fillRect(-12,1,5,3);}
 else{ctx.fillRect(-9,-3,18,6);ctx.globalAlpha=.5;ctx.fillRect(-15,-5,12,10);ctx.fillStyle='#fff4bf';ctx.fillRect(2,-2,5,4);}
 ctx.restore();
}
