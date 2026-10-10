import fs from 'node:fs';
let t=fs.readFileSync('engine.test.js','utf8').replace("s.crate=false;s.power=true;s.active=0","s.crate=false;s.power=true;s.turret=false;s.active=0");fs.writeFileSync('engine.test.js',t);
let i=fs.readFileSync('interactions.js','utf8');
i+="\nexport function debugState(s){if(!s.round)return {fuseFound:s.fuse,power:s.power,arcadeAlive:s.turret,completed:s.won};const keys={cargo:['charge','charged','liftOn','liftY','hatch'],bankshot:['lane','score'],portals:['bell','mirror','seal'],tow:['brake','cartX','parked','signal'],forge:['ore','air','heat']}[s.level.mechanic];return {...Object.fromEntries(keys.map(k=>[k,s.machine[k]])),portalOpen:s.power,completed:s.won};}\n";fs.writeFileSync('interactions.js',i);
let g=fs.readFileSync('game.js','utf8').replace('{levels,campaignHint}','{levels}').replace('{objective,nearbyInteraction}','{objective,nearbyInteraction,debugState}').replace(/const hint=\(\)=>.*?;\n/,'').replace(/Object.entries\(\{barrierCleared:.*?\}\)\.filter/,'Object.entries(debugState(s)).filter');
fs.writeFileSync('game.js',g);
