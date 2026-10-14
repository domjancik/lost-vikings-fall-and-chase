import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {repositoryRoot,readManifest,validateManifest} from '../build/manifest.mjs';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json'};
export async function createDevServer({root=repositoryRoot,built=false}={}){
 root=path.resolve(root);const base=built?path.join(root,'dist'):root;
 const manifest=built?JSON.parse(await fs.readFile(path.join(base,'release-manifest.json'),'utf8')):await readManifest(root);
 const allowed=new Set(built?manifest.files.map(f=>f.path):validateManifest(manifest).map(f=>f.source));
 const realBase=await fs.realpath(base);
 return http.createServer(async(req,res)=>{
  try{
   if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
   const url=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=url==='/'?'index.html':url.slice(1);
   if(!allowed.has(file)){res.writeHead(404);res.end('Not found');return;}
   const target=await fs.realpath(path.resolve(base,file));
   if(!target.startsWith(realBase+path.sep)){res.writeHead(404);res.end('Not found');return;}
   const bytes=await fs.readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(404);res.end('Not found');}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const server=await createDevServer({built:process.argv.includes('--dist')});
 server.listen(Number(process.env.PORT||3000),'127.0.0.1',()=>console.log('Last Call on http://127.0.0.1:'+server.address().port));
}
