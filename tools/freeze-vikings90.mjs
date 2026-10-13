import fs from 'node:fs';
import path from 'node:path';
const draft=process.argv.includes('--draft'),folder='output/release-vikings90',dist=folder+'/dist';
fs.mkdirSync(folder,{recursive:true});fs.cpSync('output/release-warden89/dist',dist,{recursive:true});
const files=['hero-art.js','hero-frames.js','hero-skins.js'];
for(const file of files)fs.copyFileSync(file,path.join(dist,file));
for(const name of ['erik','baleog','olaf']){
 const source=`assets/vikings90/${name}-native.png`,target=path.join(dist,source);fs.mkdirSync(path.dirname(target),{recursive:true});
 if(!fs.existsSync(source)&&!draft)throw Error(`Incomplete corrected kit: ${name}`);
 fs.copyFileSync(fs.existsSync(source)?source:`assets/vikings88/${name}-native.png`,target);
 files.push(source);
}
for(const name of fs.readdirSync(dist))if(/\.(js|html)$/.test(name)){const p=path.join(dist,name);fs.writeFileSync(p,fs.readFileSync(p,'utf8').replaceAll(/\?v=[a-zA-Z0-9-]+/g,'?v=vikings90'));}
fs.writeFileSync(folder+'/candidate.json',JSON.stringify({draft,base:'verified Warden89',files,publishAllowed:false},null,2));
console.log(draft?'Local review candidate; missing heroes use unchanged88 art. Publication blocked.':'Complete local candidate; actual runtime gate still required.');
