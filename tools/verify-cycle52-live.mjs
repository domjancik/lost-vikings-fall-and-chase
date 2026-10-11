import fs from 'node:fs/promises';
const files=['game.js','style.css','engine.js','controls.js','sprite-render.js','interactions.js','ground-shadow.js','audio-events.js','cycle-campaign.js','cycle-render.js',...['machines','fan','ladder','carrier','scene'].map(n=>'assets/cycle52/'+n+'.png')];
await Promise.all(files.map(async file=>{
 const r=await fetch('https://united-marsh-6ppd.here.now/'+file+'?release=cycle52');
 if(!r.ok)throw Error(file+': HTTP '+r.status);
 const actual=Buffer.from(await r.arrayBuffer()),expected=await fs.readFile(file);
 if(!actual.equals(expected))throw Error('Live bytes differ: '+file);
}));
console.log(files.length+' live modules and assets match the tested local build exactly.');
// The host injects social metadata into HTML; inspect deployed entry points.
const html=await(await fetch('https://united-marsh-6ppd.here.now/?release=cycle52')).text();
for(const part of ['id="play-cycle"','data-campaign="cycle"','data-key="up"','game.js?v=cycle52'])if(!html.includes(part))throw Error('HTML missing '+part);
console.log('Live HTML exposes the new campaign, ladder controls and versioned game entry.');
