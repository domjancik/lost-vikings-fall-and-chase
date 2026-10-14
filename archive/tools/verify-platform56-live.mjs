import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const base='https://united-marsh-6ppd.here.now/';
const files=['game.js','sprite-render.js','hero-geometry.js','hero-render-order.js','cycle-render.js','assets/platform56/ladder.png'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
await Promise.all(files.map(async f=>{
 const r=await fetch(base+f+'?verify=platform56r3');
 if(!r.ok)throw Error(f+':HTTP'+r.status);
 const actual=Buffer.from(await r.arrayBuffer()),expected=await fs.readFile('output/release-platform56/dist/'+f);
 if(hash(actual)!==hash(expected))throw Error('Live mismatch:'+f);
}));
const html=await (await fetch(base+'?platform=56')).text();
if(!html.includes('game.js?v=platform56r3'))throw Error('Live entry point is stale');
console.log('Live entry point and all6changed modules/assets exactly match verified release.');
