import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {repositoryRoot,readManifest,validateManifest} from '../build/manifest.mjs';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function checkRelease(root=repositoryRoot){
 root=path.resolve(root);
 const declared=validateManifest(await readManifest(root)),stamp=JSON.parse(await fs.readFile(path.join(root,'dist/release-manifest.json'),'utf8'));
 if(stamp.version!==1||stamp.files.length!==declared.length)throw Error('Release manifest changed; rebuild');
 const emitted=new Map(stamp.files.map(f=>[f.path,f]));
 if(emitted.size!==declared.length)throw Error('Duplicate emitted file');
 for(const file of declared){
  const record=emitted.get(file.output);if(!record||record.source!==file.source)throw Error('Release mapping changed; rebuild '+file.output);
  if(sha(await fs.readFile(path.join(root,file.source)))!==record.sourceSha256)throw Error('Source changed; rebuild '+file.source);
  if(sha(await fs.readFile(path.join(root,'dist',file.output)))!==record.sha256)throw Error('Output changed; rebuild '+file.output);
 }
 return{files:stamp.files.length,manifest:stamp};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){const result=await checkRelease();console.log(`Release verified: ${result.files} files match current source and build hashes`);}
