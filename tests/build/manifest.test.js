import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

import {build,moduleSpecifiers} from '../../tools/build/manifest.mjs';

async function fixture(t, change = () => {}) {
  const fixtures = fileURLToPath(new URL('../../output/build-fixtures/',import.meta.url));
  await fs.mkdir(fixtures,{recursive:true});
  const root = await fs.mkdtemp(path.join(fixtures, 'vikings-build-'));
  t.after(async () => {
    assert.ok(root.startsWith(path.resolve(fixtures) + path.sep));
    await fs.rm(root, {recursive:true, force:true});
  });
  const inputs = {
    'index.html': '<script type="module" src="src/ui/game.js?v=fixture"></script>',
    'src/ui/game.js': "import {value} from '../engine/state.js?v=one';\nexport const lazy = () => import('../engine/state.js?v=two');\nconsole.log(value);",
    'src/engine/state.js': 'export const value = 42;',
    'assets/hero.png': Buffer.from([137,80,78,71,0,1,2,3]),
  };
  const manifest = {
    version:1, entrypoints:['index.html'],
    modules:[{source:'src/ui/game.js',output:'game.js'}, {source:'src/engine/state.js',output:'state.js'}],
    files:[{source:'index.html',output:'index.html'}], assets:['assets/hero.png'],
  };
  change(manifest, inputs);
  inputs['config/release-manifest.json'] = JSON.stringify(manifest);
  for (const [file, bytes] of Object.entries(inputs)) {
    await fs.mkdir(path.dirname(path.join(root,file)), {recursive:true});
    await fs.writeFile(path.join(root,file), bytes);
  }
  return {root,manifest,inputs};
}

test('rejects traversal before touching existing dist', async t => {
  const {root} = await fixture(t, m => { m.modules[0].output='../outside.js'; });
  await fs.mkdir(path.join(root,'dist'));
  await fs.writeFile(path.join(root,'dist/sentinel'),'keep');
  await assert.rejects(async()=>build({root}), /path|traversal/i);
  assert.equal(await fs.readFile(path.join(root,'dist/sentinel'),'utf8'),'keep');
});

test('rejects duplicate output paths across files and modules', async t => {
  const {root} = await fixture(t, m => { m.modules[0].output='index.html'; });
  await assert.rejects(async()=>build({root}), /duplicate/i);
});

test('rejects a dependency omitted from the manifest', async t => {
  const {root} = await fixture(t, m => { m.modules.pop(); });
  await assert.rejects(async()=>build({root}), /dependency|import/i);
});

test('rejects missing input bytes', async t => {
  const {root} = await fixture(t, m => { m.assets.push('assets/missing.png'); });
  await assert.rejects(async()=>build({root}), /missing|ENOENT/i);
});

test('rewrites cross-directory static and dynamic imports and HTML while retaining query strings', async t => {
  const {root} = await fixture(t);
  await build({root});
  const js = await fs.readFile(path.join(root,'dist/game.js'),'utf8');
  assert.match(js,/from '\.\/state\.js\?v=one'/);
  assert.match(js,/import\('\.\/state\.js\?v=two'\)/);
  assert.match(await fs.readFile(path.join(root,'dist/index.html'),'utf8'),/src="game\.js\?v=fixture"/);
});

test('cleans stale dist outputs and copies only explicit assets with unchanged hashes', async t => {
  const {root,inputs} = await fixture(t);
  await fs.mkdir(path.join(root,'dist/old'),{recursive:true});
  await fs.writeFile(path.join(root,'dist/old/obsolete.js'),'obsolete');
  await fs.writeFile(path.join(root,'assets/unlisted.png'),'private source');
  await build({root});
  await assert.rejects(fs.stat(path.join(root,'dist/old/obsolete.js')), /ENOENT/);
  await assert.rejects(fs.stat(path.join(root,'dist/assets/unlisted.png')), /ENOENT/);
  const bytes=await fs.readFile(path.join(root,'dist/assets/hero.png'));
  assert.deepEqual(bytes,inputs['assets/hero.png']);
  const result=JSON.parse(await fs.readFile(path.join(root,'dist/release-manifest.json'),'utf8'));
  const asset=result.files.find(f=>f.path==='assets/hero.png');
  assert.equal(asset.sha256,createHash('sha256').update(bytes).digest('hex'));
  assert.equal(result.files.length,4);
});

test('rejects cleaning outside the exact root dist directory', async t => {
  const {root} = await fixture(t);
  await assert.rejects(async()=>build({root,outDir:path.join(root,'src')}), /dist|output/i);
});

test('retains query and hash suffix together and ignores import-looking comments and strings', async t => {
  const {root} = await fixture(t, (m,inputs) => {
    inputs['src/ui/game.js'] = "// import './absent-comment.js';\nconst note = \"import './absent-string.js'\";\nexport {value} from '../engine/state.js?v=one#fragment';";
  });
  await build({root});
  const source=await fs.readFile(path.join(root,'dist/game.js'),'utf8');
  assert.match(source,/from '\.\/state\.js\?v=one#fragment'/);
  assert.match(source,/import '\.\/absent-comment.js'/);
  assert.match(source,/import '\.\/absent-string.js'/);
});

test('validates literal dynamic imports even without static imports', async t => {
  const {root} = await fixture(t, (m,inputs) => {
    inputs['src/ui/game.js']="export const load = () => import('../engine/missing.js');";
  });
  await assert.rejects(async()=>build({root}), /Missing import dependency/);
});

test('scanner skips regex quotes and import-looking content while distinguishing division', () => {
  const source = String.raw`import {value} from './real.js';
const pattern = /drawConnection\(ctx,(\[\[\d[^;]+?\]\]),'([^']+)'\)/g;
const fake = /import\('ghost.js'\)/;
const quote = /["']/;
const ratio = value / 2 / 3;
if (value) /['"import]/.test('word');
export const load = () => import('./lazy.js');`;
  assert.deepEqual(moduleSpecifiers(source).map(token=>token.value),['./real.js','./lazy.js']);
});

test('rewrites inline HTML module imports and retains distinct source and output hashes', async t => {
  const {root,inputs} = await fixture(t, (m,files) => {
    files['index.html'] = `<script type="module">import {value} from './src/engine/state.js?v=inline'; console.log(value);</script>`;
  });
  const result=await build({root});
  assert.match(await fs.readFile(path.join(root,'dist/index.html'),'utf8'),/from '\.\/state\.js\?v=inline'/);
  const html=result.files.find(f=>f.path==='index.html');
  assert.equal(html.sourceSha256,createHash('sha256').update(inputs['index.html']).digest('hex'));
  assert.notEqual(html.sourceSha256,html.sha256);
  const asset=result.files.find(f=>f.path==='assets/hero.png');
  assert.equal(asset.sourceSha256,asset.sha256);
});

test('rejects inline HTML modules importing an omitted dependency', async t => {
  const {root} = await fixture(t, (m,files) => {
    files['index.html'] = `<script type="module">import './src/engine/absent.js';</script>`;
  });
  await assert.rejects(async()=>build({root}), /Missing import dependency/);
});

test('rejects computed, template and concatenated dynamic imports that cannot establish closure', () => {
  for(const expression of ['import(filename)', 'import(`./state.js`)', "import('./' + filename)"]) {
    assert.throws(()=>moduleSpecifiers(`export const load = () => ${expression};`), /dynamic import.*literal/i);
  }
  assert.deepEqual(moduleSpecifiers("const here = import.meta.url; export const load = () => import('./state.js');").map(token=>token.value),['./state.js']);
});
