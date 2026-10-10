import {test} from 'node:test';import assert from 'node:assert/strict';import {existsSync} from 'node:fs';import {spawnSync} from 'node:child_process';
const python='tools/pixel-fixer-venv/Scripts/python.exe';
test('fresh scenery preserves source pixels and every enemy frame is grounded on its foot pivot',{skip:!existsSync(python)},()=>{const r=spawnSync(python,['tools/validate-campaign46-art.py'],{encoding:'utf8',env:{...process.env,PYTHONUTF8:'1'}});assert.equal(r.status,0,r.stdout+r.stderr);});
