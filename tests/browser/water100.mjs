import {reviewNavigate} from './review-skin.mjs';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createDevServer} from '../../tools/dev/server.mjs';
const require=createRequire('C:/Users/magne/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
fs.mkdirSync('output/water100',{recursive:true});
const server=await createDevServer({built:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try {
 const page=await browser.newPage();
 await page.addInitScript(()=>{localStorage.setItem('last-call-story-cards','off');localStorage.setItem('last-call-hints','off');});
 await reviewNavigate(page,'http://127.0.0.1:'+server.address().port+'/?campaign=cycle&skin=imagegen90&release=water100');
 let route=fs.readFileSync('archive/browser/browser-water87.js','utf8');
 route=route.replace("await page.locator('#play-water').click();", "await page.locator('#start-picker .level-card[data-round=\"4\"]').click();");
 route=route.replaceAll("'output/playwright/water87-'", "'output/water100/'");
 route=route.replace("await shot('shield-intake');", "await shot('shield-intake');await wait(84);await shot('shield-intake-flow-next');");
 route=route.replace("await swim(940,856);await swim(1100,856);", "await swim(940,856);await page.locator('#pause').click();await wait(100);await shot('air-pocket-2x');await page.locator('#zoom').click();await wait(300);await shot('air-pocket-1x');await page.locator('#zoom').click();await page.setViewportSize({width:844,height:390});await wait(300);await shot('air-pocket-mobile');await page.setViewportSize({width:1440,height:900});await wait(300);await page.locator('#pause').click();await swim(1100,856);");
 // The old route's final picker class predates the reorganized campaign menu.
 route=route.replace("page.locator('.round-option[data-round=\"4\"]')", "page.locator('#round-picker .level-card[data-round=\"4\"]')");
 const result=await (eval('('+route+')'))(page);
 fs.writeFileSync('output/water100/route.json',JSON.stringify(result,null,2));
 if(!result.won||result.errors.length)throw Error('Water route did not clear');
 console.log(JSON.stringify({won:result.won,hp:result.hp,errors:result.errors}));
} finally {await browser.close();await new Promise(r=>server.close(r));}
