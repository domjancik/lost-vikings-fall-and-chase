import fs from 'node:fs';
let c=fs.readFileSync('campaign.js','utf8').replace("p.dead=true;const expected=[1,0,2][g.score];","p.dead=true;if(g.score>=3)continue;const expected=[1,0,2][g.score];");fs.writeFileSync('campaign.js',c);
for(const f of ['game.js','engine.js','campaign.js','world-render.js','index.html'])fs.writeFileSync(f,fs.readFileSync(f,'utf8').replaceAll('creative10','creative11'));
