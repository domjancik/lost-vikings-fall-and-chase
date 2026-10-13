import fs from 'node:fs';
import path from 'node:path';
const draft=process.argv.includes('--draft'),folder='output/release-vikings90',dist=folder+'/dist';
const base='output/release-warden91/dist';
if(!fs.existsSync(base))throw Error('Verified Warden91 base is required');
fs.mkdirSync(folder,{recursive:true});fs.cpSync(base,dist,{recursive:true});
const files=['hero-art.js','hero-frames.js','hero-skins.js','projectile-collision.js','hero-shield-registration.js','game.js'];
for(const file of files)fs.copyFileSync(file,path.join(dist,file));
for(const name of ['erik','baleog','olaf']){
 const source=`assets/vikings90/${name}-native.png`,target=path.join(dist,source);fs.mkdirSync(path.dirname(target),{recursive:true});
 if(!fs.existsSync(source)&&!draft)throw Error(`Incomplete corrected kit: ${name}`);
 fs.copyFileSync(fs.existsSync(source)?source:`assets/vikings88/${name}-native.png`,target);
 files.push(source);
 const registration=`assets/vikings90/${name}-registration.json`,guide=`assets/vikings90/${name}-guide.json`;
 if(fs.existsSync(registration)&&fs.existsSync(guide)){
  const record=JSON.parse(fs.readFileSync(registration,'utf8'));
  for(const asset of [registration,guide,`assets/vikings90/${name}-guide-native.png`,...record.replacementRecords.map(r=>`assets/vikings90/${r.source}`)]){
   fs.copyFileSync(asset,path.join(dist,asset));files.push(asset);
  }
 }
}
fs.copyFileSync('viking-gallery90.html',path.join(dist,'viking-gallery90.html'));files.push('viking-gallery90.html');
fs.copyFileSync('assets/vikings90/visual-gates.json',path.join(dist,'assets/vikings90/visual-gates.json'));files.push('assets/vikings90/visual-gates.json');
for(const name of fs.readdirSync(dist))if(/\.(js|html)$/.test(name)){const p=path.join(dist,name);fs.writeFileSync(p,fs.readFileSync(p,'utf8').replaceAll(/\?v=[a-zA-Z0-9-]+/g,'?v=vikings90'));}
fs.writeFileSync(folder+'/candidate.json',JSON.stringify({draft,base:'verified Warden91',files,publishAllowed:false},null,2));
console.log(draft?'Local review candidate; missing heroes use unchanged88 art. Publication blocked.':'Complete local candidate; actual runtime gate still required.');
