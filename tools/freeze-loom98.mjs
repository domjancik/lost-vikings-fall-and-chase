import fs from 'node:fs';
const folder='output/release-loom98',dist=folder+'/dist',base='output/release-warden97/dist',draft=process.argv.includes('--draft');
const gates=JSON.parse(fs.readFileSync('assets/loom98/visual-gates.json','utf8'));
if(!draft&&(!gates.publicationAllowed||['sourceGate','runtimeGate'].some(k=>gates[k]?.verdict!=='accepted')))throw Error('Loom98 review incomplete');
const files=['loom-campaign96.js','loom-render96.js','loom-guide98.js'];
const assets=['guide-native.png','registration.json','visual-gates.json'].map(n=>'assets/loom98/'+n);
fs.mkdirSync(folder,{recursive:true});fs.cpSync(base,dist,{recursive:true});
for(const f of [...files,...assets]){fs.mkdirSync(dist+'/'+f.substring(0,f.lastIndexOf('/')),{recursive:true});fs.copyFileSync(f,dist+'/'+f);}
for(const f of fs.readdirSync(dist))if(/\.(js|html)$/.test(f))fs.writeFileSync(dist+'/'+f,fs.readFileSync(dist+'/'+f,'utf8').replace(/\?v=[a-zA-Z0-9-]+/g,'?v=loom98'));
const normalize=s=>s.replace(/\?v=[a-zA-Z0-9-]+/g,'').replace(/\r/g,'');
for(const f of fs.readdirSync(base).filter(f=>f.endsWith('.js')&&!files.includes(f)))if(normalize(fs.readFileSync(base+'/'+f,'utf8'))!==normalize(fs.readFileSync(dist+'/'+f,'utf8')))throw Error('Unrelated change '+f);
const publisher=fs.readFileSync('output/release-warden97/publish-update.mjs','utf8').replace('const files=[',`const loom98Gates=JSON.parse(await fs.readFile('dist/assets/loom98/visual-gates.json','utf8'));if(!loom98Gates.publicationAllowed||['sourceGate','runtimeGate'].some(k=>loom98Gates[k]?.verdict!=='accepted'))throw Error('Loom98 review incomplete');\nconst files=[${[...files,...assets].map(f=>JSON.stringify(f)).join(',')},`);
fs.writeFileSync(folder+'/publish-update.mjs',publisher);fs.writeFileSync(folder+'/candidate.json',JSON.stringify({base,files,assets,draft},null,2));
console.log('Loom98 frozen over reviewed Warden97; unrelated work excluded.');
