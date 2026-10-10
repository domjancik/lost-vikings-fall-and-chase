import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const python=process.platform==='win32'?'tools/pixel-fixer-venv/Scripts/python.exe':'tools/pixel-fixer-venv/bin/python';
test('pixel normalization cannot create colors outside source cells at fractional ratios',{skip:!existsSync(python)},()=>{assert.doesNotThrow(()=>execFileSync(python,['tools/test-pixel-pipeline.py'],{encoding:'utf8',stdio:'pipe'}));});
