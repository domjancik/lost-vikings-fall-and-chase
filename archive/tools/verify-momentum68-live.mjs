import fs from 'node:fs/promises';import crypto from 'node:crypto';
const base='https://united-marsh-6ppd.here.now/',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=['game.js','engine.js','cycle-campaign.js','cycle-render.js','momentum-campaign.js','momentum-render.js','audio-events.js','interactions.js',...['relay','hazards','tiles','arm','scene','furnace','bumper'].map(n=>'assets/momentum68/'+n+'.png')];
for(const f of files){const r=await fetch(base+f+'?verify=momentum68');if(!r.ok)throw Error(f+':'+r.status);if(hash(Buffer.from(await r.arrayBuffer()))!==hash(await fs.readFile('output/release-momentum68/dist/'+f)))throw Error('Mismatch:'+f);}
const html=await(await fetch(base+'?release=68')).text();if(!html.includes('game.js?v=momentum68')||!html.includes('id="play-momentum"'))throw Error('Stale entry');console.log('Live Momentum entry, eight runtime modules and seven generated native assets match reviewed release.');
