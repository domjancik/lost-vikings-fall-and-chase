// Observe actual transitions once. No repeated sounds from held action buttons.
export function createFreightSounds(){let state=null,old=null,lastCart=0;return s=>{
 if(s.level.mechanic!=='freight'){state=null;old=null;return [];}
 const g=s.machine,now={vent:g.ventOpen,cell:g.cellInstalled,exhaust:g.exhaustOpen,rescue:g.rescue.map(Boolean),inspectors:g.inspectors.map(e=>({hp:e.hp,phase:e.phase})),cart:g.cart.x};
 if(state!==s){state=s;old=now;lastCart=s.time;return [];}
 const events=[],add=(name,x,id=0)=>events.push({name,x,id});
 if(!old.vent&&now.vent)add('pump',480);
 if(!old.cell&&now.cell)add('unlock',1580,1);
 if(!old.exhaust&&now.exhaust)add('pour',2300);
 for(let n=0;n<2;n++)if(!old.rescue[n]&&now.rescue[n])add('chain',[620,1840][n],1);
 for(const e of g.inspectors){const prior=old.inspectors[e.id];if(e.hp>0&&e.phase==='aim'&&prior.phase!=='aim')add('pump',e.x,1);if(e.hp<prior.hp)add(e.hp?'impact':'explosion',e.x,1);}
 if(s.time-lastCart>.35&&Math.abs(now.cart-old.cart)>.01){add('cart',g.cart.x);lastCart=s.time;}
 old=now;return events;
 };}
