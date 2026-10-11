import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const python='tools/pixel-fixer-venv/Scripts/python.exe';
test('terrain has all matched material cells and subdued infill contrast',{skip:!existsSync(python)},()=>{
 const code="from PIL import Image; import numpy as np; im=Image.open('assets/terrain48/terrain.png'); assert im.size==(256,256); a=np.array(im); assert a.shape==(256,256,3);\nfor r in range(8):\n p=a[r*32:(r+1)*32,4*32:6*32]; lum=p[:,:,0]*.299+p[:,:,1]*.587+p[:,:,2]*.114; assert np.percentile(lum,95)-np.percentile(lum,5)<20, 'Overdecorated infill row '+str(r)\n for c in [4,5]:\n  tile=a[r*32:(r+1)*32,c*32:(c+1)*32].mean(2); mid=np.median(tile[2:-2,2:-2]); assert min(np.median(tile[:,0]),np.median(tile[:,-1]))>mid-12, 'Atlas separator in infill edge'\n";
 const result=spawnSync(python,['-c',code],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
});
