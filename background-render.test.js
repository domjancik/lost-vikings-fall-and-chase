import test from 'node:test';
import assert from 'node:assert/strict';
import {coverRect,viewportSize} from './background-render.js';
test('background source crop always preserves proportions',()=>{for(const [sw,sh] of [[1536,1024],[1920,1080],[1024,1536]]){const r=coverRect(sw,sh,1440,790);assert.ok(Math.abs(r.sw/r.sh-1440/790)<1e-9);assert.ok(r.sx>=0&&r.sy>=0&&r.sx+r.sw<=sw+.001&&r.sy+r.sh<=sh+.001);}});
test('canvas dimensions preserve display proportions even on wide screens',()=>{for(const [w,h] of [[390,844],[844,390],[1920,720]]){const v=viewportSize(w,h);assert.ok(Math.abs(v.width/v.height-w/h)<.001);assert.equal(v.height,790);}});
