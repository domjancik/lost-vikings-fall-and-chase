import test from 'node:test';import assert from 'node:assert/strict';
import {snapAngle,animationTime,spritePose} from '../../src/render/pixel-grid.js';
import {projectilePose,environmentPose} from '../../src/render/environment-animation.js';
import {createState} from '../../src/core/engine.js';
test('object poses quantize translation, dimensions and angle without scaling shimmer',()=>{const p=spritePose(610.7,490.5,79.3,99.7,.037);for(const k of ['x','y','w','h'])assert.equal(p[k]%2,0);assert.equal(p.angle,snapAngle(.037));assert.equal(animationTime(.01),animationTime(.05));});
test('moving arrows remain snapped even with fractional interpolation',()=>{const p=projectilePose({prevX:631.3,prevY:580.7,x:635.9,y:578.1,v:420,vy:-400},.35);assert.equal(p.x%2,0);assert.equal(p.y%2,0);assert.equal(p.angle,snapAngle(Math.atan2(-400,420)));});
test('environment animations advance in discrete frames while physics stays smooth',()=>{const s=createState(2);s.time=.01;const a=environmentPose(s);s.time=.05;assert.equal(environmentPose(s).phase,a.phase);s.time=.1;assert.notEqual(environmentPose(s).phase,a.phase);});
