import fs from 'node:fs';
const folder='output/release-warden91',dist=folder+'/dist';fs.mkdirSync(folder,{recursive:true});fs.cpSync('output/release-warden89/dist',dist,{recursive:true});
const files=['warden-campaign.js','warden-combat.js','warden-render.js','warden-audio.js','assets/warden91/plunger-native.png','assets/warden91/registration.json','assets/warden91/emitter-native.png'];
for(const file of files){fs.mkdirSync(dist+'/'+file.substring(0,file.lastIndexOf('/')),{recursive:true});fs.copyFileSync(file,dist+'/'+file);}
for(const name of fs.readdirSync(dist))if(/\.(js|html)$/.test(name)){const p=dist+'/'+name;fs.writeFileSync(p,fs.readFileSync(p,'utf8').replaceAll(/\?v=[a-zA-Z0-9-]+/g,'?v=warden91'));}
fs.writeFileSync(folder+'/route-check.mjs',fs.readFileSync('warden-route.js','utf8').replace("'./engine.js'","'./dist/engine.js'"));
// Retain the complete verified asset manifest plus the new boss assets.
const publisher=fs.readFileSync('output/release-warden89/publish-update.mjs','utf8').replace('const files=[',"const files=['warden-combat.js','assets/warden91/plunger-native.png','assets/warden91/registration.json','assets/warden91/emitter-native.png',");
fs.writeFileSync(folder+'/publish-update.mjs',publisher);fs.writeFileSync(folder+'/overlay.json',JSON.stringify(files,null,2));console.log('Frozen boss91 on verified Warden89; sprites88 retained.');
