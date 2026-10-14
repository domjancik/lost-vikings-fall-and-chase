import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
test('native Momentum artwork has stable physical supports and no neighboring-cell spill',()=>{
 assert.doesNotThrow(()=>execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['tools/art/momentum/validate-momentum68.py'],{encoding:'utf8'}));
});
