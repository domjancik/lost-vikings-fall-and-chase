// Publish this physics fix on the accepted release, preserving pending art work.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
const root='output/release-support57';
fs.mkdirSync(root,{recursive:true});
execFileSync('git',['archive','99dfdf2','-o','output/support57-base.zip']);
execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile; zipfile.ZipFile('output/support57-base.zip').extractall('${root}')`]);
for(const f of ['movement.js','shield-carrier.test.js'])fs.copyFileSync(f,root+'/'+f);
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.js'))){
 const p=root+'/'+file;let s=fs.readFileSync(p,'utf8');
 s=s.replaceAll('movement.js?v=arc46','movement.js?v=support57');
 // Each entry in the module graph must fetch this updated movement import.
 s=s.replace(/engine\.js\?v=[^'"\s]+/g,'engine.js?v=support57')
  .replaceAll('campaign.js?v=arc46','campaign.js?v=support57')
  .replaceAll('cycle-campaign.js?v=cycle52','cycle-campaign.js?v=support57')
  .replaceAll('story-campaign.js?v=ground51','story-campaign.js?v=support57');
 fs.writeFileSync(p,s);
}
const index=root+'/index.html';fs.writeFileSync(index,fs.readFileSync(index,'utf8').replace('game.js?v=platform56r3','game.js?v=support57'));
const server=root+'/server.mjs';fs.writeFileSync(server,fs.readFileSync(server,'utf8').replace('listen(3000,','listen(3002,'));
execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
console.log('Isolated support57 release built.');
