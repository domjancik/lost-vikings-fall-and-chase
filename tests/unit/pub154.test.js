import test from 'node:test';
import assert from 'node:assert/strict';
import {alehallDryingCups,ALEHALL_DRYER} from '../../src/levels/pub/layout.js';
test('drying cups sit inside the measured native basin, behind its front rim',()=>{
 assert.equal(ALEHALL_DRYER.bottom,760);assert.equal(ALEHALL_DRYER.footRow,57);
 assert.deepEqual(ALEHALL_DRYER.opening,{x:22,y:26,w:20,h:6});
 const cups=alehallDryingCups({wrapPose:1}),originY=760-57*2,originX=1260-64;
 assert.equal(cups.length,3);
 for(const cup of cups){assert.equal(cup.bottom,originY+32*2);assert.ok(cup.x-8>=originX+22*2);assert.ok(cup.x+8<=originX+42*2);}
 assert.equal(ALEHALL_DRYER.front.y,31);assert.ok(ALEHALL_DRYER.front.y*2+originY<cups[0].bottom,'front rim overlaps cup bases');
});
