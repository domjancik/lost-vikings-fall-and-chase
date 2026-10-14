import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../../src/core/engine.js';
const picker=await import('../../src/app/campaign-picker.js').catch(()=>null);
test('three campaign choices each contain their own levels and bounded static preview frames',()=>{
 assert.ok(picker?.campaignChoices);
 assert.deepEqual(picker.campaignChoices.map(c=>c.id),['story','cycle','arcade']);
 for(const campaign of picker.campaignChoices){
  assert.equal(new Set(campaign.levels.map(l=>l.name)).size,campaign.levels.length);
  for(let round=0;round<campaign.levels.length;round++){
   const s=createState(round,campaign.id),before=JSON.stringify(s),f=picker.previewFrame(s);
   assert.ok(f.width>=720&&f.height>=404);assert.equal(f.width%2,0);assert.equal(f.height%2,0);
   assert.ok(f.x>=0&&f.x+f.width<=(s.level.worldWidth||1440));
   assert.ok(f.y>=(s.level.worldTop||0)&&f.y+f.height<=(s.level.worldBottom||790));
   assert.equal(f.x%2,0);assert.equal(f.y%2,0);
   assert.equal(JSON.stringify(s),before,'Preview framing must not change puzzle state');
   if(campaign.id==='cycle'&&round===5){assert.ok(f.x<=920&&f.x+f.width>=1830);assert.ok(f.y<=420&&f.y+f.height>=940,'Boss preview shows head and feet');}
  }
 }
});
