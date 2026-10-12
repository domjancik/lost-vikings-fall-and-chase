import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const root='output/release-skins76';fs.mkdirSync(root,{recursive:true});
execFileSync('git',['archive','67a0cc5','-o','output/skins76-base.zip']);
execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile;zipfile.ZipFile('output/skins76-base.zip').extractall('${root}')`]);
for(const f of ['game.js','hero-art.js','hero-procedural.js','hero-skins.js','sprite-render.js','clockwork-render.js','index.html'])fs.copyFileSync(f,root+'/'+f);
fs.appendFileSync(root+'/build.mjs',"\nfs.copyFileSync('hero-procedural.js','dist/hero-procedural.js');\n");
const publisher=root+'/publish-update.mjs';fs.writeFileSync(publisher,fs.readFileSync(publisher,'utf8').replace("'hero-skins.js'","'hero-skins.js','hero-procedural.js'"));
fs.writeFileSync(root+'/server.mjs',fs.readFileSync(root+'/server.mjs','utf8').replace('listen(3000,','listen(3021,'));
execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
