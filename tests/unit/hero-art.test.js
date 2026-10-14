import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

test('shaded authored sheets retain every pose, registered soles, and unclipped equipment',()=>{
 const result=spawnSync('tools/pixel-fixer-venv/Scripts/python.exe',['tools/art/vikings/validate-vikings63.py'],{encoding:'utf8'});
 assert.equal(result.status,0,result.stdout+result.stderr);
});
