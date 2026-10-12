import {cycleObjects} from './cycle-campaign.js?v=clockwork69';
import {storyObjects} from './story-campaign.js?v=support57';
import {verticalObjects} from './vertical-campaign.js?v=support57';
import {inventoryObjects} from './inventory-campaign.js?v=support57';
export function interactionObjects(s){
 if(s.campaign==='cycle')return cycleObjects(s);if(s.campaign==='story')return storyObjects(s);if(s.round>=9)return verticalObjects(s);if(s.round>=6)return inventoryObjects(s);
 const common={kind:'lever',radius:76};
 if(s.round===0)return [{...common,id:'panel',x:610,y:566,title:'FUSE PANEL',done:s.power,ready:s.fuse,reason:'Find the spare fuse on the highest shelf first.',run:()=>{s.power=true;return 'Circuit restored. Olaf grounds the rogue arcade with his front shield; Baleog shoots from behind.';}}];
 const g=s.machine,m=s.level.mechanic,h=s.heroes[s.active];
 const door=(id,x,dest,ready,title,reason)=>({kind:'portal',radius:52,id,x,y:x>990?346:x>480?456:566,title,done:false,ready,reason,run:()=>{h.x=dest;h.y=dest>990?346:dest>480?456:566;h.prevX=dest;h.prevY=h.y;h.vx=0;h.vy=0;h.ground=true;return 'Through '+title+'. '+(dest<480?'Back in the bell chamber.':dest<960?'In the mirror chamber.':'In the departure chamber.');}});
 if(m==='cargo')return [{...common,id:'cargo-console',x:470,y:336,title:'ELEVATOR START',done:g.liftOn,ready:g.charged&&s.active===0,reason:!g.charged?'Olaf must catch reactor sparks with shield ↑ in the falling spark stream until the meter is full.':'Erik must operate the balcony console.',run:()=>{g.liftOn=true;return 'Cargo lift running. It stops at each deck; walk aboard and ride up.';}}];
 if(m==='bankshot')return [{...common,kind:'dial',id:'angle-dial',x:560,y:356,title:'ANGLE: '+['LOW','MIDDLE','HIGH'][g.lane],done:false,ready:s.active===0,reason:'Erik operates the upper angle dial. Baleog shoots at Olaf’s LEFT-facing front shield.',run:()=>{g.lane=(g.lane+1)%3;return 'Bank angle: '+['LOW','MIDDLE','HIGH'][g.lane]+'. Required combo: MIDDLE → LOW → HIGH.';}}];
 if(m==='portals')return [
  door('door-a',340,630,g.bell,'DOOR A','Erik must run-bash the stone bell first: build speed, then BASH / X.'),
  door('return-a',580,340,g.bell,'RETURN A','Ring the stone bell first.'),
  door('door-b',850,1120,g.seal,'DOOR B',!g.mirror?'Olaf must face LEFT with his front shield in the ghost’s path to reflect the ghost.':'Baleog must cut the cursed vines with SWORD / Z.'),
  door('return-b',1120,850,g.seal,'RETURN B','The cursed doorway is still sealed.')
 ];
 if(m==='tow')return [{...common,id:'garage-info',x:1030,y:566,title:'KART GARAGE',done:g.parked,ready:false,reason:'Olaf pushes the kart by facing RIGHT with his front shield raised and walking against its left side.',run:()=>''}];
 return [{...common,id:'forge-info',x:1000,y:566,title:'CRUCIBLE '+g.heat+'/3',done:s.power,ready:false,reason:!g.ore?'Baleog cuts the hanging ore chain with SWORD / Z.':g.air===0?'Erik must run-bash the bellows to add pressure.':'Olaf faces RIGHT with his front shield in the dragon’s firing lane to redirect dragon fire into the crucible.',run:()=>''}];
}
export function nearbyInteraction(s){const h=s.heroes[s.active];return interactionObjects(s).filter(o=>Math.abs(h.x-o.x)<=o.radius&&Math.abs(h.y-o.y)<66).sort((a,b)=>Math.abs(h.x-a.x)-Math.abs(h.x-b.x))[0]||null;}
export function useInteraction(s){const o=nearbyInteraction(s);let message;if(!o)message='No interactive object nearby. Follow the current mission, or move beside a marked USE object.';else if(o.done)message='This machine is already active.';else if(!o.ready)message=o.reason;else message=o.run();s.feedback={sequence:(s.feedback?.sequence||0)+1,message,id:o?.id||'none'};}
export function objective(s){if(s.campaign==='cycle')return s.level.hint;
 if(s.failed)return s.failure;if(s.campaign==='story')return s.won?'All three crossed.':s.power?'Bring everyone to the departure.':s.level.hint;if(s.won)return 'Round complete. Everyone made it.';if(s.round>=6)return s.power?'Bring all three to the exit.':s.level.hint;
 if(s.round===0)return !s.fuse?'Erik: find the spare fuse on the highest shelf.':!s.power?'Use the fuse panel beside the striped gate.':s.turret?'Olaf: front shield RIGHT in the arcade firing lane. Baleog: shoot the rogue arcade from behind.':'Bring all three Vikings to the powered exit.';
 const g=s.machine,m=s.level.mechanic;
 if(m==='cargo')return !g.charged?'Olaf: shield ↑ under CHARGE ('+Math.floor(g.charge/3*100)+'%).':!g.liftOn?'Erik: climb to ELEVATOR START and USE the console.':!g.hatch?'Ride the elevator. Baleog shoots the upper hatch lock.':'Bring everyone to the UPPER-DECK EXIT. The lift keeps cycling.';
 if(m==='bankshot')return s.power?'JACKPOT! Bring everyone back to the LEFT portal.':'Bank-shot combo '+g.score+'/3: next '+['MIDDLE','LOW','HIGH'][[1,0,2][g.score]]+'. Erik sets angle; Olaf shield LEFT; Baleog shoots.';
 if(m==='portals')return !g.bell?'Erik: run-bash the stone bell. USE door A to travel through the wall.':!g.mirror?'Olaf: front shield facing LEFT in the ghost’s path inside chamber B.':!g.seal?'Baleog: cut the cursed vines. Door B will open.':'USE the haunted doors to bring everyone into the far-right chamber.';
 if(m==='tow')return !g.brake?'Erik: build running speed and BASH the speed-trap drum.':!g.signal?'Baleog: shoot the red traffic lamp. Olaf can push the kart meanwhile.':!g.parked?'Olaf: front shield RIGHT; walk into the kart and push it to GARAGE.':'Rescue complete. Bring everyone past the green traffic gate.';
 return !g.ore?'Baleog: cut the hanging ore chain beside the crucible.':g.heat>=3?'Key forged. Bring everyone to the CENTRAL FORGE PORTAL.':g.air===0?'First position Olaf shield RIGHT near the crucible; keep crew to his left. Erik: run-bash bellows. Pressure '+g.air+'/3; forge '+g.heat+'/3.':'Olaf: front shield RIGHT in the dragon’s firing lane. Pressure '+g.air+'/3; forge '+g.heat+'/3.';
}

export function debugState(s){if(s.campaign==='cycle')return {...s.machine,completed:s.won};if(s.campaign==='story')return {...s.machine,enemies:s.enemies,inventory:s.heroes.map(h=>h.inventory)};if(s.round>=6)return {...s.machine,items:s.items,inventory:s.heroes.map(h=>h.inventory),health:s.heroes.map(h=>h.hp)};if(!s.round)return {fuseFound:s.fuse,power:s.power,arcadeAlive:s.turret,completed:s.won};const keys={cargo:['charge','charged','liftOn','liftY','hatch'],bankshot:['lane','score'],portals:['bell','mirror','seal'],tow:['brake','cartX','parked','signal'],forge:['ore','air','heat']}[s.level.mechanic];return {...Object.fromEntries(keys.map(k=>[k,s.machine[k]])),portalOpen:s.power,completed:s.won};}
