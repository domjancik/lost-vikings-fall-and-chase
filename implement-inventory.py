from pathlib import Path
p=Path('.')
def write(f,s): (p/f).write_text(s,encoding='utf-8')
def edit(f,a,b):
 q=p/f;s=q.read_text(encoding='utf-8-sig');assert a in s,(f,a);q.write_text(s.replace(a,b),encoding='utf-8')
write('health.js', '''export function damage(s,h,amount=1,fatal=false){
 if(h.dead||(!fatal&&(h.invulnerable||0)>0))return false;
 h.hp=Math.max(0,h.hp-amount);h.invulnerable=.95;h.hurt=.35;s.hurt=.35;
 if(!h.hp){h.dead=true;h.vx=0;h.vy=0;h.shield=false;s.failed=true;s.won=false;s.failure= ['Erik','Baleog','Olaf'][h.id]+' has fallen. All three must survive.';}
 return true;
}
''')
write('inventory.js', '''export const itemTypes={flour:{name:'Flour',description:'Combine with spice at the mixing bowl.',icon:0},spice:{name:'Dragon spice',description:'Combine with flour at the mixing bowl.',icon:1},dough:{name:'Spiced dough',description:'Load the oven, then choose WARM.',icon:2},ticket:{name:'Bronze ticket',description:'Use beside the kitchen turnstile.',icon:3},apple:{name:'Apple',description:'Restores one health. Not consumed at full health.',heal:1,icon:4},meat:{name:'Roast',description:'Restores two health.',heal:2,icon:5},lamp:{name:'UV lamp',description:'Install in the optical projector.',icon:6},red:{name:'Red lens',description:'Sunset above: install, then aim HIGH.',icon:7},blue:{name:'Blue lens',description:'Ocean below: swap into projector, aim LOW.',icon:8},bomb:{name:'Timed bomb',description:'Two-second fuse, 105-unit blast. Drop and retreat!',icon:10},key:{name:'Neon key',description:'Use beside the vault exit lock.',icon:11}};
export function message(s,text){s.feedback={sequence:(s.feedback?.sequence||0)+1,message:text};}
export function giveItem(h,type){h.inventory??=[null,null,null,null];const slot=h.inventory.indexOf(null);if(slot<0||h.dead)return false;h.inventory[slot]=type;return true;}
export function transferItem(s,from,to,slot=s.heroes[from].itemSlot||0){const a=s.heroes[from],b=s.heroes[to],type=a.inventory[slot];if(from===to||!type||a.dead||b.dead||Math.abs(a.x-b.x)>72||Math.abs(a.y-b.y)>70||!giveItem(b,type)){message(s,'Move the Vikings together and leave a free slot in the receiving bag.');return false;}a.inventory[slot]=null;message(s,itemTypes[type].name+' passed to '+['Erik','Baleog','Olaf'][to]+'.');return true;}
export function dropItem(s){const h=s.heroes[s.active],slot=h.itemSlot||0,type=h.inventory[slot];if(!type||h.dead||s.failed)return false;s.items.push({id:'drop-'+(++s.itemSerial),type,x:h.x,y:h.y});h.inventory[slot]=null;message(s,'Dropped '+itemTypes[type].name+'. USE nearby to recover it.');return true;}
export function pickupItem(s){const h=s.heroes[s.active],item=s.items.find(i=>!i.locked&&Math.abs(i.x-h.x)<48&&Math.abs(i.y-h.y)<64);if(!item||h.dead||s.failed)return false;if(!giveItem(h,item.type)){message(s,'Bag full. Give or drop an item first.');return true;}s.items=s.items.filter(i=>i!==item);message(s,'Picked up '+itemTypes[item.type].name+'. Open BAG / I to select it; Q uses the selected slot.');return true;}
export function useItem(s){const h=s.heroes[s.active],slot=h.itemSlot||0,type=h.inventory[slot];if(!type||h.dead||s.failed)return false;const def=itemTypes[type];if(def.heal){if(h.hp>=3){message(s,'Already at full health. Food kept.');return false;}h.hp=Math.min(3,h.hp+def.heal);h.inventory[slot]=null;message(s,def.name+' restored health.');return true;}if(type==='bomb'){s.bombs.push({x:h.x+h.face*30,y:h.y+32,fuse:2});h.inventory[slot]=null;message(s,'Bomb placed! Two seconds: retreat out of the blast radius.');return true;}if(s.itemAction?.(type,h,slot))return true;message(s,'Use '+def.name+' beside the matching object. Item kept.');return false;}
''')
edit('engine.js',"export const W=1440,H=650;","import {damage} from './health.js?v=shield28';\nimport {pickupItem,useItem} from './inventory.js?v=shield28';\nimport {inventoryStep,setupInventoryLevel} from './inventory-campaign.js?v=shield28';\nexport const W=1440,H=650;")
edit('engine.js','export function createState(round=0){return {','export function createState(round=0){const state={')
edit('engine.js','cooldown:0,hurt:0};}','cooldown:0,hurt:0,failed:false,items:[],bombs:[],itemSerial:0};for(const h of state.heroes){h.inventory=[null,null,null,null];h.itemSlot=0;h.invulnerable=0;}setupInventoryLevel(state);return state;}')
edit('engine.js','if(s.won)return; dt=Math.min(dt,.033);','if(s.won||s.failed)return; dt=Math.min(dt,.033);for(const h of s.heroes){h.invulnerable=Math.max(0,(h.invulnerable||0)-dt);h.hurt=Math.max(0,(h.hurt||0)-dt);}\n if(s.round>=6){inventoryStep(s,input,dt);return;}if(input.item)useItem(s);if(input.interact&&pickupItem(s))input={...input,interact:false};')
edit('engine.js',"if(s.hurt===0){h.hp=Math.max(1,h.hp-1);h.x=Math.max(20,h.x-35);s.hurt=.9;}","if(damage(s,h,1))h.x=Math.max(20,h.x-35);")
edit('engine.js','s.won=s.power&&!s.turret&&s.heroes.every','s.won=!s.failed&&s.power&&!s.turret&&s.heroes.every')
edit('movement.js',"import {SHIELD}","import {damage} from './health.js?v=shield28';\nimport {SHIELD}")
edit('movement.js','if(h.y>700){h.x=h.x>990?1020:pub?700:760;h.y=530;h.vx=0;h.vy=0;h.support=null;h.hp=Math.max(1,h.hp-1);s.hurt=.6;}','if(h.y>700)damage(s,h,3,true);')
edit('campaign.js',"import {shieldHit}","import {damage} from './health.js?v=shield28';\nimport {segmentHit} from './projectile-collision.js?v=shield28';\nimport {shieldHit}")
edit('campaign.js','const shield=shieldHit(o,p,px,py);', '''const shield=shieldHit(o,p,px,py);
  if(['spark','ghost','fire'].includes(p.kind)){
   const body=s.heroes.map(h=>({h,hit:segmentHit(px,py,p.x,p.y,{x:h.x-16,y:h.y,w:32,h:44})})).filter(e=>e.hit).sort((a,b)=>a.hit.t-b.hit.t)[0];
   if(body&&body.hit.t<(shield?.t??Infinity)){damage(s,body.h);p.dead=true;continue;}
  }''')
edit('campaign.js','s.won=s.power&&s.heroes.every','s.won=!s.failed&&s.power&&s.heroes.every')
edit('controls.js',"e:'interact',s:'interact'","e:'interact',s:'interact',q:'item'")
edit('controls.js',"interact:pending.has('interact')","interact:pending.has('interact'),item:pending.has('item')")
# initial health food, including existing rounds
edit('engine.js','setupInventoryLevel(state);return state;','setupInventoryLevel(state);if(round<6)state.items.push({id:\'apple\',type:\'apple\',x:350,y:566},{id:\'meat\',type:\'meat\',x:1080,y:566});return state;')
