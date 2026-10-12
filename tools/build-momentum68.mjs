import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const root='output/release-momentum68';fs.mkdirSync(root,{recursive:true});
execFileSync('git',['archive','df0f471','-o','output/momentum68-base.zip']);
execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile;zipfile.ZipFile('output/momentum68-base.zip').extractall('${root}')`]);
const modules=['momentum-campaign.js','momentum-render.js'];
for(const f of [...modules,'cycle-campaign.js','cycle-render.js','engine.js','interactions.js','game.js','index.html','audio-events.js'])fs.copyFileSync(f,root+'/'+f);
fs.cpSync('assets/momentum68',root+'/assets/momentum68',{recursive:true});
for(const f of ['build.mjs','publish-update.mjs']){
 const p=root+'/'+f;let s=fs.readFileSync(p,'utf8');for(const m of modules)if(!s.includes("'"+m+"'"))s=s.replace("'cycle-render.js'","'cycle-render.js','"+m+"'");
 if(f==='publish-update.mjs')for(const im of ['relay','hazards','tiles','arm','scene','furnace','bumper']){const path='assets/momentum68/'+im+'.png';if(!s.includes("'"+path+"'"))s=s.replace("'assets/gate61/gate.png'","'assets/gate61/gate.png','"+path+"'");}
 fs.writeFileSync(p,s);
}
fs.writeFileSync(root+'/server.mjs',fs.readFileSync(root+'/server.mjs','utf8').replace('listen(3000,','listen(3015,'));
execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
