import test from 'node:test';
import assert from 'node:assert/strict';
import {campaignOrder,campaignPosition,campaignNext,campaignPrevious} from '../../src/campaigns/machines/cycle-order.js';
import {waterTransitPose,drawWaterTransit} from '../../src/levels/sewer/water-transit.js';
import {createState} from '../../src/core/engine.js';
import {cycleLevels} from '../../src/campaigns/machines/cycle-campaign.js';
import {giveItem,transferItem,dropItem,pickupItem,itemTypes} from '../../src/core/inventory.js';
import {worldSoundOptions} from '../../src/audio/event-options.js';

test('alehall and sewer precede water without renumbering old levels',()=>{
 const order=campaignOrder('fall',12);
 assert.deepEqual(order,[11,10,4,2,3,7,5,8,9,0]);assert.equal(new Set(order).size,10);
 assert.equal(campaignNext('fall',11,12),10);assert.equal(campaignNext('fall',10,12),4);assert.equal(campaignPrevious('fall',4,12),10);
 assert.equal(campaignPosition('fall',10,12),1);assert.equal(campaignPosition('fall',4,12),2);assert.equal(campaignNext('fall',0,12),11);assert.equal(campaignPrevious('fall',11,12),null);
});

test('other campaigns retain their order and debug endpoints',()=>{
 assert.deepEqual(campaignOrder('story',4),[0,1,2,3]);
 assert.equal(campaignNext('story',3,4),0);
 assert.equal(campaignNext('story',3,4,false),null);
 assert.equal(campaignPrevious('story',2,4),1);
});
test('dispatch preserves water and magnetic identities and puts the sewer before water',()=>{
 assert.equal(createState(4,'cycle').level.mechanic,'water');
 assert.equal(createState(8,'cycle').level.mechanic,'orbit');
 assert.equal(createState(9,'cycle').level.mechanic,'lode');
 assert.equal(createState(10,'cycle').level.mechanic,'sewer');
 assert.equal(cycleLevels[campaignNext('fall',10,cycleLevels.length)].mechanic,'water');
});
test('all three lighting items survive standard inventory transfer drop and recovery',()=>{
 for(const [type,icon]of [['inspectionLamp',17],['lampOil',18],['bullseyeLens',19]]){
  const s=createState(10,'cycle');s.items=[];
  s.heroes[1].x=s.heroes[0].x;s.heroes[1].y=s.heroes[0].y;
  assert.equal(itemTypes[type].icon,icon);assert.equal(giveItem(s.heroes[0],type),true);
  assert.equal(transferItem(s,0,1),true);s.active=1;assert.equal(dropItem(s),true);
  assert.equal(s.items[0].type,type);assert.equal(pickupItem(s),true);
  assert.equal(s.heroes[1].inventory[0],type);assert.equal(s.items.length,0);
 }
});
test('water sweep fills the viewport progressively and keeps a continuous downstream direction',()=>{
 const poses=[0,.2,.6,1,1.7].map(t=>waterTransitPose(t,320,180));
 assert.equal(poses[0].cover,0);
 assert.equal(poses.at(-1).done,true);
 for(let i=1;i<poses.length;i++){
  assert.ok(poses[i].cover>=poses[i-1].cover);
  assert.ok(poses[i].travel>=poses[i-1].travel);
  assert.ok(poses[i].flow>poses[i-1].flow);
 }
 assert.equal(waterTransitPose(-1,320,180).cover,0);
});
test('water tunnel streaks move right and down like the outlet stream',()=>{
 function firstStreak(t){
  const rects=[],ctx={save(){},restore(){},clearRect(){},beginPath(){},rect(){},clip(){},strokeRect(){},fillRect(x,y,w,h){if(this.fillStyle==='#16434a')rects.push({x,y,w,h});}};
  drawWaterTransit(ctx,1000,180,t);return rects[0];
 }
 const before=firstStreak(.2),after=firstStreak(.3);
 assert.ok(after.x>before.x,'water must advance right, not against the incoming stream');
 assert.ok(after.y>before.y,'the outlet descends into the regulator');
});
test('occluded world sounds retain authored attenuation and pitch through output routing',()=>{
 assert.deepEqual(worldSoundOptions({name:'scrape',x:150,id:2,volume:.18,pitch:.8},{x:100,width:100},1.1),{pan:0,id:2,pitch:.8*1.1,volume:.18});
 assert.equal(worldSoundOptions({name:'scrape',x:300,volume:.2},{x:100,width:100}).volume,.2*.35);
 assert.deepEqual(worldSoundOptions({name:'chain',x:50,id:0},{x:0,width:100}),{pan:0,id:0,pitch:1,volume:1});
});

test('a captured Viking tips continuously into the current and disappears only after travel',async()=>{
 const {sweptHeroPose}=await import('../../src/levels/sewer/water-transit.js');
 const h={x:2900,y:716,sweptAway:false};
 assert.equal(sweptHeroPose(h,null),null);
 assert.equal(sweptHeroPose(h,0).rotation,0);
 assert.ok(sweptHeroPose(h,50).rotation>0&&sweptHeroPose(h,50).rotation<.75);
 assert.equal(sweptHeroPose(h,200).rotation,.75);
 assert.deepEqual(sweptHeroPose(h,200).magnetSole,{x:2900,y:760});
 assert.equal(sweptHeroPose({...h,sweptAway:true},440),null);
});
