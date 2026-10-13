import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const files=['game.js','clockwork-view.js','clockwork-render.js','style.css'];
for(const file of files){const r=await fetch('https://united-marsh-6ppd.here.now/'+file+'?release=93');assert.equal(r.status,200);const b=Buffer.from(await r.arrayBuffer()),local=fs.readFileSync('output/release-clockwork93/dist/'+file);assert.equal(createHash('sha256').update(b).digest('hex'),createHash('sha256').update(local).digest('hex'),file);}
console.log('Live clockwork scripts and controls match the verified candidate.');
