import fs from 'node:fs';
const t=fs.readFileSync('browser-route.template','utf8'),prefix=t.slice(0,t.indexOf(" await page.locator('#rounds').click()"));
fs.mkdirSync('output/playwright/creative',{recursive:true});
for(let i=1;i<=5;i++)fs.writeFileSync('output/playwright/creative/round-'+i+'.js',prefix+fs.readFileSync('creative-browser-helper.txt','utf8').replace('ROUND',i)+fs.readFileSync('creative-route-'+i+'.txt','utf8')+"\n await wait(200);if(!(await state()).won)throw Error('Exit failed '+JSON.stringify(await state()));await page.screenshot({path:'output/playwright/creative/round-"+i+"-clear.png'});\n}");
