import test from 'node:test';
import assert from 'node:assert/strict';
import {storyFarLayout} from '../../src/campaigns/story/story-background.js';
const views=[{width:1264,height:790},{width:632,height:395},{width:365,height:790},{width:183,height:395},{width:3600,height:790}];
test('story far scenery keeps the same apparent scale when gameplay zoom doubles',()=>{const a=storyFarLayout({x:0,y:0},views[0]),b=storyFarLayout({x:0,y:362},views[1]);assert.ok(Math.abs(a.size/790-b.size/395)<.01);assert.ok(b.size<=700,'2x scenery must fit one viewport, not a fixed 1200-unit tile');});
test('far tiles cover portrait, landscape and ultrawide at all campaign camera limits',()=>{for(const view of views)for(const x of [-400,0,1250,2880])for(const y of [-650,0,605]){const l=storyFarLayout({x,y},view);assert.ok(l.y<=y);assert.ok(l.y+l.size>=y+view.height);assert.ok(l.tiles[0]<=x);assert.ok(l.tiles.at(-1)+l.size>=x+view.width);for(let i=1;i<l.tiles.length;i++)assert.equal(l.tiles[i]-l.tiles[i-1],l.size);for(const v of [l.y,l.size,...l.tiles])assert.equal(Math.abs(v%2),0);}});
test('far scenery tracks horizontal camera travel at its slow parallax rate',()=>{const view=views[1],a=storyFarLayout({x:0,y:0},view),b=storyFarLayout({x:200,y:0},view);assert.ok(Math.abs((b.anchor-200)-a.anchor+32)<=2);});
