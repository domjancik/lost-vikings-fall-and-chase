import fs from 'node:fs';
let smoke=fs.readFileSync('browser-scale50-live.js','utf8');
smoke=smoke.replace('campaign=story&scale=50','campaign=story&ground=51')
 .replaceAll('midground-layout.js?v=scale50','midground-layout.js?v=ground51')
 .replaceAll('midground-render.js?v=scale50','midground-render.js?v=ground51')
 .replaceAll('output/playwright/scale50','output/playwright/ground51');
smoke=smoke.replace("const urls=[", "const urls=['interaction-art.js?v=ground51','interaction-frames.js?v=ground51','story-visuals.js?v=ground51','assets/ground51/interaction-frames.png?v=ground51',");
fs.writeFileSync('browser-ground51-live.js',smoke);
let controls=fs.readFileSync('browser-ground51-first.js','utf8');
controls=controls.replaceAll('http://127.0.0.1:3000/','https://united-marsh-6ppd.here.now/')
 .replaceAll('sprite51Capture','sprite51LiveCapture')
 .replaceAll('output/playwright/sprite51-first','output/playwright/sprite51-live');
fs.writeFileSync('browser-ground51-live-first.js',controls);
