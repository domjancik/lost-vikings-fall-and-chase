import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='output/release-clockwork71/dist',base='https://united-marsh-6ppd.here.now/';
const files=['index.html','engine.js','game.js','cycle-campaign.js','cycle-render.js','clockwork-campaign.js','clockwork-render.js','clockwork-view.js','assets/clockwork71/tower.png'];
for(const f of files){
 const response=await fetch(base+f+'?release=71');
 if(!response.ok)throw Error(f+' HTTP '+response.status);
 let remote=Buffer.from(await response.arrayBuffer());
 const local=await fs.readFile(root+'/'+f),hash=v=>createHash('sha256').update(v).digest('hex');
 // Hosting inserts only these inspected social-preview tags.
 if(f==='index.html')remote=Buffer.from(remote.toString('utf8').replace(/<meta (?:property="og:(?:title|description|url|type|image(?::width|:height)?)"|name="twitter:(?:card|image)") content="[^"]*"\s*\/>\n?/g,''));
 if(hash(remote)!==hash(local))throw Error(f+' differs from reviewed release');
}
console.log('9 live runtime/art files match the reviewed release; HTML normalized only for hosting social-preview tags.');
