import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const {files}=JSON.parse(fs.readFileSync('output/release-menu95/candidate.json','utf8')),hashes=[];
for(const file of files.filter(f=>f!=='index.html')){
 const response=await fetch('https://united-marsh-6ppd.here.now/'+file+'?release=menu95');assert.equal(response.status,200,file);
 const bytes=Buffer.from(await response.arrayBuffer()),hash=b=>createHash('sha256').update(b).digest('hex');
 const sha256=hash(bytes);assert.equal(sha256,hash(fs.readFileSync('output/release-menu95/dist/'+file)),file);hashes.push({file,sha256});
}
const html=await(await fetch('https://united-marsh-6ppd.here.now/?release=menu95')).text();assert.ok(html.includes('id="start-picker"')&&html.includes('id="round-picker"')&&!html.includes('id="play-clockwork"'));
fs.writeFileSync('output/menu95/live-hashes.json',JSON.stringify({files:hashes,htmlPickerVerified:true},null,2));
console.log('Six live menu/script/style files match approved build; published HTML has the simplified picker.');
