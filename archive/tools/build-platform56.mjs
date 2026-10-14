// Isolate these corrections from the unfinished character-art replacement.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
const root='output/release-platform56';
fs.mkdirSync(root,{recursive:true});
execFileSync('git',['archive','0fe275c','-o','output/platform56-base.zip']);
execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile; zipfile.ZipFile('output/platform56-base.zip').extractall('${root}')`]);
for(const f of ['hero-geometry.js','hero-render-order.js','cycle-render.js','shield-platform.test.js'])fs.copyFileSync(f,root+'/'+f);
fs.cpSync('assets/platform56',root+'/assets/platform56',{recursive:true});
const update=(file,fn)=>fs.writeFileSync(root+'/'+file,fn(fs.readFileSync(root+'/'+file,'utf8')));
update('sprite-render.js',s=>s.replace('{shieldTransform}','{SHIELD,shieldTransform}').replace('hero-geometry.js?v=arc46','hero-geometry.js?v=platform56r3')
 .replace('rearY*=1-shieldRise;','rearY=rearY*(1-shieldRise)+(SHIELD.upTop+SHIELD.width/2)*shieldRise;')
 .replace('handY*=1-shieldRise;','handY=handY*(1-shieldRise)+(SHIELD.upTop+SHIELD.width/2)*shieldRise;'));
update('game.js',s=>"import {heroDrawOrder} from './hero-render-order.js?v=platform56r3';\n"+s.replace('cycle-render.js?v=connections53','cycle-render.js?v=platform56r3').replace('sprite-render.js?v=cycle52','sprite-render.js?v=platform56r3').replace('for(const h of s.heroes){if(s.won','for(const h of heroDrawOrder(s.heroes)){if(s.won'));
update('index.html',s=>s.replace(/game\.js\?v=[^"']+/,'game.js?v=platform56r3'));
update('publish-update.mjs',s=>s.replace("const files=[","const files=['hero-render-order.js','assets/platform56/ladder.png',"));
update('build.mjs',s=>s.replace("for(const f of [","for(const f of ['hero-render-order.js',"));
update('server.mjs',s=>s.replace("listen(3000,","listen(3001,"));
execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
console.log('Isolated platform56 release prepared in '+root);
