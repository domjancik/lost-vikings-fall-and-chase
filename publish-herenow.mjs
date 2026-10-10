import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';
const files=['index.html','style.css','game.js','engine.js','assets/arcade-pub.png'];
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png'};
let key=process.env.HERENOW_API_KEY||'';if(!key){try{key=(await fs.readFile(path.join(os.homedir(),'.herenow/credentials'),'utf8')).trim();}catch{}}
const headers={'Content-Type':'application/json','X-HereNow-Client':'codex/direct-api'};if(key)headers.Authorization='Bearer '+key;
async function json(url,body){const r=await fetch(url,{method:'POST',headers,body:JSON.stringify(body)});if(!r.ok)throw Error(`Publish API ${r.status}: ${await r.text()}`);return r.json();}
const manifest=await Promise.all(files.map(async f=>({path:f,size:(await fs.stat('dist/'+f)).size,contentType:types[path.extname(f)]})));
const created=await json('https://here.now/api/v1/publish',{files:manifest,displayName:'Last Call — A Viking Puzzle Adventure'});
await fs.mkdir('.herenow',{recursive:true});await fs.writeFile('.herenow/pending.json',JSON.stringify(created));
for(const u of created.upload.uploads){const bytes=await fs.readFile('dist/'+u.path);const r=await fetch(u.url,{method:'PUT',headers:{'Content-Type':u.contentType||types[path.extname(u.path)]},body:bytes});if(!r.ok)throw Error(`Upload ${u.path}: ${r.status}`);console.log('Uploaded '+u.path);}
const done=await json(created.upload.finalizeUrl,{versionId:created.upload.versionId});await fs.writeFile('.herenow/state.json',JSON.stringify({publishes:{[created.slug]:{...created,...done}}}));
console.log(JSON.stringify({siteUrl:done.siteUrl||created.siteUrl,status:done.status,isLive:done.isLive,authMode:key?'authenticated':'anonymous',expiresAt:done.expiresAt||created.expiresAt,claimUrl:created.claimUrl},null,2));
