import fs from 'node:fs';
const files=['game.js','engine.js','interactions.js','story-campaign.js','story-render.js','story-visuals.js','interaction-art.js','interaction-frames.js','midground-layout.js','midground-render.js','assets/ground51/interaction-frames.png',...Array.from({length:8},(_,i)=>`assets/scale50/middle-${i}.png`)];
for(const file of files){
 const response=await fetch(`https://united-marsh-6ppd.here.now/${file}?ground=51`);
 if(!response.ok)throw Error(`${file}: HTTP ${response.status}`);
 const actual=Buffer.from(await response.arrayBuffer()),expected=fs.readFileSync(file);
 if(!actual.equals(expected))throw Error(`Live bytes differ: ${file}`);
}
console.log(`${files.length} live assets/modules match local bytes exactly.`);
