import test from 'node:test';
import assert from 'node:assert/strict';
const module=await import('../../tools/dev/server.mjs').catch(()=>null);
test('developer server serves the declared game and keeps local credentials private',async()=>{
 assert.equal(typeof module?.createDevServer,'function','Missing maintained developer server');
 const server=await module.createDevServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{const base='http://127.0.0.1:'+server.address().port;
  const index=await fetch(base+'/');assert.equal(index.status,200);assert.ok((await index.text()).includes('src/app/game.js'));
  const game=await fetch(base+'/src/app/game.js');assert.equal(game.status,200);
  for(const url of ['/.git/config','/.herenow/state.json','/output/reorg99/snapshot.json','/%2e%2e/.env'])assert.equal((await fetch(base+url)).status,404);
 }finally{await new Promise(r=>server.close(r));}
});
