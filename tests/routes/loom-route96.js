import {createState,step} from '../../src/core/engine.js';
export function simulateLoomRoute(){
 const s=createState(6,'cycle'),commands=[],milestones=[];let stage='start';
 function tick(id,input={}){s.active=id;step(s,input,1/120);commands.push({id,...input});if(s.failed)throw Error('Crew lost at '+stage+' '+s.time);}
 function until(id,predicate,input={},seconds=25){const end=s.time+seconds;while(!predicate(s)){if(s.won)return;if(s.time>end)throw Error('Timeout '+stage+' '+JSON.stringify({time:s.time,heroes:s.heroes.map(h=>({x:h.x,y:h.y,support:h.support,vx:h.vx})),g:s.machine}));tick(id,typeof input==='function'?input(s):input);}}
 function move(id,x,seconds=25){until(id,s=>Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<16,()=>{const h=s.heroes[id],error=x-h.x,brake=h.ground?([2600,2300,2100][id]):1875,stop=h.vx*h.vx/(2*brake);return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};},seconds);}
 function mark(name){stage=name;milestones.push({name,time:s.time,heroes:s.heroes.map(h=>({x:h.x,y:h.y,hp:h.hp})),machine:JSON.parse(JSON.stringify(s.machine))});if(globalThis.process?.env.LOOM_TRACE)console.log(name,s.time,s.heroes[0].x,s.heroes[0].y,s.heroes[0].support,s.machine.shuttle2.x,s.machine.guides);}
 mark('board-piston');move(1,1100);mark('pressure');move(2,565);tick(2,{left:true});until(2,s=>s.machine.lift.y<741&&s.machine.pressure>.99,{},12);
 mark('lift-high');move(1,1250);tick(1,{action:true});until(1,s=>s.machine.released,{},3);
 mark('release-pawl');move(2,790);until(2,s=>s.heroes[2].y+44<=1020,{up:true},4);move(2,900);tick(2,{jump:true});
 move(0,790);until(0,s=>s.heroes[0].y+44<=1020,{up:true},4);move(0,850);tick(0,{jump:true,right:true});move(0,900);until(0,s=>s.heroes[0].support===2,{},2);
 mark('shield-step');tick(0,{jump:true,right:true});move(0,1060);until(0,s=>s.heroes[0].ground,{},2);move(0,1190);tick(0,{interact:true});
 mark('bobbin-taken');tick(2,{action:true});move(2,790);until(2,s=>s.heroes[2].y+44>=1120,{down:true},4);move(2,565);tick(2,{left:true});until(2,s=>s.machine.pressure>.99,{},6);
 mark('board-shuttle');move(0,1248);until(0,s=>s.machine.shuttle.x<1290&&Math.sin(s.machine.phase)<0,{},16);tick(0,{jump:true,right:true});move(0,1350);until(0,s=>s.heroes[0].support==='loom-shuttle',{},2);
 function thread(n){const eye=[{x:1640,y:720},{x:2210,y:722}][n];
  until(0,s=>{const h=s.heroes[0],rise=h.y+12-eye.y,t=(570-Math.sqrt(Math.max(0,570*570-2500*rise)))/1250;return h.ground&&h.x>=eye.x-22-230*t&&h.vx>210;},{right:true},5);
  mark('takeoff-'+n);tick(0,{jump:true,right:true});until(0,s=>s.machine.guides>n,{right:true},1.1);until(0,s=>s.heroes[0].ground,{},1.5);
 }
 until(0,s=>s.machine.shuttle.x>1380&&Math.sin(s.machine.phase)>0,{},4);
 mark('first-aperture');thread(0);mark('first-thread-seated');until(0,s=>s.machine.shuttle.x>1550,{},6);move(0,1720,5);
 mark('safe-clutch-dock');tick(1,{action:true});until(1,s=>s.machine.clutchUntil>s.time+10,{},3);
 move(0,1815);until(0,s=>s.machine.shuttle2.x<2000&&Math.sin(s.machine.phase+.8)<0,{},12);tick(0,{jump:true,right:true});move(0,2025,2);until(0,s=>s.heroes[0].support==='loom-shuttle2',{},1.5);
 until(0,s=>Math.abs(s.heroes[0].x-s.machine.shuttle2.x-26)<3&&Math.abs(s.heroes[0].vx)<16,()=>{const h=s.heroes[0],error=s.machine.shuttle2.x+26-h.x,stop=h.vx*h.vx/5200;return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};},3);
 until(0,s=>s.machine.shuttle2.x>2030&&Math.sin(s.machine.phase+.8)>0,{},4);
 mark('second-shuttle');thread(1);mark('second-thread-seated');until(0,s=>s.machine.shuttle2.x>2190,{},5);move(0,2430,5);tick(0,{interact:true});until(0,s=>s.machine.exitLatched,{},6);
 mark('sky-repaired');until(0,s=>s.machine.exitPose===1&&s.machine.ladderPose===1,{},3);mark('retained-shutter');move(0,2520);until(0,s=>s.heroes[0].y+44>=1120,{down:true},4);move(0,3020);
 move(1,1550);until(1,s=>s.heroes[1].y+44>=1120,{down:true},4);move(1,3090);move(2,2955);mark('all-crew-reunion');move(2,3050);until(2,s=>s.won,{},2);mark('won');
 const compact=[];for(const c of commands){const key=JSON.stringify(c),last=compact.at(-1);if(last?.key===key)last.frames++;else compact.push({key,frames:1});}
 return{won:s.won,hp:s.heroes.map(h=>h.hp),time:s.time,milestones,commands:compact.map(c=>({...JSON.parse(c.key),frames:c.frames}))};
}
