import fs from 'node:fs';
let t=fs.readFileSync('browser-route.template','utf8'),prefix=t.slice(0,t.indexOf(" await page.locator('#rounds').click()"));
fs.writeFileSync('output/playwright/creative/round-0.js',prefix+fs.readFileSync('creative-browser-helper.txt','utf8').replace('ROUND',0)+fs.readFileSync('creative-route-0.txt','utf8')+"\n await wait(200);if(!(await state()).won)throw Error('Pub exit failed '+JSON.stringify(await state()));await page.screenshot({path:'output/playwright/creative/round-0-clear.png'});\n}");
