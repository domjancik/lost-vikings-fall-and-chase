import test from 'node:test';
import assert from 'node:assert/strict';
import {cinematicHudHidden} from '../../src/app/cinematic-hud.js';
const state=(mechanic,machine={})=>({level:{mechanic},machine});
test('gameplay HUD hides for scripted pub and sewer scenes',()=>{
 for(const phase of ['inspect','crack','fall'])assert.equal(cinematicHudHidden(state('alehall',{phase})),true);
 assert.equal(cinematicHudHidden(state('alehall',{phase:'play'})),false);
 for(const phase of ['fall','bounce','settle','hop','run'])assert.equal(cinematicHudHidden(state('sewer',{globe:{phase}})),true);
 assert.equal(cinematicHudHidden(state('sewer',{globe:{phase:'gone'}})),false);
});
test('HUD stays hidden through entry, departure and continuation, then returns in play',()=>{
 const s=state('orbit',{phase:'play'});
 assert.equal(cinematicHudHidden(s,{phase:'entry'}),true);
 assert.equal(cinematicHudHidden(s,null,{phase:'exit'}),true);
 assert.equal(cinematicHudHidden(s,null,{phase:'wait'}),true);
 assert.equal(cinematicHudHidden(s),false);
});
