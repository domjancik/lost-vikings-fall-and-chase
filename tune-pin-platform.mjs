import fs from 'node:fs';
let l=fs.readFileSync('levels.js','utf8').replace("x:480,y:330","x:480,y:400");fs.writeFileSync('levels.js',l);
