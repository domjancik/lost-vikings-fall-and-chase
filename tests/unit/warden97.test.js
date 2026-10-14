import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WARDEN_ART} from '../../src/levels/warden/art.js';
test('cargo uses its reviewed visible top strip, not the front face below passengers',()=>{
 assert.equal(WARDEN_ART.anchors.cargoRim[1],60);
 assert.deepEqual(WARDEN_ART.parts['cargo-free'],[168,376,168,104]);
 const code=readFileSync('src/levels/warden/render.js','utf8');
 assert.ok(code.includes("[9,A.anchors.cargoRim[1]]"));
});
