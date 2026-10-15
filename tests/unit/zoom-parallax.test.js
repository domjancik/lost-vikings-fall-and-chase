import test from 'node:test';import assert from 'node:assert/strict';
import {viewportSize,storedZoom,nextZoom} from '../../src/render/background-render.js';
import {cameraTarget,parallaxOffsets} from '../../src/render/view-camera.js';
import {labelLayout} from '../../src/render/text-render.js';
test('2x zoom halves the visible world without changing display proportions',()=>{const one=viewportSize(1440,900,1),two=viewportSize(1440,900,2);assert.equal(two.height,one.height/2);assert.equal(two.width,one.width/2);});
test('exploration camera tracks jumps and stays inside the world',()=>{const v={width:720,height:395};const low=cameraTarget({x:100,y:566,vx:0},v),high=cameraTarget({x:675,y:148,vx:0},v);assert.equal(low.x,0);assert.ok(low.y>high.y);const end=cameraTarget({x:1430,y:566,vx:230},v);assert.equal(end.x,720);assert.ok(end.y<=395);});
test('parallax layers move at distinct speeds on the shared grid',()=>{const a=parallaxOffsets({x:0,y:0}),b=parallaxOffsets({x:200,y:100});assert.equal(b.length,3);assert.ok(new Set(b.map(p=>p.x)).size===3);for(const p of b){assert.equal(Math.abs(p.x%2),0);assert.equal(Math.abs(p.y%2),0);}assert.notDeepEqual(a,b);});
test('labels follow the vertical camera at 2x zoom',()=>{const p=labelLayout({x:650,y:468,size:10},600,2,350);assert.equal(p.y,236);});


test('zoom cycles overview, intermediate and exploration and restores every option',()=>{assert.deepEqual([1,1.5,2].map(nextZoom),[1.5,2,1]);for(const z of [1,1.5,2])assert.equal(storedZoom(String(z)),z);for(const z of [null,'','bad','0','3'])assert.equal(storedZoom(z),2);});
test('fractional zoom has stable integer canvas dimensions on desktop and mobile',()=>{for(const [w,h] of [[1440,900],[844,390],[430,780]]){const v=viewportSize(w,h,1.5);assert.ok(Number.isInteger(v.width));assert.ok(Number.isInteger(v.height));assert.ok(Math.abs(v.height-790/1.5)<1);assert.ok(Math.abs(v.width/v.height-w/h)<.002);}});
