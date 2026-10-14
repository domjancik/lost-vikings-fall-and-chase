import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
test('guarded background rebuild preserves native grids, alpha and physical foundations',()=>{
 const r=spawnSync('tools/pixel-fixer-venv/Scripts/python.exe',['tools/art/shared/validate-scale67.py'],{encoding:'utf8'});
 assert.equal(r.status,0,r.stdout+r.stderr);
});
