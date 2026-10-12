import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='output/release-water87/dist',base='https://united-marsh-6ppd.here.now/';
const files=['index.html','game.js','water-campaign.js','water-render.js','water-art87.js','water-bell-geometry.js','water-connections.js','water-pontoon-geometry.js','hero-art.js','hero-frames.js','sprite-render.js','assets/water87/machines-native-v2.png','assets/water87/registration-v2.json','assets/water87/nozzle-native.png','assets/water87/link-native.png','assets/water87/cradle-native.png'];
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const file of files){
  const r=await fetch(base+file+'?release=87');
  if(!r.ok)throw Error(file+' HTTP'+r.status);
  let bytes=Buffer.from(await r.arrayBuffer());
  if(file==='index.html')bytes=Buffer.from(bytes.toString().replace(/<meta (?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*\/>\n?/g,''));
  if(hash(bytes)!==hash(await fs.readFile(root+'/'+file)))throw Error(file+' differs from tested build');
}
console.log(files.length+' deployed files match the reviewed water87 build.');
