import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const root='output/release-skins73';fs.mkdirSync(root,{recursive:true});
execFileSync('git',['archive','3efdd70','-o','output/skins73-base.zip']);
execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile;zipfile.ZipFile('output/skins73-base.zip').extractall('${root}')`]);
for(const f of ['game.js','hero-art.js','hero-frames.js','sprite-render.js','hero-skins.js','index.html','style.css'])fs.copyFileSync(f,root+'/'+f);
fs.writeFileSync(root+'/build.mjs',fs.readFileSync(root+'/build.mjs','utf8')+"\nfs.copyFileSync('hero-skins.js','dist/hero-skins.js');\n");
const p=root+'/publish-update.mjs';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace("'hero-art.js'","'hero-art.js','hero-skins.js'"));
fs.writeFileSync(root+'/server.mjs',fs.readFileSync(root+'/server.mjs','utf8').replace('listen(3000,','listen(3020,'));
execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
