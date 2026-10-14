import test from 'node:test';
import assert from 'node:assert/strict';
import {cycleFanConnections} from '../../src/campaigns/machines/cycle-fan-connections.js';
import {connectionPlan} from '../../src/render/connection-layout.js';

test('fan connections follow the grounded housing rather than its old nominal position',()=>{
 const a=cycleFanConnections({x:1296,y:812,w:128,h:128}),b=cycleFanConnections({x:1296,y:834,w:128,h:128});
 for(const kind of ['cable','duct']){assert.equal(b[kind].at(-1)[1]-a[kind].at(-1)[1],22);assert.equal(b[kind][0][1],a[kind][0][1]);connectionPlan(b[kind],kind==='cable'?'cable':'pipe');}
 assert.deepEqual(b.cable.at(-1),[1312,896]);
 assert.deepEqual(b.duct.at(-1),[1360,846]);
});
