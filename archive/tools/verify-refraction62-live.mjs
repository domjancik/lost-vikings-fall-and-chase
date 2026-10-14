import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const base='https://united-marsh-6ppd.here.now/';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=['game.js','engine.js','interactions.js','audio-events.js','cycle-campaign.js','cycle-render.js','refraction-campaign.js','refraction-render.js','refraction-art-layout.js','refraction-connections.js',...['machines','base','reflector','emitter','lift','scene'].map(x=>'assets/refraction62/'+x+'.png')];
for(const f of files){const r=await fetch(base+f+'?verify=refraction62');if(!r.ok)throw Error(f+':'+r.status);if(hash(Buffer.from(await r.arrayBuffer()))!==hash(await fs.readFile('output/release-refraction62/dist/'+f)))throw Error('Mismatch:'+f);}
const html=await(await fetch(base+'?release=62')).text();if(!html.includes('game.js?v=refraction62')||!html.includes('id="play-refraction"'))throw Error('Stale entry');
console.log('Live entry, 10 runtime modules and 6 native art assets match reviewed refraction62.');
