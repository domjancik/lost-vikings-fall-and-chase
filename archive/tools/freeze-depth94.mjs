import fs from 'node:fs';
import path from 'node:path';
const draft=process.argv.includes('--draft'),folder='output/release-depth94',dist=folder+'/dist';
const gates=JSON.parse(fs.readFileSync('assets/depth94/visual-gates.json','utf8'));
if(!draft&&!gates.publicationAllowed)throw Error('Decorative art visual gates incomplete');
fs.mkdirSync(folder,{recursive:true});fs.cpSync('output/release-clockwork93/dist',dist,{recursive:true});
const files=['depth-layout94.js','depth-render94.js',...['cycle','refraction','momentum','clockwork','water','warden'].map(n=>n+'-render.js'),...['a-native.png','b-native.png','a-registration.json','b-registration.json','visual-gates.json'].map(n=>'assets/depth94/'+n)];
for(const file of files){fs.mkdirSync(path.dirname(dist+'/'+file),{recursive:true});fs.copyFileSync(file,dist+'/'+file);}
for(const f of fs.readdirSync(dist))if(/\.(js|html)$/.test(f))fs.writeFileSync(dist+'/'+f,fs.readFileSync(dist+'/'+f,'utf8').replaceAll(/\?v=[a-zA-Z0-9-]+/g,'?v=depth94'));
const normalize=s=>s.replace(/\?v=[a-zA-Z0-9-]+/g,'').replace(/\r/g,'');
for(const file of fs.readdirSync(dist).filter(n=>/(campaign|combat|movement|health|inventory|engine)\.js$/.test(n)))if(normalize(fs.readFileSync(dist+'/'+file,'utf8'))!==normalize(fs.readFileSync('output/release-clockwork93/dist/'+file,'utf8')))throw Error('Looks-only invariant violated: '+file);
let publisher=fs.readFileSync('output/release-clockwork93/publish-update.mjs','utf8');
publisher=publisher.replace('const files=[',`const depthGates=JSON.parse(await fs.readFile('dist/assets/depth94/visual-gates.json','utf8'));if(!depthGates.publicationAllowed)throw Error('Depth visual review incomplete');\nconst files=[${files.map(f=>JSON.stringify(f)).join(',')},`);
fs.writeFileSync(folder+'/publish-update.mjs',publisher);
fs.writeFileSync(folder+'/candidate.json',JSON.stringify({draft,base:'verified published Clockwork93',files,publishAllowed:!draft&&gates.publicationAllowed,mechanicsIdentical:true},null,2));
console.log(draft?'Local visual review candidate.':'Reviewed decorative candidate; gameplay modules identical.');
