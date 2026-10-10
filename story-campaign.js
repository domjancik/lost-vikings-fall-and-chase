import {prepareMotion,integrateMotion} from './movement.js?v=far45';
import {startBash,bashImpact} from './bash.js?v=far45';
import {shieldHit,segmentHit} from './projectile-collision.js?v=far45';
import {giveItem,pickupItem,useItem,message} from './inventory.js?v=far45';
import {damage} from './health.js?v=far45';
import {makeEnemy,updateEnemies,hurtEnemy,nearestEnemyHit} from './story-enemies.js?v=far45';
const floor=(x,y,w)=>({x,y,w});
const stairs=(x=360)=>[floor(x,490,140),floor(x+150,380,140),floor(x+300,280,180)];
const base={worldWidth:2880,worldTop:0,worldBottom:1000,deathY:900,floors:[floor(0,610,2880)],spawnY:566,exit:{x:2720,y:610,w:160}};
export const storyLevels=[
 {...base,name:'LAST ORDERS',subtitle:'The last game promises a way home.',accent:'#e7be76',platforms:stairs(),scene:0,mechanic:'last-orders',story:['The Neon Stag closes tonight. Above the bar, three brass warriors bow for the last time.','A cabinet promises a passage home. Erik: “One game. Then we leave.”'],hint:'Erik reaches the service key on the high shelf. Use the key at the staff gate. Baleog cuts the cabinet tether beyond the bar.'},
 {...base,name:'FREIGHT WITHOUT ARRIVAL',subtitle:'The finish line sends every delivery back.',accent:'#81d3df',platforms:stairs(930),scene:1,mechanic:'freight',story:['The lift descends beneath the game they won. Every cart circles back carrying the same unopened parcel.','Its driver remembers the last thousand journeys. Olaf: “Where were you supposed to arrive?”'],hint:'Erik operates the elevated dispatch control. Baleog shoots the delivery lock. Olaf pushes the cart right with his front shield into its stationary berth.'},
 {...base,name:'ROOMS THAT REMEMBER',subtitle:'The doors remember people the game erased.',accent:'#c39edb',platforms:[],scene:2,mechanic:'memory',story:['Some rooms are missing. Their residents still knock from the other side.','The returning ghost is not guarding the door. Something has bound it to its route.'],hint:'Erik run-bashes the bell. Use the awakened door. Olaf faces left to return the wraith to its eye; Baleog cuts the final restraint. Doors return safely to earlier rooms.'},
 {...base,name:'BORROWED FIRE',subtitle:'A creature made to work can choose to help.',accent:'#ffc17c',platforms:stairs(180),scene:3,mechanic:'fire',story:['The dragon remembers every world it has forged. Tonight the furnaces are melting them back down.','Baleog lowers his sword. “Tell us what to break.”'],hint:'Baleog cuts the ore chain at 1800. Put Olaf facing right near the crucible at 1900; keep the crew behind him. Erik run-bashes the bellows at 850. Three returned flames bake a departure ticket; pick it up and use it at the gate.'},
 {...base,name:'THE UNWRITTEN ARCHIVE',subtitle:'Carry the people the system will not keep.',accent:'#acaaff',platforms:[floor(660,410,210)],scene:4,mechanic:'archive',story:['The gallery offers a perfect reconstruction of home. It contains none of the people they have met.','They take the unfinished archive instead. Inside, windows are still being lit.'],hint:'Olaf raises his shield beneath the high archive shelf; Erik jumps onto it and then to the red lens. Use it at the projector. Get a bomb from the dispenser, blast the safe, recover the archive, and use it at the departure terminal.'},
 {...base,name:'THE FALSE SUMMIT',subtitle:'The stars are light leaking through glass.',accent:'#a2e1ec',worldTop:-650,worldBottom:1000,deathY:900,platforms:[floor(580,210,350),floor(1580,-290,1000),floor(2240,-400,180)],floors:[floor(0,610,440),floor(410,690,170),floor(580,610,2300),floor(580,290,850),floor(1380,370,180),floor(1580,-210,1300)],exit:{x:2720,y:-210,w:160},scene:5,mechanic:'summit',story:['Above the clouds, the same rivets frame every constellation. The sky has a service number.','Through the glass: a deserted pub and three brass figures. They can see the outside. They cannot step through an image.'],hint:'Cut the fan screen. Board Olaf’s raised shield from the lower deck and USE the draft. Baleog shoots the chime on the gallery. Board again in the upper cup and use the second draft. Erik reaches the telescope.'},
 {...base,name:'NO MORE RESETS',subtitle:'A body outside. A promise carried through.',accent:'#91cdbf',platforms:stairs(350),scene:6,mechanic:'transfer',story:['The oldest organ has three control channels. They reach the brass bodies above the pub.','Keeping their reset copies would leave no room for the archive. Erik waits. All three choose to cross.'],hint:'Baleog cuts the maintenance restraint. Erik opens the high transfer interlock. Olaf protects the downward exhaust with his overhead shield at the organ. Each Viking must USE their own transfer terminal. The last crossing reunites them.'},
 {...base,name:'REAL RAIN',subtitle:'There is no next credit.',accent:'#c7d1ae',platforms:stairs(1080),scene:7,mechanic:'rain',story:['A bar stool is a tower. Their bodies are heavy brass. Rain falls without repeating.','The archive is warm under Olaf’s arm. Outside, there is somewhere to go.'],hint:'Baleog cuts the service cord. Erik climbs to open the hatch. Olaf shields the crew from falling leaks. Reach the outside together.'}
];
const near=(h,x,y=566,r=70)=>Math.abs(h.x-x)<r&&Math.abs(h.y-y)<62;
const door=(id,x,toX,lock=null,y=610,toY=610)=>({id,x,y,toX,toY,lock});
export function storyDoors(s){const g=s.machine;switch(s.round){
 case 2:return [door('Bell chamber',760,1140,'bell'),door('Return to bell',1140,760,'bell'),door('Departure chamber',1730,2140,'seal'),door('Return to memory',2140,1730,'seal')];
 case 5:return [door('Return to ground',1200,300,null,290,610),door('Gallery stairwell',300,1200,'chime',610,290),door('Return to gallery',2440,1200,null,-210,290),door('Roof stairwell',1200,2440,'aligned',290,-210)];
 default:return [door('Service passage',350,960),door('Return passage',960,350),door('Maintenance door',2120,2500,'passage'),door('Return to hall',2500,2120,'passage')];
 }}
