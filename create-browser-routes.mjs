import fs from 'node:fs';
const common="await move(1,405);await faceRight();await press('z');const cleared=await state();if(cleared.puzzle.crate)throw Error('Sword did not clear barricade');";
const down="await move(0,200);await wait(1200);";
const relay="await move(2,740);await press('Space');await move(1,690);await faceRight();await press('x');await wait(400);await requireFlag('relay');";
const bridge="await move(2,745);await requireFlag('bridge');await move(1,1028);await press('e');await requireFlag('latch');";
const routes=[
 common+"await move(0,210);await jump(300);await move(0,350);await jump(440);await move(0,490);await jump(580);await jump(680);await requireFlag('fuse');"+down+"await move(0,610);await press('e');await requireFlag('power');"+bridge,
 common+"await move(2,310);await press('Space');await move(0,310);await jump(310);await jump(435);await move(0,510);await jump(600);await move(0,670);await jump(740);await requireFlag('key');"+down+"await move(0,610);await press('e');await requireFlag('power');"+bridge,
 common+"await move(0,335);await jump(490);await move(0,550);await jump(635);await requireFlag('key');"+down+relay+bridge,
 common+"await move(0,245);await jump(345);await move(0,410);await jump(505);await move(0,565);await jump(680);await requireFlag('key');await move(1,540);await move(2,330);await select(0);await press('e');await requireFlag('power');"+down,
 common+"await move(0,215);await jump(315);await move(0,375);await jump(480);await move(0,550);await jump(680);await requireFlag('key');"+down+relay+bridge,
 common+"await move(0,205);await jump(305);await move(0,370);await jump(470);await move(0,540);await jump(680);await requireFlag('key');"+down+"await requireFlag('bridge');await move(0,1030);await move(1,1110);await move(2,1190);await press('e');await requireFlag('power');"
];
fs.mkdirSync('output/playwright',{recursive:true});for(let i=0;i<6;i++)fs.writeFileSync('output/playwright/play-round-'+i+'.js',fs.readFileSync('browser-route.template','utf8').replace('ROUND',i).replace('NUM',String(i+1).padStart(2,'0')).replace('ROUTE',routes[i]));
let p=fs.readFileSync('publish-update.mjs','utf8').replace('current.versionId','current.currentVersionId').replace("console.log('Updating live publish',JSON.stringify(current))","console.log('Updating version',current.currentVersionId)");fs.writeFileSync('publish-update.mjs',p);
