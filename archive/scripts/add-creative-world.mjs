import fs from 'node:fs';
let w=fs.readFileSync('world-render.js','utf8').replaceAll('world9','creative10').replace("export function drawWorld","const puzzles=sheet('assets/puzzle-machines.png',5,2);\nexport function drawWorld");
w=w.replace(" for(const p of s.round? s.level.platforms:platforms)deck",fs.readFileSync('creative-world-snippet.txt','utf8')+"\n for(const p of s.round? s.level.platforms:platforms)deck");fs.writeFileSync('world-render.js',w);
let g=fs.readFileSync('game.js','utf8').replaceAll('world9','creative10').replace("altar:s.altar,turret:s.turret","altar:s.altar,turret:s.turret,machine:s.machine").replace("completed:s.won}).filter","completed:s.won,...s.machine}).filter").replace("if(!prev.latch&&s.latch)","if(s.round===0&&!prev.latch&&s.latch)").replace("if(prev.turret&&!s.turret)","if(s.round===0&&prev.turret&&!s.turret)");
g=g.replace("p.kind==='drop'?'#e9c678':p.kind==='bolt'?'#f28aaf':'#e8ddbb'","['fire','forge-fire'].includes(p.kind)?'#ffa145':p.kind==='bank'?'#ff85db':p.kind.includes('ghost')?'#91efba':p.kind==='spark'?'#75e7ef':p.kind==='bolt'?'#f28aaf':'#e8ddbb'");
fs.writeFileSync('game.js',g);
let h=fs.readFileSync('index.html','utf8').replaceAll('world9','creative10');fs.writeFileSync('index.html',h);
let p=fs.readFileSync('publish-update.mjs','utf8').replace("'assets/world-objects.png'","'assets/world-objects.png','assets/puzzle-machines.png'");fs.writeFileSync('publish-update.mjs',p);
let t=fs.readFileSync('creative.test.js','utf8').replace("o.shield=true;for","s.machine.brake=true;o.shield=true;for");fs.writeFileSync('creative.test.js',t);
