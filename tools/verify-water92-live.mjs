import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const candidate=JSON.parse(fs.readFileSync('output/release-water92/candidate.json'));
const previous=JSON.parse(fs.readFileSync('output/release-vikings90/candidate.json'));
const files=[...new Set([...candidate.files,...previous.files,...JSON.parse(fs.readFileSync('output/release-warden91/overlay.json')),'index.html','cycle-campaign.js','cycle-render.js'])];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),checked=[];
for(let i=0;i<files.length;i+=4)checked.push(...await Promise.all(files.slice(i,i+4).map(async file=>{
 const response=await fetch('https://united-marsh-6ppd.here.now/'+file+'?release=water92-verification');
 assert.equal(response.status,200,file+' HTTP');
 const actual=Buffer.from(await response.arrayBuffer()),expected=fs.readFileSync('output/release-water92/dist/'+file);
 const normalized=file.endsWith('.html')?Buffer.from(actual.toString('utf8').replace(/<meta (?:property="og:(?:title|description|url|type)"|name="twitter:card") content="[^"]*" \/>\n?/g,'')):actual;
 assert.equal(sha(normalized),sha(expected),file+' live content differs');
 return {file,sha256:sha(actual),sourceSha256:sha(expected),bytes:actual.length};
})));
fs.writeFileSync('output/water92/live-hashes.json',JSON.stringify(checked,null,2));
console.log(checked.length+' live Water92 and retained Viking90/Warden91 files verified.');
