import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const candidate=JSON.parse(await fs.readFile('output/release-warden97/candidate.json','utf8'));
const files=[...candidate.files,...candidate.assets];
const evidence=await Promise.all(files.map(async file=>{
 const expected=await fs.readFile('output/release-warden97/dist/'+file),r=await fetch('https://united-marsh-6ppd.here.now/'+file+'?verify=warden97');
 if(!r.ok)throw Error(file+' HTTP '+r.status);const bytes=Buffer.from(await r.arrayBuffer()),hash=b=>createHash('sha256').update(b).digest('hex');
 if(hash(bytes)!==hash(expected))throw Error('Live content mismatch '+file);return{file,sha256:hash(bytes),size:bytes.length};
}));
await fs.writeFile('output/warden97/live-files.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify({verified:files.length,match:true}));
