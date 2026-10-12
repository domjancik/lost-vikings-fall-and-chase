import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='output/release-imagegen88/dist',base='https://united-marsh-6ppd.here.now/';
const files=['index.html','game.js','projectile-collision.js','hero-art.js','hero-frames.js','hero-skins.js','sprite-render.js','imagegen88-registration.js','viking-gallery88.html','water-campaign.js','water-render.js','water-art87.js'];
for(const hero of ['erik','baleog','olaf']){
 const registration=JSON.parse(await fs.readFile(root+'/assets/vikings88/'+hero+'-registration.json','utf8'));
 for(const name of [hero+'-native.png',hero+'-registration.json',registration.source,'guides-'+hero+'.png','guides-'+hero+'-frames.json'])files.push('assets/vikings88/'+name);
}
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const file of files){
 const response=await fetch(base+file+'?release=88');
 if(!response.ok)throw Error(file+' HTTP '+response.status);
 let bytes=Buffer.from(await response.arrayBuffer());
 if(file.endsWith('.html'))bytes=Buffer.from(bytes.toString().replace(/<meta (?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*\/>\n?/g,''));
 if(hash(bytes)!==hash(await fs.readFile(root+'/'+file)))throw Error(file+' differs from tested build');
}
console.log(files.length+' deployed files match reviewed Imagegen88 build.');
