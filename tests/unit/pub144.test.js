import test from 'node:test';
import assert from 'node:assert/strict';
import {alehallCoastPlacement,alehallWindowScenery,alehallLoftBacking,ALEHALL_WINDOWS} from '../../src/levels/pub/scenery.js';
import {ALEHALL_LOFT} from '../../src/levels/pub/layout.js';

test('the existing outdoor coast keeps its approved position, density and footprint',()=>{
 for(const camera of [{x:0,y:0},{x:650,y:300},{x:1700,y:-150}])assert.deepEqual(alehallCoastPlacement(camera),{x:Math.round((camera.x*.82-120)/2)*2,y:Math.round((310+camera.y*.35)/2)*2,w:768,h:384});
});
test('interior windows always have scenery across both camera axes',()=>{
 for(const x of [0,400,800,1200,1800])for(const y of [-800,0,250,500,900]){
  const groups=alehallWindowScenery({x,y});assert.equal(groups.length,ALEHALL_WINDOWS.length);
  for(const {opening,tiles}of groups)for(let py=opening.y;py<opening.y+opening.h;py+=2)for(let px=opening.x;px<opening.x+opening.w;px+=2)assert.ok(tiles.some(t=>px>=t.x&&px<t.x+t.w&&py>=t.y&&py<t.y+t.h),'no gray at '+[x,y,px,py]);
 }
});
test('loft wall backing joins the underside, posts and actual room floor without blocking the route',()=>{
 const p=alehallLoftBacking();assert.equal(p.y,ALEHALL_LOFT.y+ALEHALL_LOFT.h);assert.equal(p.y+p.h,760);assert.ok(p.x>ALEHALL_LOFT.x&&p.x+p.w<ALEHALL_LOFT.x+ALEHALL_LOFT.w);assert.equal(p.collision,false);
});
