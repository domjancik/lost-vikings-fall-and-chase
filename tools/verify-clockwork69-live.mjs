import fs from 'node:fs/promises';import crypto from 'node:crypto';
const base='https://united-marsh-6ppd.here.now/',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=['game.js','engine.js','cycle-campaign.js','cycle-render.js','clockwork-campaign.js','clockwork-render.js','clockwork-view.js','ground-shadow.js','audio-events.js','interactions.js',...['parts','machine','dock','pin','catch','scene'].map(n=>'assets/clockwork69/'+n+'.png')];
for(const f of files){const r=await fetch(base+f+'?verify=clockwork69');if(!r.ok)throw Error(f+':'+r.status);if(hash(Buffer.from(await r.arrayBuffer()))!==hash(await fs.readFile('output/release-clockwork69/dist/'+f)))throw Error('Mismatch:'+f);}
const html=await(await fetch(base+'?release=69')).text();if(!html.includes('game.js?v=clockwork69')||!html.includes('id="play-clockwork"'))throw Error('Stale entry');console.log('Live Clockwork entry, ten runtime modules and six native assets match the reviewed release.');
