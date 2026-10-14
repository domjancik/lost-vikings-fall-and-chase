import fs from 'node:fs';
let source=fs.readFileSync('browser-cycle52.js','utf8').replaceAll('cycleCaptureRelease','connectionReroute53').replaceAll('cycle52-','connections53-');
fs.mkdirSync('output/playwright',{recursive:true});
fs.writeFileSync('output/playwright/connections53-route.js',source.replaceAll('connectionReroute53','connectionCapture53'));
source=source.slice(0,source.indexOf('  await climb(1,500);'))+`  input({});pulse('v');await tick({},.3);await capture('rerouted-junction');return {art:JSON.parse(document.querySelector('#game').dataset.cycleArt)};
 });if(errors.length)throw Error(errors.join(';'));return {result,errors};
}
`;
fs.writeFileSync('output/playwright/connections53-junction.js',source);
