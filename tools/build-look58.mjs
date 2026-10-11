import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const root='output/release-look58';fs.mkdirSync(root,{recursive:true});
execFileSync('git',['archive','e242813','-o','output/look58-base.zip']);
execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile;zipfile.ZipFile('output/look58-base.zip').extractall('${root}')`]);
for(const f of ['view-camera.js','ladder-context.js','cycle-campaign.js','camera-look.test.js'])fs.copyFileSync(f,root+'/'+f);
function patch(dir,file){let s=fs.readFileSync(dir+'/'+file,'utf8');
if(file==='game.js')s=s.replace("import {cameraTarget}","import {cameraTarget,cameraLookDirection}").replace('const target=cameraTarget(s.heroes[s.active],viewport,s.level);',"const look=started&&!paused&&!s.won&&!s.failed?cameraLookDirection(s,{up:controls.has('up'),down:controls.has('down')}):0;const target=cameraTarget(s.heroes[s.active],viewport,s.level,look);").replace('height:sceneHeight,zoom});','height:sceneHeight,zoom,look});');
if(file.endsWith('.js'))s=s.replace(/view-camera\.js\?v=[^'"\s]+/g,'view-camera.js?v=look58').replace(/cycle-campaign\.js\?v=[^'"\s]+/g,'cycle-campaign.js?v=look58').replace(/engine\.js\?v=[^'"\s]+/g,'engine.js?v=look58');
if(file==='index.html')s=s.replace(/game\.js\?v=[^"\s]+/g,'game.js?v=look58').replace(/style\.css\?v=[^"\s]+/g,'style.css?v=look58').replace('aria-label="Climb up"','aria-label="Look up / climb up"').replace('aria-label="Climb down"','aria-label="Look down / climb down"');
if(file==='style.css')s=s.replace('.ladder-controls{display:none;','.ladder-controls{display:flex;');
if(file==='build.mjs'||file==='publish-update.mjs')s=s.replace("'view-camera.js'","'view-camera.js','ladder-context.js'");
fs.writeFileSync(dir+'/'+file,s);}
for(const dir of [root,'.'])for(const f of ['game.js','engine.js','index.html','style.css','build.mjs','publish-update.mjs'])patch(dir,f);
const server=root+'/server.mjs';fs.writeFileSync(server,fs.readFileSync(server,'utf8').replace('listen(3000,','listen(3003,'));
execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
