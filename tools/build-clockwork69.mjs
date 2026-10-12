import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const root='output/release-clockwork69';fs.mkdirSync(root,{recursive:true});
execFileSync('git',['archive','27235fc','-o','output/clockwork69-base.zip']);
execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile;zipfile.ZipFile('output/clockwork69-base.zip').extractall('${root}')`]);
const modules=['clockwork-campaign.js','clockwork-render.js','clockwork-view.js'];
for(const f of [...modules,'cycle-campaign.js','cycle-render.js','engine.js','interactions.js','game.js','index.html','audio-events.js','ground-shadow.js'])fs.copyFileSync(f,root+'/'+f);
fs.cpSync('assets/clockwork69',root+'/assets/clockwork69',{recursive:true});
for(const f of ['build.mjs','publish-update.mjs']){const p=root+'/'+f;let s=fs.readFileSync(p,'utf8');for(const m of modules)if(!s.includes("'"+m+"'"))s=s.replace("'cycle-render.js'","'cycle-render.js','"+m+"'");
 if(f==='publish-update.mjs')for(const im of ['parts','machine','dock','pin','catch','scene']){const path='assets/clockwork69/'+im+'.png';if(!s.includes("'"+path+"'"))s=s.replace("'assets/gate61/gate.png'","'assets/gate61/gate.png','"+path+"'");}fs.writeFileSync(p,s);}
fs.writeFileSync(root+'/server.mjs',fs.readFileSync(root+'/server.mjs','utf8').replace('listen(3000,','listen(3016,'));
execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
