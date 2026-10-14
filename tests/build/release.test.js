import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {build,repositoryRoot} from '../../tools/build/manifest.mjs';
const module=await import('../../tools/release/check.mjs').catch(()=>null);
test('release verification catches changed source and corrupted emitted files',async()=>{
 assert.equal(typeof module?.checkRelease,'function','Missing release verification');
 const root=path.join(repositoryRoot,'output/release-check-fixture');await fs.mkdir(root+'/config',{recursive:true});await fs.mkdir(root+'/src',{recursive:true});
 await fs.writeFile(root+'/src/game.js','export const value=1;');await fs.writeFile(root+'/index.html','<script type="module" src="src/game.js"></script>');
 await fs.writeFile(root+'/config/release-manifest.json',JSON.stringify({version:1,entrypoints:['index.html'],modules:[{source:'src/game.js',output:'game.js'}],files:[{source:'index.html',output:'index.html'}],assets:[]}));
 await build({root});assert.equal((await module.checkRelease(root)).files,2);
 await fs.writeFile(root+'/src/game.js','export const value=2;');await assert.rejects(module.checkRelease(root),/Source changed/);
 await build({root});await fs.writeFile(root+'/dist/game.js','broken');await assert.rejects(module.checkRelease(root),/Output changed/);
});
