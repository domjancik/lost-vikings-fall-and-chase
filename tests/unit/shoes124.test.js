import test from 'node:test';import assert from 'node:assert/strict';
import {createState,step} from '../../src/core/engine.js';
import {shoeRackPlan} from '../../src/levels/orbit/shoe-rack-layout.js';
import {dropItem} from '../../src/core/inventory.js';
for(const round of [8,9])test('magnetic level '+round+' visibly stocks three collectible boot pairs on a grounded rack',()=>{
 const s=createState(round,'cycle'),p=shoeRackPlan(s);assert.equal(p.stock.length,3);assert.equal(p.loose.length,0);assert.equal(p.floor,round===8?1000:1260);assert.equal(p.rack.y+p.rack.sole*2,p.floor);
 for(const boot of p.stock)assert.equal(boot.y+boot.sole*2,p.shelfY);
 step(s,{interact:true},1/120);assert.equal(shoeRackPlan(s).stock.length,2);assert.equal(s.heroes[0].inventory[0],'magneticShoes');
 dropItem(s);assert.equal(shoeRackPlan(s).stock.length,2);assert.equal(shoeRackPlan(s).loose.length,1);step(s,{interact:true},1/120);assert.equal(shoeRackPlan(s).loose.length,0);
});
