import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {refractionArt} from './refraction-art-layout.js';
test('runtime machine cells contain actual grounded bases rather than neighboring-row fragments',()=>{
 const r=spawnSync('tools/pixel-fixer-venv/Scripts/python.exe',['tools/validate-refraction62.py'],{encoding:'utf8'});
 assert.equal(r.status,0,r.stdout+r.stderr);
});
test('cavern native size retains intended landscape ratio and a measured floor anchor',()=>{
 const p=readFileSync('assets/refraction62/scene.png');assert.equal(p.readUInt32BE(16),1400);assert.equal(p.readUInt32BE(20),509);
 assert.deepEqual(refractionArt.sceneSize,[1400,509]);assert.equal(900-(900-refractionArt.sceneFloor*2),826);
});
