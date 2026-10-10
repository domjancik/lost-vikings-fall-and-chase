from pathlib import Path
p=Path('.')
def write(f,s): (p/f).write_text(s,encoding='utf-8')
def edit(f,a,b):
 q=p/f;s=q.read_text(encoding='utf-8-sig');assert a in s,(f,a);q.write_text(s.replace(a,b),encoding='utf-8')
write('portal-effects.js','''export const TRANSIT_DURATION=1.7;
const clamp=v=>Math.max(0,Math.min(1,v));
export function portalPose(time,width,height){const frame=Math.floor(time*12);return {frame,phase:frame/12,width,height};}
export function transitionPose(elapsed){const progress=clamp(elapsed/TRANSIT_DURATION);return {progress,drawIn:clamp(elapsed/.65),travel:clamp((elapsed-.4)/1),fade:clamp((elapsed-1.3)/.4),done:elapsed>=TRANSIT_DURATION};}
export function canContinue(key,repeat,elapsed){return !repeat&&elapsed>=TRANSIT_DURATION&&['Enter',' '].includes(key);}
// Rasterized through the same low-resolution surface as the world; apertures never resize.
export function drawPortal(ctx,x,y,width,height,time,color='#b5a0ff',active=true){const p=portalPose(time,width,height),t=p.phase;ctx.save();ctx.beginPath();ctx.ellipse(Math.round(x),Math.round(y),width/2,height/2,0,0,Math.PI*2);ctx.clip();ctx.fillStyle=active?'#100c25':'#14121b';ctx.fillRect(x-width/2,y-height/2,width,height);ctx.translate(Math.round(x),Math.round(y));ctx.scale(1,height/width);ctx.lineWidth=2;
 for(let n=0;n<7;n++){const radius=3+((n*5+t*12)%(width/2));ctx.strokeStyle=n%3===0?'#e9dcff':color;ctx.globalAlpha=active?.35+(n%3)*.2:.13;ctx.beginPath();ctx.arc(0,0,radius,t*2+n*.65,t*2+n*.65+Math.PI*1.35);ctx.stroke();}
 ctx.globalAlpha=active?1:.25;ctx.fillStyle='#f9f0ff';for(let n=0;n<9;n++){const a=n*2.4-t*1.7,r=4+((n*7-t*9+1000)%(width/2-3));ctx.fillRect(Math.round(Math.cos(a)*r),Math.round(Math.sin(a)*r),2,2);}ctx.restore();}
export function drawTransit(ctx,width,height,elapsed,origin,heroes,drawHero){const pose=transitionPose(elapsed),t=Math.floor(elapsed*24)/24,cx=width/2,cy=height/2;ctx.clearRect(0,0,width,height);const size=Math.hypot(width,height),expand=1-Math.pow(1-clamp(elapsed/.9),3),x=origin.x+(cx-origin.x)*expand,y=origin.y+(cy-origin.y)*expand,r=18+size*expand;
 ctx.save();ctx.beginPath();ctx.ellipse(Math.round(x),Math.round(y),r*.8,r,0,0,Math.PI*2);ctx.clip();ctx.fillStyle='#130e29';ctx.fillRect(0,0,width,height);
 for(let n=0;n<18;n++){const depth=((n/18+t*.9)%1),radius=4+Math.pow(depth,2)*size;ctx.strokeStyle=['#463678','#8069bd','#b399e1','#e4d1fa'][n%4];ctx.lineWidth=1+depth*5;ctx.beginPath();ctx.ellipse(Math.round(x),Math.round(y),Math.round(radius*.8),Math.round(radius),0,0,Math.PI*2);ctx.stroke();}
 ctx.strokeStyle='#cab1ed';ctx.lineWidth=1;for(let n=0;n<28;n++){const angle=n*Math.PI/14+t*.7,len=20+((n*43+t*260)%size);ctx.beginPath();ctx.moveTo(Math.round(x+Math.cos(angle)*len*.8),Math.round(y+Math.sin(angle)*len));ctx.lineTo(Math.round(x+Math.cos(angle)*(len+20+pose.travel*50)*.8),Math.round(y+Math.sin(angle)*(len+20+pose.travel*50)));ctx.stroke();}
 ctx.restore();
 if(elapsed<.85)for(const [i,h] of heroes.entries()){const delay=i*.06,k=clamp((elapsed-delay)/.7),ease=k*k;drawHero(ctx,h,Math.round(h.screenX+(x-h.screenX)*ease),Math.round(h.screenY+(y-h.screenY)*ease),Math.max(.015,h.scale*(1-ease)));}
 if(elapsed>.95&&elapsed<1.2){ctx.fillStyle='#e8daff';ctx.globalAlpha=.2*Math.sin((elapsed-.95)/.25*Math.PI);ctx.fillRect(0,0,width,height);}if(pose.fade){ctx.fillStyle='#100d1b';ctx.globalAlpha=pose.fade;ctx.fillRect(0,0,width,height);}ctx.globalAlpha=1;return pose;
}
''')
edit('world-render.js',"import {drawInventoryWorld}","import {drawPortal} from './portal-effects.js?v=inventory29';\nimport {drawInventoryWorld}")
edit('world-render.js','drawInventoryWorld(ctx,s,text,box);return;', 'drawInventoryWorld(ctx,s,text,box);drawPortal(ctx,s.level.exit.x,s.level.exit.y-58,48,84,s.time,c,s.power);return;')
edit('world-render.js',"ctx.globalAlpha=1;}\n   else if", "ctx.globalAlpha=1;drawPortal(ctx,o.x,o.y-2,36,62,s.time,c,o.ready);}\n   else if")
edit('world-render.js',"text(s.power?'EXIT · ALL THREE':'EXIT LOCKED',e.x,e.y-134,c,12);", "drawPortal(ctx,e.x,e.y-58,44,78,s.time,c,s.power);text(s.power?'EXIT · ALL THREE':'EXIT LOCKED',e.x,e.y-134,c,12);")
edit('world-render.js',"text(s.power&&!s.turret?'EXIT · ALL THREE'", "drawPortal(ctx,1356,550,50,80,s.time,c,s.power&&!s.turret);text(s.power&&!s.turret?'EXIT · ALL THREE'")
edit('game.js',"import {itemTypes}","import {itemTypes}") if False else None
edit('game.js',"import {itemTypes,", "import {TRANSIT_DURATION,canContinue,drawTransit} from './portal-effects.js?v=inventory29';\nimport {itemTypes,")
edit('game.js','const colors=',"const transit=document.createElement('canvas');transit.id='portal-transit';transit.setAttribute('aria-hidden','true');transit.hidden=true;document.querySelector('.viewport').append(transit);let completion=null;\nconst colors=")
edit('game.js','function reset(){controls.clear();','function reset(){completion=null;transit.hidden=true;document.body.classList.remove(\'portal-travel\');controls.clear();')
edit('game.js',"document.querySelector('#next-round').onclick=()=>{if(round<levels.length-1){round++;reset();}else{round=0;reset();}};", "function continueRound(){if(!s.won||!completion||performance.now()/1000-completion.start<TRANSIT_DURATION)return;round=(round+1)%levels.length;reset();}document.querySelector('#next-round').onclick=continueRound;")
edit('game.js',"const k=e.key.length===1?e.key.toLowerCase():e.key;const action=keyAction(k);", "const k=e.key.length===1?e.key.toLowerCase():e.key;if(s.won){e.preventDefault();if(canContinue(k,e.repeat,completion?performance.now()/1000-completion.start:0))continueRound();else if(k==='r'&&!e.repeat)reset();return;}const action=keyAction(k);")
edit('game.js',"if(s.won){document.querySelector('#win').hidden=false;", "if(s.won){beginPortalTransit(now);document.querySelector('#win').hidden=true;")
edit('game.js','draw();requestAnimationFrame(loop);','draw();updatePortalTransit(now);requestAnimationFrame(loop);')
# freeze original heroes while their copies travel into the vortex
edit('game.js','for(const h of s.heroes){ctx.save();if(h.dead)', 'for(const h of s.heroes){if(s.won&&completion&&!completion.done)continue;ctx.save();if(h.dead)')
# New effect runs on real rendering time, independently of the stopped win simulation.
edit('game.js','function loop(now){', '''function beginPortalTransit(now){if(completion)return;controls.clear();const camera=JSON.parse(canvas.dataset.camera),scale=canvas.clientWidth/camera.width/4,exit=s.round===0?{x:1356,y:550}:{x:s.level.exit.x,y:s.level.exit.y-58};completion={start:now/1000,done:false,origin:{x:(exit.x-camera.x)*scale,y:(exit.y-camera.y)*scale},heroes:s.heroes.map(h=>({...h,screenX:(h.x-camera.x)*scale,screenY:(h.y-camera.y)*scale,scale}))};transit.hidden=false;document.body.classList.add('portal-travel');canvas.dataset.transition='entering';tone(120);}
function updatePortalTransit(now){if(!completion||completion.done)return;const elapsed=now/1000-completion.start;transit.width=Math.ceil(canvas.clientWidth/4);transit.height=Math.ceil(canvas.clientHeight/4);const g=transit.getContext('2d');g.imageSmoothingEnabled=false;const pose=drawTransit(g,transit.width,transit.height,elapsed,completion.origin,completion.heroes,hero);canvas.dataset.transition=pose.done?'complete':pose.travel>.1?'tunnel':'entering';if(pose.done){completion.done=true;transit.hidden=true;document.body.classList.remove('portal-travel');document.querySelector('#win').hidden=false;canvas.focus({preventScroll:true});tone(660);}}
function loop(now){''')
edit('game.js',"completion=null;transit.hidden=true;", "completion=null;canvas.dataset.transition='idle';transit.hidden=true;")
edit('index.html','<button id="again">ONE MORE ROUND ↻</button>', '<small id="continue-keyboard">ENTER / SPACE TO CONTINUE</small><button id="again">ONE MORE ROUND ↻</button>')
q=p/'style.css';q.write_text(q.read_text(encoding='utf-8-sig')+"\n#portal-transit{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;pointer-events:none;z-index:30}#portal-transit[hidden]{display:none}.portal-travel .game-top,.portal-travel .below,.portal-travel .mobile-controls,.portal-travel .game-bottom{opacity:0;pointer-events:none}#continue-keyboard{color:#d6b7eb;font-size:12px;letter-spacing:1px}\n",encoding='utf-8')
for f in ['build.mjs','publish-update.mjs']:edit(f,"'engine.js',","'engine.js','portal-effects.js',")
for q in list(p.glob('*.js'))+[p/'index.html']:
 s=q.read_text(encoding='utf-8-sig');q.write_text(s.replace('inventory29','portal30'),encoding='utf-8')
