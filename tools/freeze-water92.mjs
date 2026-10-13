import fs from 'node:fs';
import path from 'node:path';
const draft=process.argv.includes('--draft'),folder='output/release-water92',dist=folder+'/dist';
const base='output/release-vikings90/dist';
if(!fs.existsSync(base))throw Error('Verified Viking90/Warden91 base required');
const gates=JSON.parse(fs.readFileSync('assets/water92/visual-gates.json','utf8'));
if(!draft&&(!gates.publicationAllowed||gates.sourceGate.verdict!=='accept'||gates.runtimeGate.verdict!=='accept'))throw Error('Water92 visual review incomplete');
fs.mkdirSync(folder,{recursive:true});fs.cpSync(base,dist,{recursive:true});
const files=['water-campaign.js','water-pontoon-geometry.js','water-bell-geometry92.js','water-render.js','water-art92.js','water-terrain92.js','water-effects92.js'];
for(const name of ['machines-native.png','nozzle-native.png','cradle-native.png','scene-native.png','terrain-native.png','flora-native.png','registration.json','visual-gates.json'])files.push('assets/water92/'+name);
for(const file of files){const target=path.join(dist,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
for(const name of fs.readdirSync(dist))if(/\.(js|html)$/.test(name)){const p=path.join(dist,name);fs.writeFileSync(p,fs.readFileSync(p,'utf8').replaceAll(/\?v=[a-zA-Z0-9-]+/g,'?v=water92'));}
let publisher=fs.readFileSync('output/release-vikings90/publish-update.mjs','utf8');
publisher=publisher.replace("const files=[",`const waterGates=JSON.parse(await fs.readFile('dist/assets/water92/visual-gates.json','utf8'));if(!waterGates.publicationAllowed||waterGates.sourceGate.verdict!=='accept'||waterGates.runtimeGate.verdict!=='accept')throw Error('Water review incomplete');\nconst files=[${files.map(f=>JSON.stringify(f)).join(',')},`);
fs.writeFileSync(folder+'/publish-update.mjs',publisher);
fs.writeFileSync(folder+'/candidate.json',JSON.stringify({draft,base:'verified published Viking90/Warden91',files,publishAllowed:!draft&&gates.publicationAllowed},null,2));
console.log(draft?'Local review candidate; publication blocked.':'Reviewed Water92 ready for publication.');
