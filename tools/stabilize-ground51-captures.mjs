import fs from 'node:fs';
for(const file of ['browser-ground51-5.js','browser-ground51-7.js']){
 let data=fs.readFileSync(file,'utf8');
 data=data.replace("await page.locator('#pause').click();\n    }", "await page.locator('#pause').click();await page.waitForTimeout(60);\n    }");
 fs.writeFileSync(file,data);
}
