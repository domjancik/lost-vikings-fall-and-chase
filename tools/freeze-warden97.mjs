import fs from 'node:fs';
const folder='output/release-warden97',dist=folder+'/dist',base='output/release-loom96/dist';
const gates=JSON.parse(fs.readFileSync('assets/warden97/visual-gates.json','utf8')),draft=process.argv.includes('--draft');
if(!draft&&(!gates.publicationAllowed||['sourceGate','runtimeGate'].some(k=>gates[k]?.verdict!=='accepted')))throw Error('Warden review incomplete');
const files=['warden-render.js','warden-art97.js','depth-layout94.js','depth-render94.js'];
const assets=['parts-native.png','broken-lens-native.png','plunger-native.png','emitter-native.png','registration.json','visual-gates.json'].map(n=>'assets/warden97/'+n);
fs.mkdirSync(folder,{recursive:true});fs.cpSync(base,dist,{recursive:true});
for(const f of [...files,...assets]){fs.mkdirSync(dist+'/'+f.substring(0,f.lastIndexOf('/')),{recursive:true});fs.copyFileSync(f,dist+'/'+f);}
for(const f of fs.readdirSync(dist))if(/\.(js|html)$/.test(f))fs.writeFileSync(dist+'/'+f,fs.readFileSync(dist+'/'+f,'utf8').replace(/\?v=[a-zA-Z0-9-]+/g,'?v=warden97'));
const normalize=s=>s.replace(/\?v=[a-zA-Z0-9-]+/g,'').replace(/\r/g,'');
for(const f of fs.readdirSync(base).filter(f=>f.endsWith('.js')&&!files.includes(f)))if(normalize(fs.readFileSync(base+'/'+f,'utf8'))!==normalize(fs.readFileSync(dist+'/'+f,'utf8')))throw Error('Unrelated change '+f);
const publisher=fs.readFileSync('output/release-loom96/publish-update.mjs','utf8').replace('const files=[',`const wardenGates=JSON.parse(await fs.readFile('dist/assets/warden97/visual-gates.json','utf8'));if(!wardenGates.publicationAllowed||['sourceGate','runtimeGate'].some(k=>wardenGates[k]?.verdict!=='accepted'))throw Error('Warden review incomplete');\nconst files=[${[...files,...assets].map(f=>JSON.stringify(f)).join(',')},`);
fs.writeFileSync(folder+'/publish-update.mjs',publisher);
fs.writeFileSync(folder+'/candidate.json',JSON.stringify({base,files,assets,draft,unchangedMechanics:true},null,2));
console.log('Warden97 frozen over verified Loom96, unrelated work excluded.');
