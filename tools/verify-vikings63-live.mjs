import fs from 'node:fs/promises';import crypto from 'node:crypto';
const base='https://united-marsh-6ppd.here.now/';const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const f of ['game.js','sprite-render.js','hero-art.js','hero-frames.js',...['erik','baleog','olaf','shield'].map(n=>'assets/vikings63/'+n+'.png')]){const r=await fetch(base+f+'?verify=vikings63');if(!r.ok)throw Error(f+':'+r.status);if(hash(Buffer.from(await r.arrayBuffer()))!==hash(await fs.readFile('output/release-vikings63/dist/'+f)))throw Error('Mismatch:'+f);}
const html=await(await fetch(base+'?release=63')).text();if(!html.includes('game.js?v=vikings63'))throw Error('Stale entry');console.log('Live entry, four character modules and all four native sprite assets match reviewed Vikings63.');
