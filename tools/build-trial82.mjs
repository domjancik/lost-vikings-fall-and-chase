import fs from 'node:fs';
const root='output/release-trial82';
// Preserve the previously verified live release and unrelated workspace edits.
fs.cpSync('output/release-skins76',root,{recursive:true});
for(const f of ['hero-art.js','hero-frames.js','hero-skins.js','imagegen81-registration.js','game.js','sprite-render.js','clockwork-render.js','index.html']){
 let text=fs.readFileSync(f,'utf8');
 if(['game.js','sprite-render.js','clockwork-render.js','index.html'].includes(f))text=text.replaceAll('skins76','trial82');
 fs.writeFileSync(root+'/dist/'+f,text);
}
for(const f of ['assets/vikings81/erik-beard-correction-raw.png','assets/vikings81/olaf-imagegen-raw.png','assets/vikings80/baleog-imagegen-raw.png']){
 fs.mkdirSync(root+'/dist/'+f.slice(0,f.lastIndexOf('/')),{recursive:true});fs.copyFileSync(f,root+'/dist/'+f);
}
let publisher=fs.readFileSync(root+'/publish-update.mjs','utf8');
publisher=publisher.replace("'hero-skins.js'","'hero-skins.js','imagegen81-registration.js','assets/vikings81/erik-beard-correction-raw.png','assets/vikings81/olaf-imagegen-raw.png','assets/vikings80/baleog-imagegen-raw.png'");
fs.writeFileSync(root+'/publish-update.mjs',publisher);
console.log('Trial82 built over verified release76; three raw sources retained.');
