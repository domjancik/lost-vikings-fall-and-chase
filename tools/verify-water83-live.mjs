import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
const root='output/release-water83/dist',base='https://united-marsh-6ppd.here.now/';
const files=['index.html','game.js','cycle-campaign.js','cycle-render.js','water-campaign.js','water-render.js','ground-shadow.js','view-camera.js','audio-events.js','hero-art.js','hero-frames.js','imagegen81-registration.js','sprite-render.js','assets/water83/nozzle-native.png','assets/water83/machines-native.png','assets/water83/motion-native.png','assets/water83/scene-raw.png'];
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const file of files){const r=await fetch(base+file+'?release=83');if(!r.ok)throw Error(file+' HTTP'+r.status);let bytes=Buffer.from(await r.arrayBuffer());if(file==='index.html')bytes=Buffer.from(bytes.toString().replace(/<meta (?:property="og:[^"]+"|name="twitter:card")[^>]*\/>\n?/g,''));if(hash(bytes)!==hash(await fs.readFile(root+'/'+file)))throw Error(file+' differs from tested build');}
console.log('17 deployed water/sprite files match the tested water83 build.');
