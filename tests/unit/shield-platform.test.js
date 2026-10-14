import test from 'node:test';
import assert from 'node:assert/strict';
import {SHIELD,shieldTransform} from '../../src/heroes/hero-geometry.js';
import {createState,step} from '../../src/core/engine.js';
import {heroDrawOrder} from '../../src/heroes/hero-render-order.js';

test('the shield is painted before both passengers, with stable other ordering',()=>{
 const h=[{id:0,support:2},{id:1,support:2},{id:2,support:null}];
 assert.deepEqual(heroDrawOrder(h).map(h=>h.id),[2,0,1]);
 assert.deepEqual(h.map(h=>h.id),[0,1,2]);
});

test('raised shield centers its visual deck on the rider support plane',()=>{
 const t=shieldTransform({shieldUp:true},'overhead',0);
 assert.equal(t.y,SHIELD.upTop);
 assert.equal(t.width,28);assert.equal(t.height,48);
});

test('a shield passenger remains on the center plane while Olaf walks',()=>{
 const s=createState();s.active=2;
 Object.assign(s.heroes[2],{x:210,y:566,shieldUp:true,shield:true});
 Object.assign(s.heroes[0],{x:210,y:486,ground:true,support:2});
 for(let n=0;n<20;n++)step(s,{right:true},1/120);
 const o=s.heroes[2],r=s.heroes[0];
 assert.equal(r.support,2);
 assert.equal(r.y+44,o.y+shieldTransform(o,'overhead',0).y);
 assert.ok(Math.abs(r.x-o.x)<1e-6);
});
