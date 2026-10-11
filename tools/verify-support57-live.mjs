import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const base='https://united-marsh-6ppd.here.now/';
const files=['game.js','engine.js','movement.js','cycle-campaign.js','campaign.js','story-campaign.js','inventory-campaign.js','vertical-campaign.js','interactions.js','story-render.js','vertical-render.js'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
await Promise.all(files.map(async f=>{
 const r=await fetch(base+f+'?verify=support57');if(!r.ok)throw Error(f+':HTTP'+r.status);
 const actual=Buffer.from(await r.arrayBuffer()),expected=await fs.readFile('output/release-support57/dist/'+f);
 if(hash(actual)!==hash(expected))throw Error('Live mismatch:'+f);
}));
const html=await (await fetch(base+'?support=57')).text();
if(!html.includes('game.js?v=support57'))throw Error('Live entry point stale');
console.log('Live entry point and11changed modules match the tested support57 release.');
