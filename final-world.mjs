import fs from 'node:fs';
let g=fs.readFileSync('game.js','utf8').replace("toast('Power restored. The bridge still needs someone on the pressure plate.')","toast(objective(s))");
fs.writeFileSync('game.js',g);
for(const f of ['index.html','game.js','world-render.js','engine.js','campaign.js'])fs.writeFileSync(f,fs.readFileSync(f,'utf8').replaceAll('world8','world9'));
