import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const root='output/release-momentum72';fs.mkdirSync(root,{recursive:true});
execFileSync('git',['archive','3b3695a','-o','output/momentum72-base.zip']);
execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile;zipfile.ZipFile('output/momentum72-base.zip').extractall('${root}')`]);
for(const f of ['momentum-campaign.js','momentum-render.js','cycle-campaign.js','cycle-render.js'])fs.copyFileSync(f,root+'/'+f);
// Keep later skin/character work out of this independently reviewed release.
for(const f of ['engine.js','game.js','index.html'])fs.writeFileSync(root+'/'+f,fs.readFileSync(root+'/'+f,'utf8').replaceAll('v=clockwork71','v=momentum72'));
fs.cpSync('assets/momentum72',root+'/assets/momentum72',{recursive:true});
const p=root+'/publish-update.mjs';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace("'assets/clockwork71/tower.png'","'assets/clockwork71/tower.png','assets/momentum72/ball.png'"));
fs.writeFileSync(root+'/server.mjs',fs.readFileSync(root+'/server.mjs','utf8').replace('listen(3000,','listen(3019,'));
execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
