import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const root='output/release-refraction62';fs.mkdirSync(root,{recursive:true});
execFileSync('git',['archive','ac3b3df','-o','output/refraction62-base.zip']);
execFileSync('tools/pixel-fixer-venv/Scripts/python.exe',['-c',`import zipfile;zipfile.ZipFile('output/refraction62-base.zip').extractall('${root}')`]);
const modules=['refraction-campaign.js','refraction-render.js','refraction-art-layout.js','refraction-connections.js'];
for(const f of [...modules,'cycle-campaign.js','cycle-render.js'])fs.copyFileSync(f,root+'/'+f);
fs.cpSync('assets/refraction62',root+'/assets/refraction62',{recursive:true});
for(const dir of [root,'.']){
 for(const f of ['engine.js','interactions.js','game.js']){
  const p=dir+'/'+f;let s=fs.readFileSync(p,'utf8');
  for(const module of ['cycle-campaign','cycle-render','engine','interactions','audio-events'])s=s.replace(new RegExp(module+"\\.js\\?v=[^'\"\\s]+",'g'),module+'.js?v=refraction62');
  if(f==='game.js'){
   s=s.replace("campaign==='cycle'?'Circuit restored. Crew reunited.'","campaign==='cycle'?s.level.name+' — crew reunited.'");
   s=s.replace("campaign==='cycle'?'Three Vikings. One circulation engine. Leave no one behind.'","campaign==='cycle'?(round===levels.length-1?'Three Vikings. One light. A way upward.':`Next: ${levels[round+1].name}`)");
   s=s.replace('round=Math.max(0,Math.min(levels.length-1,Number(localStorage.getItem(roundKey(next)))||0));renderCampaignChoices();','round=Math.max(0,Math.min(levels.length-1,Number(localStorage.getItem(roundKey(next)))||0));if(next===\'cycle\'&&new URLSearchParams(location.search).get(\'puzzle\')===\'refraction\')round=1;renderCampaignChoices();');
   if(!s.includes("querySelector('#play-refraction')"))s+="\ndocument.querySelector('#play-refraction').onclick=()=>{chooseCampaign('cycle');round=1;reset();};\n";
  }
  fs.writeFileSync(p,s);
 }
 const index=dir+'/index.html';let html=fs.readFileSync(index,'utf8').replace(/game\.js\?v=[^'"\s]+/g,'game.js?v=refraction62');
 if(!html.includes('id="play-refraction"'))html=html.replace('<button id="play-cycle">','<button id="play-refraction">THE REFRACTION GATE · NEW PUZZLE ▶</button><button id="play-cycle">');
 html=html.replace('THE CYCLE OF DEPTHS · NEW PUZZLE ▶','THE CYCLE OF DEPTHS ▶').replace('THE CYCLE OF DEPTHS · PUZZLE LAB','CRYSTAL PUZZLE LAB · TWO ROOMS');fs.writeFileSync(index,html);
 const audio=dir+'/audio-events.js';let sound=fs.readFileSync(audio,'utf8').replace("const changes={released:","const changes={catchBroken:'impact',upperSet:'lever',lowerSet:'lever',released:");fs.writeFileSync(audio,sound);
 for(const f of ['build.mjs','publish-update.mjs']){
  const p=dir+'/'+f;let s=fs.readFileSync(p,'utf8');for(const m of modules)if(!s.includes("'"+m+"'"))s=s.replace("'cycle-render.js'","'cycle-render.js','"+m+"'");
  if(f==='publish-update.mjs')for(const image of ['machines','base','reflector','emitter','lift','scene']){const path='assets/refraction62/'+image+'.png';if(!s.includes("'"+path+"'"))s=s.replace("'assets/gate61/gate.png'","'assets/gate61/gate.png','"+path+"'");}
  fs.writeFileSync(p,s);
 }
}
const server=root+'/server.mjs';fs.writeFileSync(server,fs.readFileSync(server,'utf8').replace('listen(3000,','listen(3007,'));
execFileSync('node',['build.mjs'],{cwd:root,stdio:'inherit'});
