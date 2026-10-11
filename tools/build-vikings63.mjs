import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const root='output/release-vikings63';fs.mkdirSync(root,{recursive:true});
execFileSync('git',['archive','d971401','-o','output/vikings63-base.zip']);
execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile;zipfile.ZipFile('output/vikings63-base.zip').extractall('${root}')`]);
for(const f of ['hero-art.js','hero-frames.js','sprite-render.js','hero-art-preview.html','game.js','index.html'])fs.copyFileSync(f,root+'/'+f);
fs.cpSync('assets/vikings63',root+'/assets/vikings63',{recursive:true});
for(const dir of [root,'.']){
 const p=dir+'/index.html';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/game\.js\?v=[^'"\s]+/g,'game.js?v=vikings63'));
 for(const file of ['build.mjs','publish-update.mjs']){
  const p=dir+'/'+file;let s=fs.readFileSync(p,'utf8');
  for(const f of ['hero-art.js','hero-frames.js','hero-art-preview.html'])if(!s.includes("'"+f+"'"))s=s.replace("'game.js'","'game.js','"+f+"'");
  if(file==='publish-update.mjs')for(const n of ['erik','baleog','olaf','shield']){const a='assets/vikings63/'+n+'.png';if(!s.includes("'"+a+"'"))s=s.replace("'assets/gate61/gate.png'","'assets/gate61/gate.png','"+a+"'");}
  fs.writeFileSync(p,s);
 }
}
const server=root+'/server.mjs';fs.writeFileSync(server,fs.readFileSync(server,'utf8').replace('listen(3000,','listen(3008,'));
execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
