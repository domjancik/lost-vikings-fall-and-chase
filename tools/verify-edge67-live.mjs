import fs from 'node:fs/promises';import crypto from 'node:crypto';
const base='https://united-marsh-6ppd.here.now/',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=['game.js','scene-resolution.js','story-render.js','midground-render.js','assets/scale67/pub-far.png',...Array.from({length:8},(_,n)=>'assets/scale67/middle-'+n+'.png')];
for(const f of files){const r=await fetch(base+f+'?verify=edge67');if(!r.ok)throw Error(f+':'+r.status);if(hash(Buffer.from(await r.arrayBuffer()))!==hash(await fs.readFile('output/release-edge67/dist/'+f)))throw Error('Mismatch:'+f);}
const html=await(await fetch(base+'?release=67')).text();if(!html.includes('game.js?v=edge67'))throw Error('Stale entry');console.log('Live edge-aware entry, four runtime modules and nine background planes match reviewed release.');
