import {simulateAlehallRoute} from '../routes/alehall135-route.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {dropItem,pickupItem,transferItem,useItem} from '../../src/core/inventory.js';
import {createState,step} from '../../src/core/engine.js';
import {setupAlehall,alehallObjects,alehallStep} from '../../src/levels/pub/campaign.js';
import {campaignOrder,campaignNext} from '../../src/campaigns/machines/cycle-order.js';
const fresh=()=>{const s=createState();setupAlehall(s);return s;};
const run=(s,input={},seconds=1)=>{for(let n=0;n<seconds*120&&!s.won;n++)alehallStep(s,input,1/120);};

test('the cask walking top matches its generated opaque material rather than its canvas',()=>{
 const art=JSON.parse(fs.readFileSync('assets/alehall135/registration.json')),b=art.atlases.props.cells[0].bounds;
 assert.equal(fresh().machine.cart.y,760-(b[3]-b[1])*art.pixel);
});
test('the Norse alehall opens the machine campaign and falls into sewer then water',()=>{
 assert.deepEqual(campaignOrder('fall',12).slice(0,3),[11,10,4]);assert.equal(campaignNext('fall',11,12),10);assert.equal(createState(11,'cycle').level.mechanic,'alehall');
});
test('only Olaf front-shield contact pushes the grounded cask sledge, and it has recovery stops',()=>{
 const s=fresh(),g=s.machine,o=s.heroes[2];s.active=2;o.x=g.cart.x+80;o.face=-1;const x=g.cart.x;
 o.shieldUp=true;run(s,{left:true},.4);assert.equal(g.cart.x,x);
 o.x=x+80;o.vx=0;o.shieldUp=false;run(s,{left:true},3);assert.equal(g.cart.x,840);assert.ok(g.cart.parked);
});
test('ale carry requires raised shield and lowering spills only the serving attempt',()=>{
 const s=fresh(),o=s.heroes[2];s.active=2;o.x=1040;o.shieldUp=true;
 alehallObjects(s).find(o=>o.id==='ale').run();run(s,{},1);assert.equal(s.machine.cups.mode,'carried');
 o.shieldUp=false;run(s,{},.1);assert.equal(s.machine.cups.mode,'spilled');assert.equal(s.machine.served,false);
 o.shieldUp=true;alehallObjects(s).find(o=>o.id==='ale').run();run(s,{},1);o.x=1390;alehallObjects(s).find(o=>o.id==='serve').run();run(s,{},1);
 assert.equal(s.machine.served,true);
});
test('unrelated social activities do not gate the globe inspection',()=>{
 const s=fresh();s.machine.door.open=true;s.machine.door.pose=1;
 for(const h of s.heroes)h.x=1850+h.id*45;
 run(s,{},.05);assert.equal(s.machine.phase,'inspect');assert.equal(s.machine.served,false);assert.equal(s.machine.targetHit,false);
});
test('entry waits for all three; continuous inspection brings Olaf last and then breaks the floor',()=>{
 const s=fresh(),g=s.machine;g.door.open=true;g.door.pose=1;s.heroes[0].x=1850;s.heroes[1].x=1900;
 run(s,{},1);assert.equal(g.phase,'play');s.heroes[2].x=1850;
 run(s,{left:true,jump:true},.1);assert.equal(g.phase,'inspect');assert.equal(s.won,false);
 let cracked=false,broken=false,largestStep=0;
 for(let n=0;n<120*18&&!s.won;n++){const old=s.heroes.map(h=>({x:h.x,y:h.y}));alehallStep(s,{left:true},1/120);cracked||=g.phase==='crack';broken||=g.phase==='fall';for(const h of s.heroes)largestStep=Math.max(largestStep,Math.hypot(h.x-old[h.id].x,h.y-old[h.id].y));}
 assert.ok(cracked&&broken);assert.ok(s.won);assert.ok(largestStep<10);assert.deepEqual(s.heroes.map(h=>h.hp),[3,3,3]);assert.ok(s.heroes.every(h=>h.y+44>1070));
});

for(const hz of [60,120])test('ordinary-input alehall route teaches all abilities and clears healthy at '+hz+'Hz',()=>{const r=simulateAlehallRoute(hz);assert.ok(r.won);assert.deepEqual(r.hp,[3,3,3]);const m=r.milestones.find(m=>m.name==='loft-key');assert.equal(m.heroes[0].support,2);assert.ok(m.machine.bashHit&&m.machine.targetHit&&m.machine.wrapCut&&m.machine.defenseBlocks===1);});

for(const order of [[2,0,1],[1,2,0],[0,1,2]])test('inspection remains recoverable with room entry order '+order.join(','),()=>{
 const s=fresh(),g=s.machine;g.door.open=true;g.door.pose=1;
 for(const id of order){s.heroes[id].x=1850+id*35;run(s,{},.05);if(id!==order.at(-1))assert.equal(g.phase,'play');}
 assert.equal(g.phase,'inspect');
 run(s,{},20);assert.ok(s.won);assert.deepEqual(s.heroes.map(h=>h.hp),[3,3,3]);
 assert.equal(g.served,false);assert.equal(g.targetHit,false);assert.equal(g.wrapCut,false);
});

test('a closed storeroom is solid and the inventory key opens it continuously',()=>{
 const s=fresh(),h=s.heroes[0];s.active=0;h.x=1670;
 run(s,{right:true},1);assert.ok(h.x<1708);assert.equal(s.machine.door.pose,0);
 h.inventory[0]='hallKey';alehallObjects(s).find(o=>o.id==='hall-door').run();
 assert.equal(h.inventory[0],null);run(s,{},.3);assert.ok(s.machine.door.pose>0&&s.machine.door.pose<1);
 run(s,{right:true},2);assert.equal(s.machine.door.pose,1);assert.ok(h.x>1820);assert.equal(s.machine.phase,'play');
});

test('the hall key can be dropped from a jump, recovered and passed to a friend for the door',()=>{
 const s=fresh(),e=s.heroes[0],b=s.heroes[1];s.active=0;e.x=1450;e.y=600;e.inventory[0]='hallKey';
 assert.ok(dropItem(s));run(s,{},1);const key=s.items.find(i=>i.type==='hallKey'&&i.id.startsWith('drop-'));
 assert.equal(key.y+44,760);assert.ok(pickupItem(s));b.x=e.x;b.y=e.y;assert.ok(transferItem(s,0,1));
 s.active=1;b.x=1680;b.y=716;assert.ok(useItem(s));assert.equal(s.machine.door.open,true);
});
