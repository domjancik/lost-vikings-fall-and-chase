import fs from 'node:fs/promises';import crypto from 'node:crypto';
const base='https://united-marsh-6ppd.here.now/';const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const f of ['game.js','vertical-parallax.js','background-depth.js','parallax-render.js','story-render.js','cycle-render.js','refraction-render.js']){const r=await fetch(base+f+'?verify=vertical65');if(!r.ok)throw Error(f+':'+r.status);if(hash(Buffer.from(await r.arrayBuffer()))!==hash(await fs.readFile('output/release-vertical65/dist/'+f)))throw Error('Mismatch:'+f);}
const html=await(await fetch(base+'?release=65')).text();if(!html.includes('game.js?v=vertical65'))throw Error('Stale entry');console.log('Live vertical-parallax entry and all seven runtime modules match reviewed release.');
