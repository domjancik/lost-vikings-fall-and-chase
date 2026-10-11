import fs from 'node:fs';
const file='browser-ground51-5.js';
let data=fs.readFileSync(file,'utf8');
data=data.replaceAll('sprite51FootingCapture','sprite51LowerFootingCapture');
data=data.replace("if(label==='canopy-reveal')", "if(label==='canopy-reveal'||label==='lower-footings')");
data=data.replace("path:'output/playwright/sprite51-6-full-footings.png'", "path:'output/playwright/sprite51-6-'+(label==='lower-footings'?'lower-full-footings':'full-footings')+'.png'");
data=data.replace("if(read().heroes[2].y!==766)throw Error('Float landing');", "if(read().heroes[2].y!==766)throw Error('Float landing');await capture('lower-footings');");
fs.writeFileSync(file,data);
