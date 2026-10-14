import fs from 'node:fs';
const root='output/release-water87';
function copyRelease(from,to){fs.mkdirSync(to,{recursive:true});for(const entry of fs.readdirSync(from,{withFileTypes:true})){const src=from+'/'+entry.name,dst=to+'/'+entry.name;if(entry.isDirectory())copyRelease(src,dst);else if(entry.name.endsWith('.png')){if(!fs.existsSync(dst))fs.linkSync(src,dst);}else fs.copyFileSync(src,dst);}}
copyRelease('output/release-native85/dist',root+'/dist');
fs.copyFileSync('output/release-native85/publish-update.mjs',root+'/publish-update.mjs');
const files=['water-campaign.js','water-render.js','water-bell-geometry.js','water-connections.js','water-pontoon-geometry.js'];
if(fs.existsSync('water-art87.js'))files.push('water-art87.js');
for(const f of files)fs.copyFileSync(f,root+'/dist/'+f);
const assets=['assets/water87/machines-native-v2.png','assets/water87/registration-v2.json','assets/water87/nozzle-native.png','assets/water87/link-native.png','assets/water87/cradle-native.png'].filter(f=>fs.existsSync(f));
fs.mkdirSync(root+'/dist/assets/water87',{recursive:true});
for(const f of assets)fs.copyFileSync(f,root+'/dist/'+f);
for(const f of fs.readdirSync(root+'/dist'))if(f.endsWith('.js')||f==='index.html')fs.writeFileSync(root+'/dist/'+f,fs.readFileSync(root+'/dist/'+f,'utf8').replace(/\?v=[a-zA-Z0-9_-]+/g,'?v=water87'));
let publisher=fs.readFileSync(root+'/publish-update.mjs','utf8');
const additions=[...files.filter(f=>f!=='water-render.js'&&f!=='water-campaign.js'),...assets];
if(!/["']water-render\.js["']/.test(publisher))throw Error('Frozen publisher lacks water manifest anchor');
publisher=publisher.replace(/["']water-render\.js["']/,JSON.stringify('water-render.js')+','+JSON.stringify(additions).slice(1,-1));
for(const f of additions)if(!publisher.includes(JSON.stringify(f)))throw Error('Water87 publication dependency missing: '+f);
fs.writeFileSync(root+'/publish-update.mjs',publisher);
console.log('Water87 built over frozen native85; unrelated work excluded.');
