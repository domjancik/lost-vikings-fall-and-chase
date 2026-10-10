import fs from 'node:fs';
let e=fs.readFileSync('engine.js','utf8').replaceAll('world9','creative10').replace('crate:true','crate:round===0').replace('time:0,shots:[]',"time:0,machine:{charge:0,charged:false,liftY:610,liftDir:-1,liftPause:2,liftOn:false,hatch:false,lane:0,score:0,bell:false,mirrorTime:0,mirror:false,seal:false,brake:false,cartX:620,parked:false,signal:false,ore:false,air:0,heat:0,lastPump:-1},shots:[]");
fs.writeFileSync('engine.js',e);
let m=fs.readFileSync('movement.js','utf8').replace("s.level?.mechanic==='bumper'","s.level?.mechanic==='bankshot'").replace("wall.on&&h.y+44>510","wall.on&&h.y+44>(wall.top??510)&&h.y<(wall.bottom??Infinity)");
fs.writeFileSync('movement.js',m);
