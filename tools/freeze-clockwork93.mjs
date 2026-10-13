import fs from 'node:fs';
const folder='output/release-clockwork93',dist=folder+'/dist';
fs.mkdirSync(folder,{recursive:true});fs.cpSync('output/release-water92/dist',dist,{recursive:true});
for(const f of ['game.js','clockwork-view.js'])fs.copyFileSync(f,dist+'/'+f);
for(const f of fs.readdirSync(dist))if(/\.(js|html)$/.test(f))fs.writeFileSync(dist+'/'+f,fs.readFileSync(dist+'/'+f,'utf8').replaceAll(/\?v=[a-zA-Z0-9-]+/g,'?v=clockwork93'));
fs.copyFileSync('output/release-water92/publish-update.mjs',folder+'/publish-update.mjs');
console.log('Frozen mobile inset correction over verified Water92.');
