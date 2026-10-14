// One-time, reversible structural migration. Snapshots live under ignored output.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {moduleSpecifiers} from '../build/manifest.mjs';
const root=path.resolve('.'),backup='output/reorg99',git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:16*1024*1024});
const hash=b=>createHash('sha256').update(b).digest('hex');
const posix=path.posix;
const read=f=>fs.readFileSync(f,'utf8');
const write=(f,b)=>{fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,b);};
const snapshotFile=backup+'/snapshot.json';
function destination(name){
 if(name.startsWith('browser-'))return'archive/browser/'+name;
 if(name.endsWith('.test.js'))return'tests/unit/'+name;
 if(/-route\d*\.js$/.test(name))return'tests/routes/'+name;
 if(name.endsWith('.js')){
  for(const level of ['clockwork','refraction','momentum','water','warden','loom'])if(name.startsWith(level+'-'))return`src/levels/${level}/`+name.slice(level.length+1).replace(/\d+(?=\.js$)/,'');
  if(name.startsWith('cycle-'))return'src/campaigns/machines/'+name;
  if(name.startsWith('story-'))return'src/campaigns/story/'+name;
  if(['levels.js','campaign.js','campaign-render.js','inventory-campaign.js','vertical-campaign.js'].includes(name))return'src/campaigns/arcade/'+name;
  if(name.startsWith('hero-')||/^(imagegen|native)\d+/.test(name)||name==='sprite-render.js')return'src/heroes/'+name;
  if(['audio-events.js','sound-effects.js'].includes(name))return'src/audio/'+name;
  if(['game.js','controls.js','hint-visibility.js'].includes(name)||name.startsWith('campaign-')||name.startsWith('level-preview'))return'src/app/'+name.replace(/\d+(?=\.js$)/,'');
  if(['engine.js','movement.js','health.js','inventory.js','interactions.js','bash.js','projectile-collision.js','ladder-context.js','plunger.js','forge-material.js'].includes(name))return'src/core/'+name;
  return'src/render/'+name;
 }
 if(name.endsWith('.mjs'))return'archive/scripts/'+name;
 if(name.endsWith('.py'))return'archive/art-scripts/'+name;
 if(name.endsWith('.txt'))return'docs/history/prompts/'+name;
 if(name.endsWith('.md')&&!['AGENTS.md','README.md'].includes(name)){
  if(['VISUAL-REVIEW-GATE.md','HUMAN-SCALE.md','ART-DIRECTION-CLOCKWORK.md'].includes(name))return'docs/standards/'+name;
  return'docs/history/'+name;
 }
 return name;
}
function artGroup(name){for(const group of ['vikings','warden','water','loom','depth','clockwork','momentum','refraction','terrain','scene','campaign','pixel'])if(name.includes(group))return group;return'shared';}
export function rewrite(text,oldFile,newFile,map){
 if(newFile.startsWith('archive/')&&!newFile.startsWith('archive/modules/'))return text;
 if(/\.(js|mjs|html)$/.test(oldFile)){
  let refs=[];
  if(oldFile.endsWith('.html')){
   for(const m of text.matchAll(/(?:from\s*|import\s*\(\s*|\bsrc=|\bhref=)(['"])([^'"]+)\1/g))refs.push({value:m[2],start:m.index+m[0].indexOf(m[2]),end:m.index+m[0].indexOf(m[2])+m[2].length});
  }else refs=moduleSpecifiers(text);
  for(const r of refs.sort((a,b)=>b.start-a.start)){
   if(!r.value.startsWith('.')&&!(oldFile.endsWith('.html')&&!/^(?:[a-z]+:|\/|#)/i.test(r.value)))continue;
   const [plain,suffix='']=r.value.split(/(?=[?#])/),target=posix.normalize(posix.join(posix.dirname(oldFile),plain));
   if(!map[target])continue;
   let next=posix.relative(posix.dirname(newFile),map[target]);if(!next.startsWith('.'))next='./'+next;
   text=text.slice(0,r.start)+next+suffix+text.slice(r.end);
  }
 }
 if(/\.(js|mjs|py)$/.test(oldFile)){
  // Repository-relative filesystem reads/writes, not browser asset URLs.
  text=text.replace(/(['"])([^'"\r\n]+)\1/g,(all,q,value)=>map[value]?q+map[value]+q:all);
  text=text.replace(/new URL\((['"])\.\/assets\//g,`new URL($1${posix.relative(posix.dirname(newFile),'assets')}/`);
 }
 if(oldFile.endsWith('.py'))text=text.replaceAll('Path(__file__).resolve().parents[1]',"next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())");
 if(oldFile.endsWith('.py'))text=text.replaceAll("Path(__file__).parent / 'pixel-art-fixer'","next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file()) / 'tools/pixel-art-fixer'").replaceAll("Path(__file__).resolve().parent/'pixel-art-fixer'","next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())/'tools/pixel-art-fixer'");
 if(oldFile.endsWith('.py'))text=text.replaceAll('Path(__file__).resolve().parent.parent',"next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())").replaceAll("Path(__file__).parent/'pixel-art-fixer", "next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())/'tools/pixel-art-fixer");
 if(oldFile.endsWith('.py'))text=text.replaceAll('archive/tools/resample-scene67.mjs','tools/art/scene/resample-scene67.mjs').replaceAll('archive/tools/compare-scene67.mjs','tools/art/scene/compare-scene67.mjs');
 if(oldFile.endsWith('.md'))text=text.replace(/\]\(([^)]+)\)/g,(all,value)=>{
  if(/^(https?:|#|app:|codex:)/.test(value))return all;
  const [plain,suffix='']=value.split(/(?=#)/),target=posix.normalize(posix.join(posix.dirname(oldFile),plain));
  const next=map[target]||target;
  if(next===target&&oldFile===newFile)return all;
  return']('+posix.relative(posix.dirname(newFile),next)+suffix+')';
 });
 return text;
}
if(!fs.existsSync(snapshotFile)){
 if(fs.existsSync('src/app/game.js'))throw Error('Migration already applied; use the documented source layout');
 if(git('diff','--cached','--name-only').trim())throw Error('Preserve existing staging before migration');
 const tracked=new Set(git('ls-files').trim().split(/\r?\n/));
 const map={};for(const f of fs.readdirSync('.'))if(fs.statSync(f).isFile()){const d=destination(f);if(d!==f)map[f]=d;}
 for(const f of fs.readdirSync('tools')){
  const old='tools/'+f;if(!fs.statSync(old).isFile())continue;
  if(f.endsWith('.py'))map[old]='tools/art/'+artGroup(f)+'/'+f;
  if(f.endsWith('.mjs'))map[old]=f.startsWith('browser-')?'tests/browser/runners/'+f:'archive/tools/'+f;
 }
 // Historical art89 and current art97 must not collapse onto the same source.
 if(map['warden-art89.js'])map['warden-art89.js']='src/levels/warden/legacy-art89.js';
 const groups=new Map();for(const [old,next]of Object.entries(map)){if(!groups.has(next))groups.set(next,[]);groups.get(next).push(old);}
 for(const [next,olds]of groups)if(olds.length>1){
  olds.sort((a,b)=>Number(b.match(/(\d+)\.js$/)?.[1]||0)-Number(a.match(/(\d+)\.js$/)?.[1]||0));
  for(const old of olds.slice(1))map[old]=posix.join(posix.dirname(next),'legacy-'+posix.basename(old).replace(/^[^-]+-/,''));
 }
 const ignoreResult=spawnSync('git',['check-ignore','--stdin'],{input:Object.keys(map).join('\n')+'\n',encoding:'utf8',maxBuffer:4*1024*1024});
 if(ignoreResult.status>1)throw Error(ignoreResult.stderr);
 const ignored=new Set(ignoreResult.stdout.trim().split(/\r?\n/));
 const outputs=Object.values(map);if(new Set(outputs).size!==outputs.length)throw Error('Migration destination collision');
 const edits=['AGENTS.md',...fs.readdirSync('skills').map(f=>'skills/'+f+'/SKILL.md').filter(f=>fs.existsSync(f)),...Object.keys(map)];
 for(const f of fs.readdirSync('.').filter(f=>f.endsWith('.html')))edits.push(f);
 const records=[];for(const old of [...new Set(edits)]){
  const bytes=fs.readFileSync(old);write(backup+'/before/'+old,bytes);
  let head=null;if(tracked.has(old)){head=execFileSync('git',['show','HEAD:'+old]);write(backup+'/head/'+old,head);}
  records.push({old,next:map[old]||old,tracked:tracked.has(old),ignored:ignored.has(old),beforeHash:hash(bytes),headHash:head?hash(head):null});
 }
 write(backup+'/before.patch',execFileSync('git',['diff','--binary']));
 write(snapshotFile,JSON.stringify({branch:git('branch','--show-current').trim(),head:git('rev-parse','HEAD').trim(),map,records},null,2));
 write('config/source-map.json',JSON.stringify(map,null,2)+'\n');
 const publisher=read('output/release-loom98/publish-update.mjs'),assets=[...new Set([...publisher.matchAll(/(['"])(assets\/[^'"\r\n]+)\1/g)].map(m=>m[2]))].sort();
 const modules=Object.keys(map).filter(f=>f.endsWith('.js')&&!f.startsWith('browser-')&&!f.endsWith('.test.js')&&!/-route\d*\.js$/.test(f)).map(f=>({source:map[f],output:f}));
 const files=['index.html','style.css','hero-art-preview.html','connection-kit-preview.html','viking-gallery88.html','viking-gallery90.html'].map(f=>({source:f,output:f}));
 write('config/release-manifest.json',JSON.stringify({version:1,entrypoints:['index.html'],modules,files,assets},null,2)+'\n');
 console.log('Saved original working bytes, HEAD bytes and explicit migration/release maps.');
}
const snapshot=JSON.parse(read(snapshotFile)),{map,records}=snapshot;
if((process.argv.includes('--apply')||process.argv.includes('--stage'))&&git('rev-parse','HEAD').trim()!==snapshot.head)throw Error('Repository history changed; do not replay a historical migration snapshot');
if(process.argv.includes('--apply')&&fs.existsSync(backup+'/applied.json'))throw Error('Migration already applied; do not overwrite later edits');
if(process.argv.includes('--stage')&&fs.existsSync(backup+'/staged.json'))throw Error('Migration already staged; preserve later index changes');
if(process.argv.includes('--apply')){
 for(const r of records){
  const original=read(backup+'/before/'+r.old),next=rewrite(original,r.old,r.next,map);
  write(r.next,next);
  if(r.old!==r.next&&fs.existsSync(r.old)){const resolved=path.resolve(r.old);if(!resolved.startsWith(root+path.sep))throw Error('Move outside workspace');fs.unlinkSync(r.old);}
 }
 const extras=records.filter(r=>r.ignored&&r.old!==r.next).map(r=>r.next);
 if(extras.length)fs.appendFileSync('.gitignore','\n# Preserved local historical probes\n'+extras.join('\n')+'\n');
 const pkg=JSON.parse(read('package.json'));pkg.scripts={test:'node --test tests/*.test.js tests/unit/*.test.js tests/build/*.test.js',dev:'node tools/dev/server.mjs',build:'node tools/build/build.mjs','release:check':'node tools/release/check.mjs','test:browser':'node tests/browser/reorg-smoke.mjs'};write('package.json',JSON.stringify(pkg,null,2)+'\n');
 write(backup+'/applied.json',JSON.stringify({files:records.length,preservedDirty:records.filter(r=>r.headHash&&r.beforeHash!==r.headHash).map(r=>({before:r.old,after:r.next}))},null,2));
 console.log('Moved files and rewrote only structural references; asset bytes unchanged.');
}
if(process.argv.includes('--stage')){
 // Stage transformed HEAD, not the user's pre-existing changes. Those remain
 // visible as unstaged diffs at their new paths after the structural commit.
 for(const r of records.filter(r=>r.tracked)){
  const head=read(backup+'/head/'+r.old),next=rewrite(head,r.old,r.next,map);
  const id=execFileSync('git',['hash-object','-w','--stdin'],{input:Buffer.from(next),encoding:'utf8'}).trim();
  if(r.old!==r.next)git('update-index','--force-remove',r.old);
  git('update-index','--add','--cacheinfo','100644,'+id+','+r.next);
 }
 console.log('Staged structural HEAD changes; original working changes remain unstaged.');
 write(backup+'/staged.json',JSON.stringify({head:snapshot.head,staged:true}));
}
