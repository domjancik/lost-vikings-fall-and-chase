import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const candidate=JSON.parse(fs.readFileSync('output/release-depth94/candidate.json','utf8'));
assert.ok(candidate.publishAllowed);
const files=[...candidate.files,'game.js','clockwork-view.js','style.css'];
const hashes=[];
for(let offset=0;offset<files.length;offset+=4)await Promise.all(files.slice(offset,offset+4).map(async file=>{
 const response=await fetch('https://united-marsh-6ppd.here.now/'+file+'?release=depth94');assert.equal(response.status,200,file);
 const bytes=Buffer.from(await response.arrayBuffer());
 const hash=b=>createHash('sha256').update(b).digest('hex');
 const sha256=hash(bytes);assert.equal(sha256,hash(fs.readFileSync('output/release-depth94/dist/'+file)),file);
 hashes.push({file,sha256});
}));
fs.writeFileSync('output/depth94/live-hashes.json',JSON.stringify({site:'https://united-marsh-6ppd.here.now/',files:hashes},null,2));
console.log(files.length+' live files match the reviewed candidate, including unchanged controls and mobile clockwork view.');
