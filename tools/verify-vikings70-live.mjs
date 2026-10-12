import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
const root='output/release-vikings70/dist',base='https://united-marsh-6ppd.here.now/';
const files=['index.html','hero-art.js','hero-frames.js','hero-geometry.js','sprite-render.js','movement.js',...['erik','baleog','olaf'].map(n=>'assets/vikings70/'+n+'.png')];
for(const f of files){const response=await fetch(base+f+'?release=70');if(!response.ok)throw Error(f+' HTTP '+response.status);const remote=Buffer.from(await response.arrayBuffer()),local=await fs.readFile(root+'/'+f),hash=v=>createHash('sha256').update(v).digest('hex');if(hash(remote)!==hash(local))throw Error(f+' differs from reviewed release');}
console.log('9 live entry/runtime/sprite files match the reviewed release by SHA256.');
