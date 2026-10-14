import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {checkRelease} from './check.mjs';
import {repositoryRoot} from '../build/manifest.mjs';
import {validateVisualGates} from './visual-gates.mjs';
const {manifest}=await checkRelease();
const files=[...manifest.files.map(f=>f.path),'release-manifest.json'];
for(const file of files.filter(f=>f.endsWith('/visual-gates.json'))){
 const gate=JSON.parse(await fs.readFile(path.join(repositoryRoot,'dist',file),'utf8'));
 validateVisualGates(gate,file);
}
if(process.argv.includes('--dry-run')){
 console.log(`Publish preflight passed: ${files.length} explicit files; no credentials read or network requests made`);
}else{
 const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.json':'application/json'};
 let key=process.env.HERENOW_API_KEY||'';
 if(!key){try{key=(await fs.readFile(path.join(os.homedir(),'.herenow/credentials'),'utf8')).trim();}catch{}}
 const headers={'Content-Type':'application/json','X-HereNow-Client':'codex/direct-api'};if(key)headers.Authorization='Bearer '+key;
 async function json(url,body,method='POST'){
  const r=await fetch(url,{method,headers,body:JSON.stringify(body)});if(!r.ok)throw Error('Publish API '+r.status);return r.json();
 }
 const list=await Promise.all(files.map(async file=>({path:file,size:(await fs.stat(path.join(repositoryRoot,'dist',file))).size,contentType:types[path.extname(file)]||'application/octet-stream'})));
 const endpoint='https://here.now/api/v1/publish/united-marsh-6ppd';
 const status=await fetch(endpoint,{headers});if(!status.ok)throw Error('Cannot read current publish');const current=await status.json();
 const created=await json(endpoint,{files:list,baseVersionId:current.currentVersionId,displayName:'Last Call — A Viking Puzzle Adventure'},'PUT');
 const state=path.join(repositoryRoot,'.herenow');await fs.mkdir(state,{recursive:true});await fs.writeFile(path.join(state,'pending.json'),JSON.stringify(created));
 const allowed=new Set(files);
 for(let offset=0;offset<created.upload.uploads.length;offset+=3)await Promise.all(created.upload.uploads.slice(offset,offset+3).map(async upload=>{
  if(!allowed.has(upload.path))throw Error('Unexpected upload path');
  const bytes=await fs.readFile(path.join(repositoryRoot,'dist',upload.path));
  for(let attempt=0;attempt<5;attempt++){
   try{const r=await fetch(upload.url,{method:'PUT',headers:{'Content-Type':upload.contentType||types[path.extname(upload.path)]},body:bytes});if(!r.ok)throw Error('Upload HTTP '+r.status);break;}
   catch(error){if(attempt===4)throw error;await new Promise(r=>setTimeout(r,1000*(attempt+1)));}
  }
 }));
 const done=await json(created.upload.finalizeUrl,{versionId:created.upload.versionId});
 await fs.writeFile(path.join(state,'state.json'),JSON.stringify({publishes:{[created.slug]:{...created,...done}}}));
 console.log(JSON.stringify({siteUrl:done.siteUrl||created.siteUrl,isLive:done.isLive,versionId:created.upload.versionId}));
}
