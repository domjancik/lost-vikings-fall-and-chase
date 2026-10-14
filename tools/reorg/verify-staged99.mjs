import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {rewrite} from './migrate99.mjs';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:16*1024*1024});
const snapshot=JSON.parse(fs.readFileSync('output/reorg99/snapshot.json','utf8'));
const patch=fs.readFileSync('output/reorg99/before.patch','utf8');
const oldDirty=[...patch.matchAll(/^diff --git a\/(.+) b\/(.+)$/gm)].map(m=>m[1]);
const normalize=s=>s.replace(/\r/g,'');
const index=new Map(git('ls-files','--stage').trim().split(/\r?\n/).map(line=>{const m=line.match(/^\d+ ([a-f0-9]+) \d\t(.+)$/);return[m[2],m[1]];}));
const algorithm=git('rev-parse','--show-object-format').trim();
const blob=text=>{const bytes=Buffer.from(text);return createHash(algorithm).update('blob '+bytes.length+'\0').update(bytes).digest('hex');};
for(const r of snapshot.records.filter(r=>r.tracked)){
 const expected=rewrite(fs.readFileSync('output/reorg99/head/'+r.old,'utf8'),r.old,r.next,snapshot.map);
 // AGENTS also gains authored current navigation rules, independent of WIP.
 if(r.old!=='AGENTS.md'&&index.get(r.next)!==blob(expected))throw Error('Unrelated changes entered index: '+r.next);
}
for(const old of oldDirty){
 const r=snapshot.records.find(r=>r.old===old);if(!r)continue;
 const expected=rewrite(fs.readFileSync('output/reorg99/before/'+old,'utf8'),old,r.next,snapshot.map);
 if(normalize(fs.readFileSync(r.next,'utf8'))!==normalize(expected))throw Error('Original local changes altered: '+r.next);
}
const expected=new Set(oldDirty.map(f=>snapshot.map[f]||f));
const actual=new Set(git('diff','--name-only').trim().split(/\r?\n/).filter(Boolean));
for(const f of expected)if(!actual.has(f))throw Error('Original local difference lost: '+f);
for(const f of actual)if(!expected.has(f))throw Error('Unexpected unstaged difference: '+f);
const result={preservedLocalChanges:[...expected].sort(),trackedMoves:snapshot.records.filter(r=>r.tracked&&r.old!==r.next).length,unrelatedChangesStaged:false};
fs.writeFileSync('output/reorg99/wip-verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify({preservedLocalChanges:expected.size,trackedMoves:result.trackedMoves,unrelatedChangesStaged:false}));
