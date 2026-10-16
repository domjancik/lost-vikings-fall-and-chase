import test from 'node:test';
import assert from 'node:assert/strict';
import {campaignOrder,campaignNext,campaignPrevious,campaignPosition} from '../../src/campaigns/machines/cycle-order.js';
import {campaignFamily,campaignRoundKey,resumeRound} from '../../src/app/campaign-progress.js';
import {campaignChoices} from '../../src/app/campaign-picker.js';
import {createState} from '../../src/core/engine.js';
const fall=[11,10,4,2,3,7,5,8,9,0];
test('The Fall & The Chase has the requested order and leaves only the other machine rooms',()=>{
 assert.deepEqual(campaignOrder('fall',12),fall);
 assert.deepEqual(campaignOrder('cycle',12),[1,6]);
 assert.deepEqual([...fall,...campaignOrder('cycle',12)].sort((a,b)=>a-b),Array.from({length:12},(_,i)=>i));
 assert.equal(campaignChoices.find(c=>c.id==='fall').name,'The Fall & The Chase');
});
test('every campaign chapter dispatches its original simulation and advances in order',()=>{
 const mechanics=['alehall','sewer','water','momentum','clockwork','freight','warden','orbit','lode','cycle'];
 fall.forEach((id,i)=>{
  assert.equal(createState(id,campaignFamily('fall')).level.mechanic,mechanics[i]);
  assert.equal(campaignPosition('fall',id,12),i);
  assert.equal(campaignNext('fall',id,12),fall[(i+1)%fall.length]);
  assert.equal(campaignPrevious('fall',id,12),fall[i-1]??null);
 });
 assert.equal(campaignNext('fall',0,12,false),null);
 assert.equal(campaignNext('cycle',6,12,false),null);
 assert.equal(campaignNext('cycle',6,12),1);
});
test('resume preserves stable IDs, migrates moved saves and rejects out-of-campaign or corrupt saves',()=>{
 const storage=values=>({getItem:key=>values[key]??null});
 assert.equal(resumeRound(storage({}),'fall',12),11);
 assert.equal(resumeRound(storage({'last-call-cycle52-round':'8'}),'fall',12),8);
 assert.equal(resumeRound(storage({'last-call-cycle52-round':'8'}),'cycle',12),1);
 assert.equal(resumeRound(storage({'last-call-cycle52-round':'6'}),'cycle',12),6);
 assert.equal(resumeRound(storage({[campaignRoundKey('fall')]:'0'}),'fall',12),0);
 for(const invalid of ['1','12','NaN','','1.5','-1'])assert.equal(resumeRound(storage({[campaignRoundKey('fall')]:invalid}),'fall',12),11);
 assert.notEqual(campaignRoundKey('fall'),campaignRoundKey('cycle'));
 assert.equal(resumeRound({getItem(){throw Error('blocked');}},'fall',12),11);
});
