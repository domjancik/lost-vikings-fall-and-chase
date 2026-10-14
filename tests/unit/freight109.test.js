import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {setupFreight,freightStep,freightSurfaces} from '../../src/levels/freight/campaign.js';
import {syncShieldArtPose} from '../../src/heroes/hero-shield-registration.js';
import {simulateFreightRoute} from '../routes/freight-route109.js';
import {createFreightSounds} from '../../src/levels/freight/audio.js';
import {FREIGHT_ART,inspectorArtFrame} from '../../src/levels/freight/art-layout.js';
const fresh=()=>{const s=createState(0,'cycle');setupFreight(s);return s;};
const ticks=(s,n,input={},hz=120)=>{for(let i=0;i<n&&!s.failed;i++)step(s,i?{...input,interact:false,sword:false,action:false}:input,1/hz);};
test('cracked refractory masonry is cleared by a running bash, not use or a sword',()=>{
 const s=fresh();s.active=1;Object.assign(s.heroes[1],{x:420,y:896,ground:true});ticks(s,1,{sword:true,interact:true});assert.equal(s.machine.ventOpen,false);
 s.active=0;Object.assign(s.heroes[0],{x:420,y:896,vx:230,face:1,ground:true});s.cooldown=0;ticks(s,1,{right:true,action:true});
 assert.equal(s.machine.ventOpen,true);assert.ok(s.machine.ventPose>0&&s.machine.ventPose<1);
});
test('a raised shield and its passenger rise continuously in the commissioned draft',()=>{
 for(const hz of [60,120]){
  const s=fresh();s.machine.ventOpen=true;const o=s.heroes[2],b=s.heroes[1];s.active=2;
  Object.assign(o,{x:480,y:896,shieldUp:true,ground:true});Object.assign(b,{x:480,y:816,support:2,ground:true});
  let last=o.y;for(let n=0;n<hz*2;n++){freightStep(s,{},1/hz);assert.ok(Math.abs(o.y-last)<=160/hz+.1);last=o.y;assert.ok(Math.abs(b.y+44-(o.y-36))<.1);}
  assert.ok(o.y<760);assert.equal(b.support,2);
 }
});
test('the freight trolley accelerates without teleporting its riders and stays in its rail envelope',()=>{
 const s=fresh();s.machine.ventOpen=true;const c=s.machine.cart,b=s.heroes[1];Object.assign(b,{x:c.x+50,y:596,support:'freight-cart',ground:true});
 for(let n=0;n<120*16;n++){const before=c.x;freightStep(s,{},1/120);assert.ok(c.x>=840&&c.x<=1340);assert.ok(Math.abs(c.x-before)<=140/120+.001);}
 assert.ok(freightSurfaces(s).some(p=>p.support==='freight-cart'));assert.equal(s.failed,false);
});
test('inspectors patrol grounded decks and actively attack an exposed hero',()=>{
 const s=fresh(),guard=s.machine.inspectors[0],start=guard.x;ticks(s,120);assert.notEqual(guard.x,start);assert.equal(guard.floor,640);
 s.active=1;Object.assign(s.heroes[1],{x:950,y:596,ground:true});ticks(s,120*2);assert.ok(s.shots.some(p=>p.enemy));
 ticks(s,120*8);assert.equal(s.heroes[1].dead,true);assert.equal(s.failed,true);
});
test('a newly acquired hero always gets a full warning before the inspector fires',()=>{
 const s=fresh();ticks(s,75);s.active=1;Object.assign(s.heroes[1],{x:950,y:596,ground:true});
 ticks(s,48);assert.equal(s.shots.filter(p=>p.enemy).length,0);assert.equal(s.machine.inspectors[0].phase,'aim');
 ticks(s,24);assert.ok(s.shots.some(p=>p.enemy));
});
test('a front shield intercepts a pressure bolt before it reaches the protected shooter',()=>{
 const s=fresh();s.active=1;const o=s.heroes[2];Object.assign(o,{x:990,y:596,face:1,ground:true,shieldUp:false});Object.assign(s.heroes[1],{x:940,y:596,ground:true});
 syncShieldArtPose(o,'current',{pose:'idle',frame:0});s.shots.push({x:1040,y:616,v:-280,enemy:true,kind:'fire',life:4});ticks(s,40);
 assert.equal(o.hp,3);assert.equal(s.heroes[1].hp,3);assert.ok(s.machine.blocks>0);
});
test('a defeated inspector drops its real cell; death alone does not power the receiver',()=>{
 const s=fresh(),guard=s.machine.inspectors[0];
 for(let n=0;n<3;n++){s.shots.push({x:guard.x-70,y:616,v:580,kind:'arrow',life:4});ticks(s,35);}
 assert.equal(guard.hp,0);assert.ok(s.items.some(i=>i.type==='pressureCell'));assert.equal(s.machine.cellInstalled,false);
 ticks(s,100);assert.equal(s.items.find(i=>i.type==='pressureCell').locked,false);
});
test('the cell is consumed only at its matching receiver and seats before starting the next riser',()=>{
 const s=fresh();s.active=1;const b=s.heroes[1];Object.assign(b,{x:1580,y:596,ground:true});b.inventory[0]='pressureCell';
 ticks(s,1,{interact:true});assert.equal(b.inventory[0],null);assert.ok(s.machine.insertion);assert.equal(s.machine.cellInstalled,false);
 ticks(s,90);assert.equal(s.machine.cellInstalled,true);assert.ok(s.machine.secondDraft>0&&s.machine.secondDraft<=1);
});
test('purging cools sources gradually and does not erase already emitted fireballs',()=>{
 const s=fresh();s.machine.exhaustOpen=true;s.shots.push({x:2440,y:336,v:-220,enemy:true,kind:'fire',life:4});ticks(s,1);
 assert.ok(s.machine.purge>0&&s.machine.purge<1);assert.equal(s.shots.length,1);assert.ok(s.shots[0].x<2440);assert.equal(s.machine.shutter,0);
 ticks(s,120*5);assert.equal(s.machine.purge,1);assert.equal(s.machine.shutter,1);
});
for(const hz of [60,120])test('the entire freight escape clears with ordinary controls and full crew health at'+hz+'Hz',()=>{
 const route=simulateFreightRoute(hz);assert.equal(route.won,true);assert.deepEqual(route.hp,[3,3,3]);
 assert.ok(route.milestones.some(m=>m.name==='passenger-draft'&&m.heroes[1].y+44<900));
 assert.ok(route.milestones.find(m=>m.name==='second-riser-powered').machine.cellInstalled);
 assert.ok(route.milestones.find(m=>m.name==='high-exhaust-run').heroes[0].y+44<=200);
});
test('freight sound cues follow physical events once and resetting starts silently',()=>{
 const s=fresh(),observe=createFreightSounds();assert.deepEqual(observe(s),[]);
 s.machine.ventOpen=true;s.machine.rescue[0]=true;assert.deepEqual(observe(s).map(e=>e.name),['pump','chain']);assert.deepEqual(observe(s),[]);
 s.machine.cellInstalled=true;assert.equal(observe(s)[0].name,'unlock');s.machine.inspectors[0].hp=0;assert.equal(observe(s)[0].name,'explosion');
 assert.deepEqual(observe(fresh()),[]);
});
test('trolley walking deck and wheel soles use measured native contacts, and enemies cannot enter the departure doorway',()=>{
 const s=fresh(),a=FREIGHT_ART.cart;assert.equal(s.machine.cart.w,a.deck[2]*2);assert.equal((a.sole-a.deck[1])*2,80);
 for(const e of s.machine.inspectors){assert.ok(e.right+48<2658);assert.ok(s.level.floors.some(f=>f.y===e.floor&&e.left>=f.x&&e.right<=f.x+f.w));}
});
test('inspector warning lights the authored muzzle before the stronger firing frame, then visibly cools',()=>{
 assert.equal(inspectorArtFrame({hp:3,phase:'aim'}),5);assert.equal(inspectorArtFrame({hp:3,phase:'fire'}),6);assert.equal(inspectorArtFrame({hp:3,phase:'recover'}),4);
 assert.equal(inspectorArtFrame({hp:0,phase:'fire'}),7);assert.equal(inspectorArtFrame({hp:3,phase:'walk',walk:40}),3);
});
