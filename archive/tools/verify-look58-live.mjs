import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const base='https://united-marsh-6ppd.here.now/';
const files=['game.js','engine.js','cycle-campaign.js','view-camera.js','ladder-context.js','style.css'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
await Promise.all(files.map(async f=>{const r=await fetch(base+f+'?verify=look58');if(!r.ok)throw Error(f+':HTTP'+r.status);const actual=Buffer.from(await r.arrayBuffer()),expected=await fs.readFile('output/release-look58/dist/'+f);if(hash(actual)!==hash(expected))throw Error('Live mismatch:'+f);}));
const html=await(await fetch(base+'?look=58')).text();if(!html.includes('game.js?v=look58')||!html.includes('style.css?v=look58')||!html.includes('Look up / climb up'))throw Error('Stale live controls');
console.log('Live entry, controls and six changed runtime files match tested look58 release.');
