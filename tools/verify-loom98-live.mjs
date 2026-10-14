import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const candidate=JSON.parse(await fs.readFile('output/release-loom98/candidate.json','utf8'));
const files=[...candidate.files,...candidate.assets,'warden-render.js','warden-art97.js','depth-layout94.js','depth-render94.js','assets/warden97/parts-native.png'];
const evidence=await Promise.all(files.map(async file=>{
 const expected=await fs.readFile('output/release-loom98/dist/'+file),r=await fetch('https://united-marsh-6ppd.here.now/'+file+'?verify=loom98');
 if(!r.ok)throw Error(file+' HTTP '+r.status);const bytes=Buffer.from(await r.arrayBuffer()),hash=b=>createHash('sha256').update(b).digest('hex');
 if(hash(bytes)!==hash(expected))throw Error('Live content mismatch '+file);return{file,sha256:hash(bytes),size:bytes.length};
}));
await fs.writeFile('output/loom98/live-files.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify({verified:files.length,match:true}));
