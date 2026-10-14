import fs from 'node:fs';
const root='output/release-imagegen88';
function copyRelease(from,to){fs.mkdirSync(to,{recursive:true});for(const entry of fs.readdirSync(from,{withFileTypes:true})){const src=from+'/'+entry.name,dst=to+'/'+entry.name;if(entry.isDirectory())copyRelease(src,dst);else if(entry.name.endsWith('.png')){if(!fs.existsSync(dst))fs.linkSync(src,dst);}else fs.copyFileSync(src,dst);}}
copyRelease('output/release-water87/dist',root+'/dist');
fs.copyFileSync('output/release-water87/publish-update.mjs',root+'/publish-update.mjs');
const files=['game.js','projectile-collision.js','imagegen88-registration.js','hero-art.js','hero-frames.js','hero-skins.js','sprite-render.js','viking-gallery88.html'];
for(const f of files)fs.copyFileSync(f,root+'/dist/'+f);
const assets=[];
for(const n of ['erik','baleog','olaf']){
 const base='assets/vikings88/',registration=JSON.parse(fs.readFileSync(base+n+'-registration.json','utf8'));
 for(const suffix of ['.png','-frames.json'])fs.copyFileSync(`assets/vikings86-native/${n}${suffix==='.png'?'-native.png':suffix}`,base+'guides-'+n+suffix);
 assets.push(base+n+'-native.png',base+n+'-registration.json',base+registration.source,base+'guides-'+n+'.png',base+'guides-'+n+'-frames.json');
}
fs.mkdirSync(root+'/dist/assets/vikings88',{recursive:true});
for(const f of assets)fs.copyFileSync(f,root+'/dist/'+f);
for(const f of fs.readdirSync(root+'/dist'))if(f.endsWith('.js')||f==='index.html')fs.writeFileSync(root+'/dist/'+f,fs.readFileSync(root+'/dist/'+f,'utf8').replace(/\?v=[a-zA-Z0-9_-]+/g,'?v=imagegen88'));
let publisher=fs.readFileSync(root+'/publish-update.mjs','utf8');
const additions=['imagegen88-registration.js','viking-gallery88.html',...assets];
if(!/["']hero-skins\.js["']/.test(publisher))throw Error('Frozen publisher lacks hero skin manifest anchor');
publisher=publisher.replace(/["']hero-skins\.js["']/,JSON.stringify('hero-skins.js')+','+JSON.stringify(additions).slice(1,-1));
for(const f of additions)if(!publisher.includes(JSON.stringify(f)))throw Error('Imagegen88 publication dependency missing: '+f);
fs.writeFileSync(root+'/publish-update.mjs',publisher);
console.log('Imagegen88 built over verified frozen water87.');
