import fs from 'node:fs';
let e=fs.readFileSync('engine.js','utf8').replace("from './levels.js'","from './levels.js?v=creative10'");fs.writeFileSync('engine.js',e);
let g=fs.readFileSync('game.js','utf8').replace("shieldUp:h.shieldUp","shieldUp:h.shieldUp,shield:h.shield,face:h.face,support:h.support");
fs.writeFileSync('game.js',g);
let h=fs.readFileSync('index.html','utf8').replace('Starfall Command','Starfall Cargo').replace('Tilt! Pinball','Tilt! Bank Shot').replace('Phantom Maze','The Haunted Loop').replace('Turbo Night Run','Road Rage Rescue').replace('Dragon’s Last Credit','The Dragon Forge');
h=h.replace('<p>Movement accelerates','<p><b>Arcade worlds:</b> cargo lifts carry the whole crew; Olaf’s front shield reflects arrows and fire. Haunted doors use E / USE to travel. Olaf can push heavy machinery while his front shield is raised. Erik run-bashes drums and bellows by building speed before pressing X.</p><p>Movement accelerates');
fs.writeFileSync('index.html',h);
