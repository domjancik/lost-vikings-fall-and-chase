import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
const root='output/release-momentum72/dist',base='https://united-marsh-6ppd.here.now/';
const files=['index.html','engine.js','game.js','cycle-campaign.js','cycle-render.js','momentum-campaign.js','momentum-render.js','assets/momentum72/ball.png'];
for(const f of files){const response=await fetch(base+f+'?release=72');if(!response.ok)throw Error(f+' HTTP '+response.status);let remote=Buffer.from(await response.arrayBuffer());const local=await fs.readFile(root+'/'+f),hash=v=>createHash('sha256').update(v).digest('hex');
 if(f==='index.html')remote=Buffer.from(remote.toString('utf8').replace(/<meta (?:property="og:(?:title|description|url|type|image(?::width|:height)?)"|name="twitter:(?:card|image)") content="[^"]*"\s*\/>\n?/g,''));
 if(hash(remote)!==hash(local))throw Error(f+' differs from reviewed release');}
console.log('8 live files match the reviewed release; hosting social tags normalized.');
