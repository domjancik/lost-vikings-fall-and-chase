import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
const root='output/release-skins73/dist',base='https://united-marsh-6ppd.here.now/';
for(const f of ['index.html','style.css','game.js','hero-art.js','hero-frames.js','hero-skins.js','sprite-render.js']){
 const r=await fetch(base+f+'?release=73');if(!r.ok)throw Error(f+' HTTP'+r.status);let remote=Buffer.from(await r.arrayBuffer());
 if(f==='index.html')remote=Buffer.from(remote.toString('utf8').replace(/<meta (?:property="og:(?:title|description|url|type|image(?::width|:height)?)"|name="twitter:(?:card|image)") content="[^"]*"\s*\/>\n?/g,''));
 const local=await fs.readFile(root+'/'+f),hash=v=>createHash('sha256').update(v).digest('hex');if(hash(remote)!==hash(local))throw Error(f+' mismatch');
}console.log('7 live files match reviewed selector/shield release.');
