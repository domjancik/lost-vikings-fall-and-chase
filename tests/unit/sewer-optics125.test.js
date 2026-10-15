import test from 'node:test';import assert from 'node:assert/strict';
import {visibilityRay,visibilityPolygon} from '../../src/levels/sewer/optics.js';
test('a solid shutter truncates visibility rays at its real face',()=>{const p=visibilityRay({x:0,y:0,radius:300},0,[{x:100,y:-50,w:30,h:100}]);assert.equal(p.x,100);assert.equal(p.y,0);});
test('open passage retains full radial reach and includes occluder corners',()=>{const a={x:0,y:0,radius:300};assert.equal(visibilityRay(a,0,[]).x,300);const p=visibilityPolygon(a,[{x:100,y:-50,w:30,h:100}]);assert.ok(p.length>64);assert.ok(p.every(v=>v.x<=100.000001||Math.abs(v.y)>49));});
