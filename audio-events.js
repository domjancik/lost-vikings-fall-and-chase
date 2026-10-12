import {mechanismSnapshot,mechanismSounds} from './story-audio.js?v=arc46';
// Observe simulation changes, not held inputs: effects occur once at their real trigger.
export function createSoundEvents(){let previous=null,state=null,lastStep=[0,0,0],lastFuse=0,lastMachine=0,lastAmbient=0;return s=>{
 const heroes=s.heroes.map(h=>({...h,inventory:[...h.inventory]})),g={...s.machine,floatX:s.machine.float?.x,transferMask:s.machine.transferred?.reduce((n,on,i)=>n+(on?1<<i:0),0),draftMask:s.machine.drafts?.reduce((n,on,i)=>n+(on?1<<i:0),0),ingredients:[...(s.machine.ingredients||[])]};
 const current={mechanisms:mechanismSnapshot(s),time:s.time,heroes,g,shots:s.shots.map(p=>({ref:p,kind:p.kind})),bombs:s.bombs.length,blast:s.blast?.time,impact:s.impact?.time,fuse:s.fuse,power:s.power,turret:s.turret,crate:s.crate,failed:s.failed,won:s.won,feedback:s.feedback?.sequence};
 if(state!==s){state=s;previous=current;lastStep=[s.time,s.time,s.time];lastFuse=lastMachine=lastAmbient=s.time;return [];}
 const events=[],add=(name,x=s.heroes[s.active].x,id=s.active)=>events.push({name,x,id}),p=previous;
 for(const h of heroes){const old=p.heroes[h.id];if(h.hp<old.hp)add(h.hp<=0?'death':'hurt',h.x,h.id);if(h.hp>old.hp)add('heal',h.x,h.id);
  if(old.ground&&!h.ground&&h.vy<-100)add('jump',h.x,h.id);if(!old.ground&&h.ground&&old.vy>130)add('land',h.x,h.id);
  if(h.ground&&Math.abs(h.vx)>35&&Math.abs(h.x-old.x)>.01&&s.time-lastStep[h.id]>(h.id===2?.32:.23)){add('step',h.x,h.id);lastStep[h.id]=s.time;}
  if(h.swing>0&&!(old.swing>0))add('sword',h.x,h.id);if(h.bash>0&&!(old.bash>0))add('bash',h.x,h.id);
  if(h.shieldUp!==old.shieldUp)add(h.shieldUp?'shieldRaise':'shieldLower',h.x,h.id);
  if(h.inventory.some((item,i)=>item&&item!==old.inventory[i]))add('pickup',h.x,h.id);
  if(Math.abs(h.x-old.x)>180)add('portal',h.x,h.id);
 }
 for(const shot of current.shots){const old=p.shots.find(x=>x.ref===shot.ref);if(!old)add(shot.kind==='arrow'?'bow':shot.kind==='fire'?'forge':shot.kind==='ghost'?'ambient':'lever',shot.ref.x,1);else if(old.kind!==shot.kind)add('reflect',shot.ref.x,2);}
 for(const old of p.shots){if(!current.shots.some(x=>x.ref===old.ref)&&old.ref.dead){const o=heroes[2];if(Math.abs(old.ref.x-o.x)<65&&Math.abs(old.ref.y-o.y)<65&&!heroes.some(h=>h.hp<p.heroes[h.id].hp))add('shieldHit',o.x,2);else if(old.ref.x>0&&old.ref.x<(s.level.worldWidth??1440)&&old.ref.y<(s.level.deathY??650))add('impact',old.ref.x);}}
 if(current.impact!==p.impact&&current.impact!==undefined)add('impact',s.impact.x);
 if(current.bombs>p.bombs)add('bombPlace');if(current.blast!==p.blast&&current.blast!==undefined)add('explosion',s.blast.x);
 if(s.bombs.length&&s.time-lastFuse>Math.max(.09,Math.min(...s.bombs.map(b=>b.fuse))*.22)){add('fuse',s.bombs[0].x);lastFuse=s.time;}
 if(!p.fuse&&s.fuse)add('pickup',675);if(!p.power&&s.power)add('unlock',s.level.exit?.x||1356);if(p.crate&&!s.crate)add('impact',455);if(p.turret&&!s.turret&&s.round===0)add('explosion',1204);
 if(!p.won&&s.won)add('portal',s.level.exit?.x||1356);if(!p.failed&&s.failed&&!events.some(e=>e.name==='death'))add('death');
 const changes={valveClosed:'lever',drainStarted:'pour',chainCut:'chain',halfLanded:'impact',halfPushed:'chain',joined:'unlock',launchAt:'plunger',dockAt:'impact',exitLatched:'bell',pinBroken:'impact',returnAt:'lift',guideClink:'impact',catchEvent:'impact',steerHit:'impact',pushStarted:'chain',highReached:'bell',tileEvent:'chain',bumperAt:'reflect',catchBroken:'impact',upperSet:'lever',lowerSet:'lever',released:'chain',damperReleased:'lever',selector:'lever',plungerAt:'plunger',charged:'unlock',liftOn:'lever',hatch:'unlock',bell:'bell',mirror:'unlock',seal:'chain',brake:'impact',parked:'unlock',signal:'lever',ore:'chain',heat:'forge',air:'pump',ovenMode:'lever',oven:'oven',baked:'bell',lamp:'lens',lens:'lens',angle:'lever',sunset:'bell',ocean:'bell',motor:'chain',gate:'explosion',safe:'unlock',lane:'lever',screen:'chain',chime:'bell',aligned:'unlock',reed:'chain',resonance:'bell',bass:'chain',draftMask:'lift',dispatch:'lever',delivery:'unlock',gallery:'lens',archive:'pickup',restraint:'chain',interlock:'lever',transferMask:'portal',cord:'chain',cable:'chain',staff:'unlock'};
 for(const [key,name] of Object.entries(changes))if(g[key]!==p.g[key]&&g[key]!==undefined&&(key!=='air'||g[key]>p.g[key]))add(name,{valveClosed:940,drainStarted:1900,ore:940,heat:1000,air:520,ovenMode:1000,baked:1000,lane:480}[key]);
 if(current.feedback!==p.feedback&&/no nearby|bag full|already at full|item kept|wrong|move the vikings/i.test(s.feedback?.message||''))add('wrong');
 if(g.ingredients.length>p.g.ingredients.length)add('mix',620);if(g.lastBankHit?.time!==p.g.lastBankHit?.time&&g.lastBankHit)add(g.lastBankHit.correct?'bell':'wrong',890);
 if(g.oreCutAt!==undefined&&s.time-g.oreCutAt>=1.1&&(p.g.oreCutAt===undefined||p.time-g.oreCutAt<1.1))add('pour',1000);
 mechanismSounds(current.mechanisms,p.mechanisms,add,s.time-lastMachine>.22);
 if(s.time-lastMachine>.22){if(s.level.mechanic==='water'){if(Math.abs((g.floatX??0)-(p.g.floatX??0))>.01)add('pump',g.floatX,2);if(g.wound!==p.g.wound)add('chain',1660,1);}if(s.campaign==='cycle'&&g.carrier?.v>0)add('lift',g.carrier.x);if(g.liftOn&&Math.abs(g.liftY-p.g.liftY)>.01)add('lift',590);if(Math.abs(g.cartX-p.g.cartX)>.01)add('cart',g.cartX);lastMachine=s.time;}
 if(s.time-lastAmbient>2.4){add('ambient',s.round===5?1250:s.round===7?870:720);lastAmbient=s.time;}
 if(s.combat?.time!==p.combat&&s.combat)add('impact',s.combat.x);current.combat=s.combat?.time;previous=current;return events.filter((e,i)=>events.findIndex(x=>x.name===e.name&&x.id===e.id)===i);
 };}
