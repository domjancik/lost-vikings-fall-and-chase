import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const files=[...new Set([...JSON.parse(fs.readFileSync('output/release-warden91/overlay.json')),'index.html','game.js','cycle-campaign.js','hero-art.js','hero-skins.js'])];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const checked=await Promise.all(files.map(async file=>{
 const response=await fetch('https://united-marsh-6ppd.here.now/'+file+'?release=warden91-verification');
 assert.equal(response.status,200,file+' HTTP');
 const actual=Buffer.from(await response.arrayBuffer()),expected=fs.readFileSync('output/release-warden91/dist/'+file);
 // here.now injects exactly these sharing metadata tags into HTML. Check
 // the whole document after removing that bounded hosting addition only.
 const normalized=file==='index.html'?Buffer.from(actual.toString('utf8').replace(/<meta (?:property="og:(?:title|description|url|type)"|name="twitter:card") content="[^"]*" \/>\n?/g,'')):actual;
 assert.equal(sha(normalized),sha(expected),file+' live content differs');
 return {file,sha256:sha(actual),sourceSha256:sha(expected),bytes:actual.length,hostingMetadataOnly:file==='index.html'};
}));
fs.writeFileSync('output/warden91/live-hashes.json',JSON.stringify(checked,null,2));
console.log(checked.length+' Warden deployment files verified: modules/assets exact; HTML exact apart from hosting sharing metadata.');
