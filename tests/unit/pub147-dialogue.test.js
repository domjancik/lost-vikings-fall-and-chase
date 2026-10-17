import test from 'node:test';import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';import {say} from '../../src/levels/pub/campaign.js';import {invitePractice} from '../../src/levels/pub/tutorial.js';
import {speakerAnchor,formatDialogue,dialogueLayout,PUB_PEOPLE} from '../../src/levels/pub/dialogue.js';
import {ALEHALL_CASK,ALEHALL_DELIVERY_X,alehallDryingCups} from '../../src/levels/pub/layout.js';
import {pickupItem,dropItem} from '../../src/core/inventory.js';
import fs from 'node:fs';
test('speech follows the actual NPC or Viking, not the location of the task',()=>{
 const s=createState(11,'cycle');say(s,'ASTRID','That delivery is ready.',1550);assert.equal(s.machine.dialogue.x,PUB_PEOPLE.ASTRID.x);
 s.heroes[2].x=2114;s.heroes[2].y=726;assert.deepEqual(speakerAnchor(s,'OLAF'),{x:2114,y:684});
 const layout=dialogueLayout(s,{x:900,y:400},{width:430,height:780,mobile:true});assert.equal(layout.anchor.x,PUB_PEOPLE.ASTRID.x);assert.equal(layout.kind,'speech');assert.equal(layout.text,'ASTRID: That delivery is ready.');
});
test('unfinished lessons repeat with different wording and then explicit controls, completed ones stop',()=>{
 const s=createState(11,'cycle');s.active=1;s.heroes[1].x=400;const messages=[];
 for(const t of [8,9,23,38]){s.time=t;invitePractice(s,(...args)=>{messages.push(args[2]);say(...args);});}
 assert.equal(messages.length,3);assert.equal(new Set(messages).size,3);assert.match(messages[2],/\{alt\}/);
 assert.match(formatDialogue(messages[2],true),/ALT/);assert.match(formatDialogue(messages[2],false),/D/);
 s.machine.targetHit=true;s.time=55;invitePractice(s,()=>assert.fail('completed bow lesson repeated'));
});
test('cask returns to its original area and opened clean cups visibly dry beside the hearth',()=>{
 assert.equal(ALEHALL_CASK.start,1020);assert.equal(ALEHALL_CASK.park,840);assert.ok(Math.abs(ALEHALL_DELIVERY_X-1170)<120);
 assert.deepEqual(alehallDryingCups({wrapPose:0}),[]);const cups=alehallDryingCups({wrapPose:1});assert.equal(cups.length,3);assert.ok(cups.every(p=>p.alpha===1&&p.bottom===710));
});
test('a fetched then dropped key does not revive the loft-jumping lesson',()=>{
 const s=createState(11,'cycle');s.active=0;s.machine.cart.parked=true;Object.assign(s.heroes[0],{x:730,y:566});assert.ok(pickupItem(s));s.heroes[0].y=716;assert.ok(dropItem(s));s.heroes[0].x=940;s.time=20;s.machine.dialogue=null;
 invitePractice(s,()=>assert.fail('key is on the floor, not on the loft'));
});
test('speech tails attach just above measured native NPC heads',()=>{
 const registration=JSON.parse(fs.readFileSync('assets/alehall135/registration.json'));
 for(const person of Object.values(PUB_PEOPLE)){const cell=registration.atlases.patrons.cells[person.row*4],head=760-(cell.bottom-cell.bounds[1])*2;assert.equal(person.y,head-2);}
});
