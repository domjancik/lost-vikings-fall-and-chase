import test from 'node:test';
import assert from 'node:assert/strict';
import * as scenery from '../../src/levels/pub/scenery.js';
test('orb room keeps localized pools of light instead of washing the whole room',()=>{
 assert.equal(typeof scenery.alehallRoomLights,'function');
 const lights=scenery.alehallRoomLights(706);
 assert.ok(lights.find(l=>l.x===2120).r<=120);assert.ok(lights.find(l=>l.x===1850).r<=75);
 const shade=(x,y,globeY)=>scenery.ALEHALL_ROOM_LIGHTING.ambient*scenery.alehallRoomShade(x,y)*scenery.alehallRoomLights(globeY).reduce((a,l)=>a*(1-l.light*Math.max(0,1-Math.hypot(x-l.x,y-l.y)/l.r)),1);
 assert.ok(shade(1980,690,706)>.9,'space between candle and orb stays dark');
 assert.ok(shade(2320,710,706)>.9,'cup corner stays dark');
 assert.ok(shade(2120,706,706)<.3,'orb is readable');
 assert.ok(shade(1850,702,706)<.4,'small candle pool remains readable');
 assert.equal(shade(1500,700,706),0,'main room unaffected');
});
