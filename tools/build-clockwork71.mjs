import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const root='output/release-clockwork71';fs.mkdirSync(root,{recursive:true});
execFileSync('git',['archive','c841206','-o','output/clockwork71-base.zip']);
execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile;zipfile.ZipFile('output/clockwork71-base.zip').extractall('${root}')`]);
for(const f of ['engine.js','clockwork-campaign.js','clockwork-render.js','clockwork-view.js','cycle-campaign.js','cycle-render.js','game.js','index.html'])fs.copyFileSync(f,root+'/'+f);
fs.cpSync('assets/clockwork71',root+'/assets/clockwork71',{recursive:true});
const p=root+'/publish-update.mjs';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace("'assets/gate61/gate.png'","'assets/gate61/gate.png','assets/clockwork71/tower.png'"));
fs.writeFileSync(root+'/server.mjs',fs.readFileSync(root+'/server.mjs','utf8').replace('listen(3000,','listen(3018,'));
execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
