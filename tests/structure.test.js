import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
test('the active game has an explicit source and release manifest',()=>{
 assert.ok(fs.existsSync('config/release-manifest.json'),'Missing authoritative release manifest');
 const m=JSON.parse(fs.readFileSync('config/release-manifest.json','utf8'));
 assert.ok(m.modules.length>=100);
 assert.equal(new Set(m.modules.map(x=>x.source)).size,m.modules.length);
 assert.equal(new Set(m.modules.map(x=>x.output)).size,m.modules.length);
 for(const x of m.modules){assert.ok(x.source.startsWith('src/'));assert.ok(fs.existsSync(x.source));}
 assert.ok(fs.readFileSync('index.html','utf8').includes('src/app/game.js'));
});
test('historical scripts and simulation fixtures are kept out of the runtime',()=>{
 assert.ok(fs.existsSync('docs/ARCHITECTURE.md'),'Missing navigation guide');
 assert.ok(fs.existsSync('archive/scripts/README.md'));
 assert.ok(fs.existsSync('tests/routes/loom-route96.js'));
 const rootScripts=fs.readdirSync('.').filter(f=>f.endsWith('.js')&&!f.startsWith('browser-vikings55'));
 assert.deepEqual(rootScripts,[],'Runtime and unit tests must not return to the root');
});
