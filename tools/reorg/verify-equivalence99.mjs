import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {moduleSpecifiers} from '../build/manifest.mjs';
const manifest=JSON.parse(fs.readFileSync('dist/release-manifest.json','utf8'));
const snapshot=JSON.parse(fs.readFileSync('output/reorg99/snapshot.json','utf8'));
const normalize=s=>s.replace(/\?v=[a-zA-Z0-9-]+/g,'').replace(/\r/g,'');
const modules=new Map(manifest.files.filter(f=>f.path.endsWith('.js')).map(f=>[f.path,f]));
const seen=new Set();function visit(file){if(seen.has(file))return;seen.add(file);
 const code=fs.readFileSync('dist/'+file,'utf8');
 for(const spec of moduleSpecifiers(code)){if(!spec.value.startsWith('.'))continue;const next=path.posix.normalize(path.posix.join(path.posix.dirname(file),spec.value.split(/[?#]/)[0]));if(!modules.has(next))throw Error('Missing emitted module '+next);visit(next);}
 const published='output/release-loom98/dist/'+file;
 if(!fs.existsSync(published)||normalize(code)!==normalize(fs.readFileSync(published,'utf8')))throw Error('Behavior changed from verified Loom98: '+file);
}
visit('game.js');
const sha=b=>createHash('sha256').update(b).digest('hex');
for(const f of manifest.files.filter(f=>f.path.startsWith('assets/'))){if(sha(fs.readFileSync(f.source))!==f.sha256)throw Error('Asset bytes changed '+f.source);}
for(const r of snapshot.records.filter(r=>r.next.startsWith('archive/'))){if(sha(fs.readFileSync(r.next))!==r.beforeHash)throw Error('Historical bytes changed '+r.next);}
const result={runtimeModules:seen.size,assetFiles:manifest.files.filter(f=>f.path.startsWith('assets/')).length,unchangedRuntime:true,unchangedAssets:true,unchangedArchivedScripts:true};
fs.writeFileSync('output/reorg99/equivalence.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
