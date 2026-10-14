import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const root='output/release-ground59';fs.mkdirSync(root,{recursive:true});execFileSync('git',['archive','ab8c538','-o','output/ground59-base.zip']);execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile;zipfile.ZipFile('output/ground59-base.zip').extractall('${root}')`]);
for(const f of ['sprite-atlas.js','cycle-render.js','entity-grounding.test.js','VISUAL-REVIEW-GATE.md'])fs.copyFileSync(f,root+'/'+f);
for(const dir of [root,'.']){const p=dir+'/game.js';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/cycle-render\.js\?v=[^'"\s]+/g,'cycle-render.js?v=ground59'));}
const p=root+'/index.html';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('game.js?v=look58','game.js?v=ground59'));
const server=root+'/server.mjs';fs.writeFileSync(server,fs.readFileSync(server,'utf8').replace('listen(3000,','listen(3004,'));execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
