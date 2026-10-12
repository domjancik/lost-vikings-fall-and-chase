import fs from 'node:fs';
const root='output/release-water83/dist';
// Patch only the reviewed gameplay shell; parallel sprite edits stay outside this distribution.
fs.writeFileSync(root+'/game.js',fs.readFileSync('game.js','utf8').replace(/\?v=[a-zA-Z0-9_-]+/g,'?v=water83b'));
for(const f of fs.readdirSync(root))if(f.endsWith('.js')||f==='index.html')fs.writeFileSync(root+'/'+f,fs.readFileSync(root+'/'+f,'utf8').replaceAll('?v=water83','?v=water83b').replaceAll('?v=water83bb','?v=water83b'));
console.log('Water83b viewport correction applied to the frozen reviewed distribution.');