export function storyObjects(s){const g=s.machine,h=s.heroes[s.active],device=(id,x,y,title,ready,run)=>({id,x,y,title,ready,radius:66,kind:'machine',done:false,reason:'The mechanism is still constrained.',run});
 const objects=storyDoors(s).map(d=>({...d,y:d.y-44,kind:'story-door',title:d.id,radius:52,ready:!d.lock||!!g[d.lock],reason:'This doorway is sealed.',run:()=>{h.x=d.toX;h.y=d.toY-44;h.prevX=h.x;h.prevY=h.y;h.vx=h.vy=0;h.ground=true;h.portalAt=s.time;return 'Through '+d.id+'.';}}));
 if(s.round===1)objects.push(device('dispatch',1250,236,'DISPATCH',s.active===0,()=>{g.dispatch=true;return 'The delivery loop stops returning to its start.';}));
 if(s.round===4)objects.push(device('bombs',1370,566,'BOMB DISPENSER',true,()=>giveItem(h,'bomb')?'Bomb issued.':'Bag full.'));
 if(s.round===5)for(const [i,x,y] of [[0,490,646],[1,1460,326]])objects.push(device('draft'+i,x,y,'DRAFT '+(i+1),s.active===2&&(i?g.chime:g.screen),()=>{g.drafts[i]=true;return 'Draft running.';}));
 if(s.round===5)objects.push(device('telescope',2330,-444,'TELESCOPE',s.active===0,()=>{g.aligned=true;return 'Beyond the glass: three brass bodies.';}));
 if(s.round===6){objects.push(device('interlock',680,236,'TRANSFER INTERLOCK',s.active===0,()=>{g.interlock=true;return 'Three independent channels are available.';}));for(const [i,x] of [[0,1700],[1,2040],[2,2370]])objects.push(device('transfer'+i,x,566,['ERIK','BALEOG','OLAF'][i]+' · CROSS',s.active===i&&g.interlock&&g.restraint&&g.charge>=1,()=>{g.transferred[i]=true;h.transferred=true;return ['Erik','Baleog','Olaf'][i]+' is moving in the world outside.';}));}
 if(s.round===7)objects.push(device('hatch',1440,236,'SERVICE HATCH',s.active===0,()=>{g.hatch=true;return 'Real wind enters the room.';}));
 return objects;
}
export function setupStory(s){s.campaign='story';s.level=storyLevels[s.round];s.crate=false;s.turret=false;Object.assign(s.machine,{passage:false,dispatch:false,cartX:1540,parked:false,delivery:false,drafts:[false,false],transferred:[false,false,false],charge:0,ingredients:[]});s.enemies=[];
 if(![2,5,6].includes(s.round)){s.enemies.push(makeEnemy(1130,610,1060,1250,s.round===4?'crawler':'sentry'));if(s.round!==7)s.enemies.push(makeEnemy(2310,610,2240,2390,'crawler'));}
 if(s.round===2)s.enemies.push(makeEnemy(2320,610,2240,2400,'wraith'));
 const item=(id,type,x,y)=>({id,type,x,y});s.items=[item('story-food','apple',720,566)];if(s.round>=5)giveItem(s.heroes[2],'archive');if(s.round===7)for(const h of s.heroes)h.brass=true;
 if(s.round===0)s.items.push(item('service-key','serviceKey',730,236));if(s.round===4)s.items.push(item('red-lens','red',730,366));
 s.itemAction=(type,h,slot)=>{const g=s.machine;let flag=null;if(s.round===0&&type==='serviceKey'&&near(h,880))flag='staff';if(s.round===3&&type==='ticket'&&near(h,2520))flag='ticket';if(s.round===4&&type==='red'&&near(h,900))flag='gallery';if(s.round===4&&type==='archive'&&near(h,2520))flag='archive';if(!flag)return false;g[flag]=true;g[flag+'At']=s.time;if(flag!=='archive')h.inventory[slot]=null;message(s,'The '+flag+' mechanism accepts the item.');return true;};
}
export function storyWalls(s){const g=s.machine,wall=(x,on,top=0,bottom=610)=>({x,w:28,top,bottom,on});switch(s.round){case 0:return [wall(900,!g.staff),wall(2480,!g.cable)];case 1:return [wall(2480,!g.parked)];case 2:return [wall(900,true),wall(1900,true)];case 3:return [wall(2560,!g.ticket)];case 4:return [wall(1010,!g.gallery),wall(1850,!g.safe),wall(2560,!g.archive)];case 6:return [wall(1100,!g.restraint)];case 7:return [wall(2540,!(g.cord&&g.hatch))];default:return [];}}
export function storyStep(s,input,dt){const g=s.machine,a=s.heroes[s.active],o=s.heroes[2];s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);for(const h of s.heroes)h.swing=Math.max(0,(h.swing||0)-dt);
 const frozen=s.heroes.filter(h=>h.transferred).map(h=>({h,x:h.x,y:h.y}));prepareMotion(s,a.transferred?{}:input,dt);startBash(s,dt);
 const melee=(x,y=566)=>(x-a.x)*a.face>0&&Math.abs(a.x-x)<85&&Math.abs(a.y-y)<62;
 if(input.sword&&a.id===1&&s.cooldown===0&&!a.transferred){a.swing=.24;s.cooldown=.3;for(const e of s.enemies)if(melee(e.x,e.y))hurtEnemy(s,e);if(s.round===0&&melee(1640))g.cable=true;if(s.round===2&&g.mirror&&melee(1670))g.seal=true;if(s.round===3&&melee(1800)){g.ore=true;g.oreCutAt??=s.time;}if(s.round===5&&melee(290))g.screen=true;if(s.round===6&&melee(1040))g.restraint=true;if(s.round===7&&melee(1730))g.cord=true;}
 if(input.action&&a.id===1&&s.cooldown===0&&!a.transferred){a.bow=.28;s.cooldown=.35;s.shots.push({kind:'arrow',x:a.x+a.face*25,y:a.y+20,v:a.face*580});}
 if(a.id===0&&a.bash>0){for(const e of s.enemies)if(melee(e.x,e.y)){e.shotAt=s.time+3;hurtEnemy(s,e);bashImpact(s,e.x,e.y);}if(s.round===2&&melee(550)){g.bell=true;bashImpact(s,550,566);}if(s.round===3&&melee(850)&&s.time>g.lastPump+.7){g.air=Math.min(3,g.air+1);g.lastPump=s.time;bashImpact(s,850,566);}}
 if(input.interact&&!a.transferred){const obj=storyObjects(s).filter(v=>near(a,v.x,v.y,v.radius)).sort((u,v)=>Math.abs(a.x-u.x)-Math.abs(a.x-v.x))[0],item=s.items.filter(i=>!i.locked&&near(a,i.x,i.y,48)).sort((u,v)=>Math.abs(a.x-u.x)-Math.abs(a.x-v.x))[0];if(item&&(!obj||Math.abs(a.x-item.x)<Math.abs(a.x-obj.x)))pickupItem(s);else message(s,obj?(obj.ready?obj.run():obj.reason):'No nearby object.');}
 if(input.item&&!a.transferred)useItem(s);
 const walls=storyWalls(s);integrateMotion(s,[...s.level.floors,...s.level.platforms],walls,dt);
 if(s.round===1&&g.dispatch&&o.shield&&!o.shieldUp&&o.face===1&&o.x<g.cartX&&o.x>g.cartX-82&&o.moveX>0&&o.y>520)g.cartX=Math.min(2380,g.cartX+o.moveX);if(s.round===1&&g.cartX>=2380&&g.delivery)g.parked=true;
 if(s.round===5)for(const h of s.heroes){const draft=g.drafts[0]&&h.x>430&&h.x<580&&h.y+44>210&&h.y+44<715?0:g.drafts[1]&&h.x>1400&&h.x<1580&&h.y+44>-290&&h.y+44<395?1:-1;if(draft>=0){h.y-=165*dt;h.vy=-165;h.ground=false;}}
 if(s.round===6&&o.shieldUp&&Math.abs(o.x-1340)<45&&o.y>520)g.charge=Math.min(1,g.charge+dt*.6);
 for(const f of frozen)Object.assign(f.h,{x:f.x,y:f.y,vx:0,vy:0,moveX:0});
 if(s.round===2&&!g.mirror&&Math.floor((s.time-dt)/1.8)!==Math.floor(s.time/1.8))s.shots.push({kind:'ghost',x:1320,y:586,v:210,source:true});
 if(s.round===3&&g.ore&&s.time-g.oreCutAt>1.33&&g.air>0&&g.heat<3&&Math.floor((s.time-dt)/2.2)!==Math.floor(s.time/2.2)){g.dragonShotAt=s.time;s.shots.push({kind:'fire',x:2220,y:586,v:-280,source:true});}
 if(s.round===6&&Math.floor((s.time-dt)/1.2)!==Math.floor(s.time/1.2))s.shots.push({kind:'drop',x:1340,y:100,v:0,vy:280});
 if(s.round===7)for(const x of [2000,2160,2320])if(Math.floor((s.time-dt)/2.4)!==Math.floor(s.time/2.4))s.shots.push({kind:'drop',x,y:200,v:0,vy:260});
 updateEnemies(s,dt,walls);
 for(const p of s.shots){const px=p.x,py=p.y;p.prevX=px;p.prevY=py;p.x+=p.v*dt;p.y+=(p.vy||0)*dt;
 const solids=[...(p.kind==='ghost'&&!p.reflected?storyDoors(s).map(d=>({x:d.x-72,y:d.y-140,w:144,h:140})):[]),...walls.filter(w=>w.on).map(w=>({x:w.x,y:w.top,w:w.w,h:w.bottom-w.top})),...[...s.level.floors,...s.level.platforms].map(f=>({x:f.x,y:f.y,w:f.w,h:28}))];const solid=solids.map(box=>segmentHit(px,py,p.x,p.y,box)).filter(Boolean).sort((a,b)=>a.t-b.t)[0];
 const shield=shieldHit(o,p,px,py),enemy=p.kind==='arrow'?nearestEnemyHit(s,p,px,py):null;
 const body=p.kind!=='arrow'&&!p.reflected?s.heroes.filter(h=>!h.transferred).map(h=>({h,hit:segmentHit(px,py,p.x,p.y,{x:h.x-16,y:h.y,w:32,h:44})})).filter(v=>v.hit).sort((a,b)=>a.hit.t-b.hit.t)[0]:null;
 if(enemy&&enemy.hit.t<Math.min(solid?.t??Infinity,shield?.t??Infinity)){hurtEnemy(s,enemy.e);p.dead=true;continue;}
 if(body&&body.hit.t<Math.min(solid?.t??Infinity,shield?.t??Infinity)){damage(s,body.h);p.dead=true;continue;}
 if(shield){if(p.source&&!o.shieldUp&&((s.round===2&&o.face===-1)||(s.round===3&&o.face===1))){p.x=shield.x;p.y=shield.y;p.v=-p.v;p.reflected=true;if(s.round===3){p.v=300;p.vy=(490-p.y)*300/(2020-p.x);}}else p.dead=true;}else if(solid)p.dead=true;
 if(s.round===2&&p.reflected&&p.x<=1320){g.mirror=true;p.dead=true;}
 if(s.round===3&&p.reflected&&p.x>=2020){g.heat++;g.air--;p.dead=true;g.lastForgeHit=s.time;if(g.heat>=3&&!g.baked){g.baked=true;s.items.push({id:'departure-ticket',type:'ticket',x:2020,y:566});}}
 if(s.round===1&&p.kind==='arrow'&&segmentHit(px,py,p.x,p.y,{x:1770,y:554,w:40,h:55})){g.delivery=true;p.dead=true;}
 if(s.round===5&&p.kind==='arrow'&&segmentHit(px,py,p.x,p.y,{x:1150,y:225,w:38,h:52})){g.chime=true;p.dead=true;}
 }s.shots=s.shots.filter(p=>!p.dead&&p.x>0&&p.x<s.level.worldWidth&&p.y<s.level.deathY);
 for(const b of s.bombs){b.fuse-=dt;const f=s.level.floors.filter(f=>b.x>=f.x&&b.x<=f.x+f.w&&f.y>b.y).sort((a,b)=>a.y-b.y)[0];if(f)b.y=Math.min(f.y-12,b.y+240*dt);if(b.fuse<=0){b.dead=true;s.blast={x:b.x,y:b.y,time:s.time};if(s.round===4&&Math.hypot(b.x-1850,b.y-580)<110&&!g.safe){g.safe=true;g.safeOpenAt=s.time;s.items.push({id:'portable-archive',type:'archive',x:1910,y:566});}for(const e of s.enemies)if(Math.hypot(e.x-b.x,e.y+22-b.y)<105)hurtEnemy(s,e,2);for(const h of s.heroes)if(Math.hypot(h.x-b.x,h.y+22-b.y)<105&&!shieldHit(o,{x:h.x,y:h.y+22,v:h.x-b.x},b.x,b.y))damage(s,h,3);}}s.bombs=s.bombs.filter(b=>!b.dead);
 for(const i of s.items)if(i.id.startsWith('drop-')){const f=[...s.level.floors,...s.level.platforms].filter(f=>i.x>=f.x&&i.x<=f.x+f.w&&f.y>=i.y+44).sort((a,b)=>a.y-b.y)[0];if(f)i.y=Math.min(f.y-44,i.y+240*dt);}
 s.power=[g.staff&&g.cable,g.parked,g.seal,g.ticket,g.archive,g.aligned,g.transferred.every(Boolean),g.cord&&g.hatch][s.round]||false;g.passage=s.power;
 const e=s.level.exit;s.won=!s.failed&&s.power&&(s.round===6||s.heroes.every(h=>Math.abs(h.x-e.x)<e.w/2&&Math.abs(h.y-(e.y-44))<30));
}
