import fs from 'node:fs';
const folder='output/release-warden89',dist=folder+'/dist';fs.mkdirSync(folder,{recursive:true});fs.cpSync('output/release-imagegen88/dist',dist,{recursive:true});
const files=['cycle-campaign.js','cycle-render.js','game.js','index.html','warden-campaign.js','warden-render.js','warden-art89.js','warden-audio.js','assets/warden89/parts-native.png','assets/warden89/scene-native.png','assets/warden89/broken-lens-native.png','assets/warden89/registration.json'];
for(const file of files){fs.mkdirSync(dist+'/'+file.substring(0,file.lastIndexOf('/')),{recursive:true});fs.copyFileSync(file,dist+'/'+file);}
for(const name of fs.readdirSync(dist))if(/\.(js|html)$/.test(name)){const p=dist+'/'+name;fs.writeFileSync(p,fs.readFileSync(p,'utf8').replaceAll(/\?v=[a-zA-Z0-9-]+/g,'?v=warden89'));}
fs.writeFileSync(folder+'/route-check.mjs',fs.readFileSync('warden-route.js','utf8').replace("'./engine.js'","'./dist/engine.js'"));
let publisher=fs.readFileSync('output/release-imagegen88/publish-update.mjs','utf8');publisher=publisher.replace('const files=[','const files='+JSON.stringify(files)+'.concat([').replace("'assets/pixel/parallax-scenes.png'];","'assets/pixel/parallax-scenes.png']);");
publisher=publisher.replace("'.png':'image/png'","'.png':'image/png','.json':'application/json'");
fs.writeFileSync(folder+'/publish-update.mjs',publisher);fs.writeFileSync(folder+'/overlay.json',JSON.stringify(files,null,2));console.log('Frozen Warden89 over verified Imagegen88; unrelated work excluded.');
