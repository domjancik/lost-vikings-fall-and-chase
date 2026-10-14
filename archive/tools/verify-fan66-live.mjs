import fs from 'node:fs/promises';import crypto from 'node:crypto';
const base='https://united-marsh-6ppd.here.now/',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const f of ['game.js','sprite-atlas.js','cycle-render.js','cycle-fan-connections.js']){const r=await fetch(base+f+'?verify=fan66');if(!r.ok)throw Error(f+':'+r.status);if(hash(Buffer.from(await r.arrayBuffer()))!==hash(await fs.readFile('output/release-fan66/dist/'+f)))throw Error('Mismatch:'+f);}
const html=await(await fetch(base+'?release=66')).text();if(!html.includes('game.js?v=fan66'))throw Error('Stale entry');console.log('Live fan attachment entry and all four runtime modules match reviewed release.');
