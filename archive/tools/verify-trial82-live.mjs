import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
const root='output/release-trial82/dist',base='https://united-marsh-6ppd.here.now/';
const files=['game.js','hero-art.js','hero-frames.js','hero-skins.js','imagegen81-registration.js','sprite-render.js','clockwork-render.js','assets/vikings81/erik-beard-correction-raw.png','assets/vikings81/olaf-imagegen-raw.png','assets/vikings80/baleog-imagegen-raw.png'];
for(const file of files){
 const response=await fetch(base+file+'?release=82');if(!response.ok)throw Error(file+' HTTP'+response.status);
 const remote=Buffer.from(await response.arrayBuffer()),local=await fs.readFile(root+'/'+file),hash=b=>createHash('sha256').update(b).digest('hex');
 if(hash(remote)!==hash(local))throw Error(file+' differs from tested build');
}
console.log('10 deployed skin files and raw sources match the tested trial82 build.');
