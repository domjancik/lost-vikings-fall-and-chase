import fs from 'node:fs';
let w=fs.readFileSync('world-render.js','utf8').replace(" plate(745,s.bridge,'HOLD');"," if(m!=='runes'&&m!=='altar')plate(745,s.bridge,m==='bumper'||m==='brake'?(s.relay?'HOLD':'GROUND · SHIELD ↑'):'HOLD');");
w=w.replace(" if(m==='bumper'||m==='brake')plate(740,s.heroes[2].shieldUp&&Math.abs(s.heroes[2].x-740)<30,'GROUND · SHIELD ↑');","");
fs.writeFileSync('world-render.js',w);
