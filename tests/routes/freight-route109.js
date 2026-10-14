import {createState,step} from '../../src/core/engine.js';
export function simulateFreightRoute(hz=120){
 const s=createState(7,'cycle'),commands=[],milestones=[];let stage='start';
 function tick(id,input={}){s.active=id;step(s,input,1/hz);commands.push({id,...input});if(s.failed)throw Error('Crew lost at '+stage+' '+s.time+' '+JSON.stringify(s.heroes));}
 function until(id,predicate,input={},seconds=25){const end=s.time+seconds;while(!predicate(s)){if(s.won)return;if(s.time>end)throw Error('Timeout '+stage+' '+JSON.stringify({time:s.time,heroes:s.heroes,cart:s.machine.cart,inspectors:s.machine.inspectors}));tick(id,typeof input==='function'?input(s):input);}}
 function move(id,x,seconds=25){until(id,s=>Math.abs(s.heroes[id].x-x)<3&&Math.abs(s.heroes[id].vx)<16,()=>{const h=s.heroes[id],error=x-h.x,stop=h.vx*h.vx/(2*(h.ground?[2600,2300,2100][id]:1875));return Math.abs(error)>stop+2?{[error>0?'right':'left']:true}:{};},seconds);}
 function mark(name){stage=name;milestones.push({name,time:s.time,heroes:s.heroes.map(h=>({x:h.x,y:h.y,hp:h.hp})),machine:JSON.parse(JSON.stringify(s.machine))});if(globalThis.process?.env.FREIGHT_TRACE)console.log(name,s.time,s.heroes.map(h=>[Math.round(h.x),Math.round(h.y+44),h.support]),s.machine.cart.x);}
 mark('clear-first-riser');move(0,390);until(0,s=>s.heroes[0].x>412,{right:true},1);tick(0,{right:true,action:true});until(0,s=>s.machine.ventOpen,{right:true},1);move(0,370);
 mark('board-watchtower');move(2,430);tick(2,{overhead:true});move(1,340);until(1,s=>s.heroes[1].y+44<=860,{up:true},3);move(1,450);until(1,s=>s.heroes[1].support===2,{},2);
 mark('passenger-draft');move(2,480);until(2,s=>s.heroes[2].y+44<575,{},7);move(2,700);tick(2,{action:true});until(2,s=>s.heroes[2].ground&&s.heroes[1].ground,{},3);
 mark('unroll-return-ladder');move(1,650);tick(1,{left:true,sword:true});until(1,s=>s.machine.rescuePose[0]===1,{},2);
 mark('erik-service-stairs');move(0,525);tick(0,{jump:true,right:true});move(0,655);until(0,s=>s.heroes[0].ground,{},2);tick(0,{jump:true,right:true});move(0,795);until(0,s=>s.heroes[0].ground,{},2);tick(0,{jump:true,right:true});move(0,850);until(0,s=>s.heroes[0].ground,{},2);move(0,780);
 mark('guarded-shooting');move(2,1020);move(1,960);tick(1,{right:true});
 for(let n=0;n<3;n++){until(1,s=>s.cooldown===0,{},1);tick(1,{action:true});until(1,s=>s.cooldown===0,{},1);}
 until(1,s=>s.machine.inspectors[0].hp===0,{},4);mark('inspector-cell-dropped');
 function ferry(id,x){until(id,s=>s.machine.cart.x<900&&s.machine.cart.direction===1,{},16);move(id,1000,5);until(id,s=>s.heroes[id].x>1380,{},8);move(id,x,4);}
 ferry(2,1630);mark('olaf-receiving');ferry(1,1570);until(1,s=>s.items.some(i=>i.type==='pressureCell'&&!i.locked),{},2);
 const cell=s.items.find(i=>i.type==='pressureCell');move(1,cell.x);tick(1,{interact:true});until(1,s=>s.heroes[1].inventory.includes('pressureCell'),{},1);move(1,1580);tick(1,{interact:true});until(1,s=>s.machine.secondDraft===1,{},2);move(1,1620);
 mark('second-riser-powered');ferry(0,1440);mark('crew-receiving');
 // Second watch-step: Baleog mounts the raised shield before entering the draft.
 move(2,1720);tick(2,{overhead:true});move(1,1760);until(1,s=>s.heroes[1].y+44<=560,{up:true},2);move(1,1720);until(1,s=>s.heroes[1].support===2,{},2);
 // The rising passenger crosses the horizontal furnace lane. Wait on the safe
 // loading bay until its last travelling volley has passed the draft shaft.
 until(2,s=>s.machine.heatClock%5.8>4.4&&s.machine.heatClock%5.8<4.8,{},6);
 mark('upper-draft');move(2,1660);until(2,s=>s.heroes[2].y+44<310,{},7);
 // Land on the near gallery edge before the next volley. Front shielding then
 // protects both heroes while Baleog steps off the floating shield.
 move(2,1775);tick(2,{right:true,action:true});until(2,s=>s.heroes[1].ground&&s.heroes[2].ground,{},3);move(2,1900);
 mark('upper-return');move(1,1840);tick(1,{sword:true});until(1,s=>s.machine.rescuePose[1]===1,{},2);
 // The return ladder also brings Erik up without asking for an impossible non-jump.
 move(0,1880);until(0,s=>s.heroes[0].y+44<=360,{up:true},6);tick(0,{right:true});move(0,1840);
 mark('upper-inspector');move(2,2000);move(1,1940);tick(1,{right:true});
 for(let n=0;n<3;n++){until(1,s=>s.cooldown===0,{},1);tick(1,{action:true});until(1,s=>s.cooldown===0,{},1);}
 until(1,s=>s.machine.inspectors[1].hp===0,{},3);mark('furnace-shield');
 move(2,2100);move(0,2060);
 until(2,s=>s.shots.filter(p=>p.enemy&&p.y===336&&p.x>2080&&p.x<2300).length===0&&s.machine.heatClock%5.8>3.7,{},8);
 tick(2,{overhead:true});tick(0,{jump:true,right:true});move(0,2100);until(0,s=>s.heroes[0].support===2,{},2);
 tick(0,{jump:true,right:true});move(0,2150);until(0,s=>s.heroes[0].ground,{},2);
 tick(2,{action:true});mark('high-exhaust-run');until(0,s=>s.heroes[0].x>2225,{right:true},2);tick(0,{right:true,action:true});until(0,s=>s.machine.exhaustOpen,{right:true},1);move(0,2330);
 until(0,s=>s.machine.shutter===1,{},4);mark('cooled-departure');
 move(0,3120);move(1,3110);move(2,3140);until(2,s=>s.won,{},3);mark('won');
 const compact=[];for(const c of commands){const key=JSON.stringify(c),last=compact.at(-1);if(last?.key===key)last.frames++;else compact.push({key,frames:1});}
 return{won:s.won,hp:s.heroes.map(h=>h.hp),time:s.time,milestones,commands:compact.map(c=>({...JSON.parse(c.key),frames:c.frames}))};
}
