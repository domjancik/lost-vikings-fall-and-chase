import test from 'node:test';
import assert from 'node:assert/strict';
const cart=await import('../../src/levels/warden/cart-art.js').catch(()=>null);

test('native carriage preserves the physical rider deck and dock contact without stretch',()=>{
 assert.ok(cart?.cartPlacement,'Missing independently registered native carriage');
 const art=cart.CART_ART,p={x:1740,y:870,w:300};
 assert.deepEqual(art.sourceBounds,[5,23,182,84],'Trim only transparent source padding from body draw');
 const r=cart.cartPlacement(p);
 assert.equal(r.w/art.nativeSize[0],2);assert.equal(r.h/art.nativeSize[1],2);
 assert.equal(r.x+art.deck[0]*2,p.x);assert.equal(r.y+art.deck[1]*2,p.y);
 assert.equal(art.deck[2]*2,p.w);
 for(const name of ['wheelNear','wheelFar']){
  const wheel=cart.cartWheelPlacement(p,name);
  assert.equal(wheel.visibleBottom,940);
  assert.equal(wheel.y+(art.wheelBottom-art.pieces[name].center[1])*2,940);
 }
 for(const y of [500,652,830,870]){
  const pose=cart.cartPlacement({...p,y});assert.equal(pose.y+art.deck[1]*2,y);
  assert.deepEqual(cart.cartPort({...p,y},'wheel'),{x:p.x+158,y:y-18});
  assert.deepEqual(cart.cartPort({...p,y},'clampLeft'),{x:p.x+2,y:y-90});
  assert.deepEqual(cart.cartPort({...p,y},'clampRight'),{x:p.x+296,y:y-90});
 }
});
