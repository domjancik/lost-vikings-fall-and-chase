import {createState,step} from '../../src/core/engine.js';
import {motionProfiles} from '../../src/core/movement.js';
export function runMomentumRoute(hz=120,onTick=()=>{}){
 const s=createState(2,'cycle'),dt=1/hz,stages=[];let ticks=0;
 const tick=(input={},n=1)=>{for(let i=0;i<n;i++){step(s,i?{...input,jump:false,sword:false,action:false,interact:false}:input,dt);onTick(s,input);ticks++;if(s.failed)throw Error('Died '+JSON.stringify(s.heroes));}};
 const until=(fn,input=()=>({}),limit=40,label='')=>{for(let n=0;n<limit*hz;n++){if(fn())return;tick(input());}throw Error('Timeout '+label+' '+JSON.stringify({time:s.time,heroes:s.heroes,ball:s.machine.ball,guide:s.machine.guide,clock:s.machine.clock}));};
 const move=(id,x)=>{s.active=id;const p=motionProfiles[id];until(()=>s.won||Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<12,()=>{const h=s.heroes[id],d=x-h.x-h.vx*Math.abs(h.vx)/(2*(h.ground?p.brake:p.air*1.5));return Math.abs(d)<2?{}:d>0?{right:true}:{left:true};},40,'move'+id+':'+x);tick({},Math.ceil(.1*hz));};
 const climb=(id,x,top)=>{move(id,x);until(()=>s.heroes[id].y+44<=top+.01,()=>({up:true}),12,'climb');tick({});};
 // Operators stage first; no teleportation or state injection.
 move(1,320);until(()=>s.heroes[1].y+44>=1120,()=>({down:true}),5);move(1,890);until(()=>s.heroes[1].y+44===1120);climb(1,890,960);move(1,900);
 move(0,320);until(()=>s.heroes[0].y+44>=1120,()=>({down:true}),5);move(0,740);until(()=>s.heroes[0].y+44===1120);move(0,1140);climb(0,1140,760);move(0,1180);
 move(2,400);until(()=>s.machine.ball.mode==='rolling',()=>({right:true}),5,'push');stages.push('push');
 s.active=1;until(()=>s.machine.ball.p>860);tick({sword:true});until(()=>s.machine.ball.p>1000);if(s.machine.ball.branch!=='upper')throw Error('Missed steer');stages.push('steer');
 s.active=0;until(()=>s.machine.ball.p>1130);tick({jump:true,right:true});until(()=>s.heroes[0].support==='momentum-ball',()=>{const h=s.heroes[0],b=s.machine.ball;return b.x-h.x>5?{right:true}:b.x-h.x< -5?{left:true}:{};},3,'board');stages.push('board');
 until(()=>s.machine.ball.p>=1720,()=>{const h=s.heroes[0],b=s.machine.ball,d=b.x-h.x;return d< -2?{left:true}:d>12?{right:true}:{};},8,'ride');tick({jump:true,right:true});until(()=>s.machine.highReached,()=>({right:true}),3,'high');stages.push('high');
 move(0,1940);until(()=>s.heroes[0].ground);until(()=>s.machine.clock>=1.25&&s.machine.clock<1.4);tick({jump:true,right:true});until(()=>s.heroes[0].x>2130,()=>({right:true}),3,'bumper');
 // Release jump between presses; cross the first off-window and jump the shot.
 until(()=>s.heroes[0].ground,()=>({right:true}),2,'tile landing');until(()=>s.machine.clock%28>=2.85&&s.machine.clock%28<2.95,()=>({}),1,'mouth windup');tick({jump:true,right:true});until(()=>s.heroes[0].x>2345&&s.heroes[0].ground,()=>({right:true}),3,'lane');tick({jump:true,right:true});until(()=>s.heroes[0].x>2500,()=>({right:true}),3,'furnace');move(0,2580);tick({interact:true});stages.push('safety');
 // Walk off the upper deck and collect each crew member at the bottom dock.
 move(0,2940);until(()=>s.heroes[0].ground&&s.heroes[0].y+44>1100,()=>({left:s.heroes[0].x>2890}),8,'drop');
 for(const id of [0,1,2]){move(id,2860);until(()=>s.machine.carrier.y===1120&&s.machine.carrier.pause>2);move(id,2980);until(()=>s.machine.carrier.y===508&&s.machine.carrier.pause>2&&s.heroes[id].y+44===508,()=>({}),12,'lift');move(id,3260);}
 if(!s.won)throw Error('Incomplete');stages.push('reunion');return {s,stages,ticks};
}
