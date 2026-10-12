import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const folder='output/release-warden89',baseline='output/release-imagegen88/dist',dist=folder+'/dist';
const overlay=JSON.parse(fs.readFileSync(folder+'/overlay.json'));
const normalize=s=>s.replaceAll(/\?v=[a-zA-Z0-9-]+/g,'?v=warden89');
for(const name of fs.readdirSync(baseline)){
 const old=path.join(baseline,name),fresh=path.join(dist,name);
 if(!fs.statSync(old).isFile()||overlay.includes(name))continue;
 if(/\.(js|html)$/.test(name))assert.equal(fs.readFileSync(fresh,'utf8'),normalize(fs.readFileSync(old,'utf8')),name+' differs from trusted baseline');
 else assert.ok(fs.readFileSync(old).equals(fs.readFileSync(fresh)),name+' differs from trusted baseline');
}
for(const name of overlay){
 if(/\.(js|html)$/.test(name))assert.equal(fs.readFileSync(dist+'/'+name,'utf8'),normalize(fs.readFileSync(name,'utf8')));
 else assert.ok(fs.readFileSync(name).equals(fs.readFileSync(dist+'/'+name)));
}
for(const name of fs.readdirSync(dist).filter(n=>n.endsWith('.js'))){
 for(const match of fs.readFileSync(dist+'/'+name,'utf8').matchAll(/from\s+['"](\.\/[^'"?]+)(?:\?[^'"]*)?['"]/g))assert.ok(fs.existsSync(path.resolve(dist,match[1])),name+' missing '+match[1]);
}
assert.equal((fs.readFileSync(dist+'/index.html','utf8').match(/id="play-warden"/g)||[]).length,1);
assert.match(fs.readFileSync(folder+'/publish-update.mjs','utf8'),/\.json':'application\/json/);
console.log('Release89: trusted baseline preserved, overlays exact, module imports complete, menu unique, JSON MIME valid.');
