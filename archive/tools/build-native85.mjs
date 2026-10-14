import fs from 'node:fs';
const root='output/release-native85';
// Immutable frozen assets are hard-linked so another release does not duplicate
// hundreds of megabytes. Editable modules and publisher metadata are copied.
function copyRelease(from,to){fs.mkdirSync(to,{recursive:true});for(const entry of fs.readdirSync(from,{withFileTypes:true})){const src=from+'/'+entry.name,dst=to+'/'+entry.name;if(entry.isDirectory())copyRelease(src,dst);else if(entry.name.endsWith('.png')){if(!fs.existsSync(dst))fs.linkSync(src,dst);}else fs.copyFileSync(src,dst);}}
copyRelease('output/release-water83/dist',root+'/dist');
fs.copyFileSync('output/release-water83/publish-update.mjs',root+'/publish-update.mjs');
const files=['game.js','projectile-collision.js','native85-registration.js','hero-art.js','hero-frames.js','hero-skins.js','sprite-render.js'];
for(const f of files)fs.copyFileSync(f,root+'/dist/'+f);
const assets=['erik','baleog','olaf'].map(n=>`assets/vikings85-native/${n}-native.png`);
fs.mkdirSync(root+'/dist/assets/vikings85-native',{recursive:true});
for(const f of assets)fs.copyFileSync(f,root+'/dist/'+f);
for(const f of fs.readdirSync(root+'/dist'))if(f.endsWith('.js')||f==='index.html')fs.writeFileSync(root+'/dist/'+f,fs.readFileSync(root+'/dist/'+f,'utf8').replace(/\?v=[a-zA-Z0-9_-]+/g,'?v=native85'));
let publisher=fs.readFileSync(root+'/publish-update.mjs','utf8');
publisher=publisher.replace("'hero-skins.js'","'hero-skins.js',"+JSON.stringify(['native85-registration.js',...assets]).slice(1,-1));
fs.writeFileSync(root+'/publish-update.mjs',publisher);
console.log('Native85 built over verified frozen water83b.');
