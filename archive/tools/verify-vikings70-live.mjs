import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
const root='output/release-vikings70/dist',base='https://united-marsh-6ppd.here.now/';
const files=['index.html','hero-art.js','hero-frames.js','hero-geometry.js','sprite-render.js','movement.js',...['erik','baleog','olaf'].map(n=>'assets/vikings70/'+n+'.png')];
for(const f of files){const response=await fetch(base+f+'?release=70');if(!response.ok)throw Error(f+' HTTP '+response.status);let remote=Buffer.from(await response.arrayBuffer());const local=await fs.readFile(root+'/'+f),hash=v=>createHash('sha256').update(v).digest('hex');
 // here.now inserts these inspected social-preview tags, adding image tags once its preview renders.
 if(f==='index.html')remote=Buffer.from(remote.toString('utf8').replace(/<meta (?:property="og:(?:title|description|url|type|image(?::width|:height)?)"|name="twitter:(?:card|image)") content="[^"]*"\s*\/>\n?/g,''));
 if(hash(remote)!==hash(local))throw Error(f+' differs from reviewed release');}
console.log('8 live modules/sprite sheets match SHA256; authored HTML matches after removing hosting Open Graph tags.');
