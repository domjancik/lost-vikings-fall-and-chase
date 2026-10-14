import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advanceMechanisms,gateWall,liftSurface,gateFrameRects} from '../../src/campaigns/story/story-mechanisms.js';
test('retracted door frame leaves its actual walk-through opening visibly empty',()=>{const g={x:800,y:610,h:300};for(const r of gateFrameRects(g))assert.ok(!(816>=r.x&&816<=r.x+r.w&&460>=r.y&&460<=r.y+r.h));});
test('shutter collision follows its eased moving leaf, never disappears on activation',()=>{
 const g={x:800,y:610,h:260,progress:0,target:true};
 advanceMechanisms({gates:[g],lifts:[],payloads:[]},[],1/120);
 assert.ok(g.progress>0&&g.progress<.02);const w=gateWall(g);assert.ok(w.on);assert.ok(w.bottom>600);
 for(let i=0;i<180;i++)advanceMechanisms({gates:[g],lifts:[],payloads:[]},[],1/120);
 assert.equal(g.progress,1);assert.equal(gateWall(g).on,false);
});
test('lift carries every supported rider continuously and stops at its actual landing',()=>{
 const l={x:100,y:610,w:144,low:610,high:250,target:250,v:0};
 const heroes=[0,1,2].map(id=>({id,x:125+id*40,y:566,vy:0,ground:true,prevY:566}));
 const m={gates:[],lifts:[l],payloads:[]};let last=l.y;
 for(let i=0;i<600;i++){advanceMechanisms(m,heroes,1/120);assert.ok(Math.abs(l.y-last)<2);for(const h of heroes)assert.ok(Math.abs(h.y+44-l.y)<.001);last=l.y;}
 assert.equal(l.y,250);assert.equal(liftSurface(l).y,250);
});
test('released payload follows one local trajectory and reports arrival only at destination',()=>{
 const p={x:900,y:440,fromX:900,fromY:440,toX:900,toY:590,progress:0,released:true,duration:1.6};
 const m={gates:[],lifts:[],payloads:[p]};let last=p.y;
 for(let i=0;i<100;i++){advanceMechanisms(m,[],1/120);assert.ok(p.y>=last&&p.y-last<3);assert.equal(p.arrived,false);last=p.y;}
 for(let i=0;i<100;i++)advanceMechanisms(m,[],1/120);assert.equal(p.arrived,true);assert.equal(p.y,590);
});
