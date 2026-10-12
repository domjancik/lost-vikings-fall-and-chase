import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const files=JSON.parse(fs.readFileSync('output/release-warden89/overlay.json'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const checked=await Promise.all(files.map(async file=>{
 const response=await fetch('https://united-marsh-6ppd.here.now/'+file+'?release=warden89-verification');
 assert.equal(response.status,200,file+' HTTP');
 const actual=Buffer.from(await response.arrayBuffer()),expected=fs.readFileSync('output/release-warden89/dist/'+file);
 assert.equal(sha(actual),sha(expected),file+' live content differs');
 return {file,sha256:sha(actual),bytes:actual.length};
}));
fs.writeFileSync('output/warden89/live-hashes.json',JSON.stringify(checked,null,2));
console.log(checked.length+' Warden deployment files match the verified frozen release exactly.');
