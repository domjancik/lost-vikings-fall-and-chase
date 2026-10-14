import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const python='tools/pixel-fixer-venv/Scripts/python.exe';
test('generated mechanism cells retain visible distinct states and opaque grounded feet',{skip:!existsSync(python)},()=>{
 const code="from PIL import Image; import numpy as np; a=np.array(Image.open('assets/ground51/interaction-frames.png').convert('RGBA')); assert a.shape==(128,192,4); assert set(np.unique(a[:,:,3]))=={0,255}\nfor r in range(4):\n cells=[a[r*32:(r+1)*32,c*24:(c+1)*24] for c in range(8)]\n for c in cells: assert np.count_nonzero(c[-1,:,3])>=10, 'Floating mechanism base'\n assert not np.array_equal(cells[0],cells[-1]), 'Unchanged completed sprite'\n assert len({c.tobytes() for c in cells})>=6, 'Missing authored motion frames'\n";
 const result=spawnSync(python,['-c',code],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
});
