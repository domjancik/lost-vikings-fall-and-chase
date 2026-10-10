import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from './engine.js';
test('only Erik can reach the high wiring with a jump',()=>{for(let i=0;i<3;i++){const s=createState();s.active=i;s.heroes[i].ground=true;step(s,{jump:true},1/60);assert.equal(s.heroes[i].vy<0,i===0);}});
test('the pub floor is continuous and does not depend on a bridge or latch',()=>{const s=createState();s.crate=false;s.power=true;s.turret=false;s.active=0;for(let i=0;i<200;i++)step(s,{right:true},1/60);assert.ok(s.heroes[0].x>820);assert.equal(s.heroes[0].y,566);});
test('the exit requires all three heroes and the restored circuit',()=>{const s=createState();s.power=true;s.latch=true;s.turret=false;s.heroes.forEach(h=>h.x=1330);step(s,{},1/60);assert.equal(s.won,true);const t=createState();t.power=true;t.latch=true;t.turret=false;t.heroes[0].x=1330;step(t,{},1/60);assert.equal(t.won,false);});
test('the arcade armor requires the front shield rather than overhead',()=>{const s=createState();s.heroes[2].shieldUp=true;s.shots.push({x:1188,y:586,v:580,kind:'arrow'});step(s,{},1/60);assert.equal(s.turret,true);s.heroes[2].x=1140;s.heroes[2].y=566;s.heroes[2].shield=true;s.heroes[2].shieldUp=false;s.heroes[2].face=1;s.shots.push({x:1188,y:586,v:580,kind:'arrow'});step(s,{},1/60);assert.equal(s.turret,false);});
test('the full level is solvable through movement and abilities without teleporting',()=>{
 const s=createState();const tick=(input={},n=1)=>{for(let i=0;i<n;i++)step(s,input,1/60);};
 const move=(id,x)=>{s.active=id;for(let n=0;n<800&&!s.won&&Math.abs(s.heroes[id].x-x)>4;n++)tick(s.heroes[id].x<x?{right:true}:{left:true});assert.ok(s.won||Math.abs(s.heroes[id].x-x)<=4,`hero ${id} reaches ${x}, actual ${s.heroes[id].x}`);};
 const jumpTo=x=>{tick({jump:true});move(0,x);tick({},75);};
 tick({},20);move(1,405);tick({action:true});assert.equal(s.crate,false);
 move(0,210);jumpTo(300);assert.equal(s.heroes[0].y,446);move(0,350);jumpTo(440);assert.equal(s.heroes[0].y,346);move(0,490);jumpTo(580);assert.equal(s.heroes[0].y,246);jumpTo(680);assert.equal(s.fuse,true);
 move(0,200);tick({},100);move(0,610);tick({interact:true});assert.equal(s.power,true);
 
 move(2,1140);tick({action:true});assert.equal(s.grounded,true);move(1,1080);tick({action:true});tick({},40);assert.equal(s.turret,false);
 move(0,1340);move(1,1340);move(2,1340);assert.equal(s.won,true);
});

test('the pub exit explains that the rogue arcade must be shut down first',()=>{const s=createState();s.power=true;s.heroes.forEach(h=>{h.x=1335;h.y=566;});step(s,{},1/60);assert.equal(s.won,false);});
test('Baleog has a distinct melee sword attack without firing an arrow',()=>{const s=createState();s.active=1;s.heroes[1].x=405;s.heroes[1].y=566;step(s,{sword:true},1/60);assert.equal(s.crate,false);assert.ok(s.heroes[1].swing>0);assert.equal(s.shots.filter(p=>p.kind==='arrow').length,0);});
test('sword hits only targets in front and within melee range',()=>{const s=createState();s.active=1;s.heroes[1].x=405;s.heroes[1].y=566;s.heroes[1].face=-1;step(s,{sword:true},1/60);assert.equal(s.crate,true);});
