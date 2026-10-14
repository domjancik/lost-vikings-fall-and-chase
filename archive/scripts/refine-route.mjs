import fs from 'node:fs';
let t=fs.readFileSync('browser-route.template','utf8').replace(" const jump="," const faceRight=async()=>{await page.keyboard.down('ArrowRight');await wait(70);await page.keyboard.up('ArrowRight');await wait(50);};\n const jump=");
fs.writeFileSync('browser-route.template',t);
let c=fs.readFileSync('create-browser-routes.mjs','utf8').replace("await move(1,405);await press('z')","await move(1,405);await faceRight();await press('z')").replace("await move(1,690);await press('x')","await move(1,690);await faceRight();await press('x')");
fs.writeFileSync('create-browser-routes.mjs',c);
let w=fs.readFileSync('world-render.js','utf8').replace("text('HOLD PLATE TO CROSS',(edge+990)/2,675,c,10)","text(m==='runes'?'AWAKEN THE RUNE ALTAR':m==='altar'?'FIND CROWN · CUT SEAL':'HOLD PLATE TO CROSS',(edge+990)/2,675,c,10)").replace("text(s.round?'CORE':'FUSE',k.x,k.y-12,c,10)","text(s.round?'CORE':'FUSE',k.x,s.level.mechanic==='runes'?k.y-50:k.y-12,c,10)");
fs.writeFileSync('world-render.js',w);
