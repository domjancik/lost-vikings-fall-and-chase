import {createState} from '../../src/core/engine.js';
import {magneticRefractionBands} from '../../src/levels/orbit/field-optics.js';
import test from 'node:test';import assert from 'node:assert/strict';
test('magnetic lens samples stay inside the viewport and on the native grid',()=>{const s=createState(8,'cycle');s.machine.plates[0].phase='orbit';const view={x:900,y:480,width:400,height:300},bands=magneticRefractionBands(s,view);assert.ok(bands.length>10);for(const b of bands){for(const v of [b.x,b.sourceX,b.y,b.w,b.h])assert.equal(v%2,0);assert.ok(b.x>=view.x&&b.sourceX>=view.x);assert.ok(Math.max(b.x,b.sourceX)+b.w<=view.x+view.width);assert.ok(b.y+b.h<=view.y+view.height);}});
