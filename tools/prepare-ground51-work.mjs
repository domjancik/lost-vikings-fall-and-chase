import fs from 'node:fs';
const file='browser-ground51-matrix-2.js';
let data=fs.readFileSync(file,'utf8');
data=data.replaceAll('sprite51ClearMatrixCapture','sprite51WorkMatrixCapture');
data=data.replace("await use(1);await tick({},4.5);if(read().machine.work!==1)", "await use(1);await tick({},2);await capture('work-working');await tick({},2.5);if(read().machine.work!==1)");
fs.writeFileSync(file,data);
