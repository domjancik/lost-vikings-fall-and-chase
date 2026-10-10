import fs from 'node:fs';
let template=fs.readFileSync('browser-route.template','utf8');const prefix=template.slice(0,template.indexOf(" await page.locator('#rounds').click()"));
fs.writeFileSync('output/playwright/check-lever-feedback.js',prefix+fs.readFileSync('feedback-tail.txt','utf8'));
