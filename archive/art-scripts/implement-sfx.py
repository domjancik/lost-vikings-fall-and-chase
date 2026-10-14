from pathlib import Path
p=Path('audio-events.js');s=p.read_text(encoding='utf-8-sig').replace('const current={heroes,g,','const current={time:s.time,heroes,g,').replace("(p.g.oreCutAt===undefined||s.time-g.oreCutAt<1.1+1/60)","(p.g.oreCutAt===undefined||p.time-g.oreCutAt<1.1)");p.write_text(s,encoding='utf-8')
p=Path('game.js');s=p.read_text(encoding='utf-8-sig');s="import {createSoundEvents} from './audio-events.js?v=hints33';\nimport {createSoundLayer} from './sound-effects.js?v=hints33';\n"+s
s=s.replace('sound=false,ac,','sound=true,')
a=s.index('function tone(');b=s.index('function select(',a);s=s[:a]+s[b:]
s=s.replace('tone(220+i*110);',"audio.play('switch',{pitch:1+i*.15});")
s=s.replace('tone(120);','').replace('tone(660);', '').replace('tone(550);','').replace('tone(770);','').replace('tone(880);','').replace('tone(990);','')
s=s.replace("if((!prev.bash&&s.heroes[0].bash>0)||s.impact?.time!==prev.impact)tone(s.impact?.time!==prev.impact?110:180);",'')
s=s.replace("canvas.focus({preventScroll:true});}}\nfunction loop", "canvas.focus({preventScroll:true});audio.play('arrival');}}\nfunction loop")
s=s.replace('step(s,controls.consume(s.active),SIM_STEP);elapsed',"step(s,controls.consume(s.active),SIM_STEP);playWorldSounds();elapsed")
s=s.replace("s=createState(round);accumulator=0;","s=createState(round);soundEvents(s);accumulator=0;")
s=s.replace("sound=!sound;document.querySelector('#sound span').textContent=sound?'SOUND ON':'SOUND OFF';tone(440);", "sound=!sound;audio.setEnabled(sound);updateSoundButton();try{localStorage.setItem('last-call-sound',sound?'on':'off');}catch{}if(sound)audio.unlock().then(()=>audio.play('click'));")
s=s.replace('function select(i)',"const audio=createSoundLayer(),soundEvents=createSoundEvents();try{sound=localStorage.getItem('last-call-sound')!=='off';}catch{}audio.setEnabled(sound);soundEvents(s);\nfunction updateSoundButton(){const button=document.querySelector('#sound');button.querySelector('span').textContent=sound?'SOUND ON':'SOUND OFF';button.setAttribute('aria-pressed',String(sound));button.setAttribute('aria-label',sound?'Mute sound effects':'Enable sound effects');button.title=sound?'Sound effects on':'Sound effects off';button.classList.toggle('muted',!sound);}\nupdateSoundButton();\nfunction playWorldSounds(){const camera=JSON.parse(canvas.dataset.camera||'{\"x\":0,\"width\":1440}');for(const e of soundEvents(s)){const pan=(e.x-camera.x)/camera.width*2-1;audio.play(e.name,{pan,id:e.id,pitch:e.name==='step'?[1.2,1,.75][e.id]:1,volume:Math.abs(pan)>1?.35:1});}canvas.dataset.audio=JSON.stringify(audio.diagnostics);}\nfor(const event of ['pointerdown','keydown'])document.addEventListener(event,()=>{if(sound)audio.unlock();},{capture:true});\ndocument.addEventListener('click',e=>{if(!sound||!e.target.closest('button')||e.target.closest('#sound'))return;audio.unlock().then(()=>audio.play(e.target.closest('#play,#restart,#retry-death,#next-round')?'start':'click'));});\ndocument.addEventListener('visibilitychange',()=>{audio.setEnabled(sound&&!document.hidden);});\nfunction select(i)")
# UI changes can affect inventory while paused, so observe them when play resumes.
p.write_text(s,encoding='utf-8')
for f in ['build.mjs','publish-update.mjs']:
 p=Path(f);s=p.read_text(encoding='utf-8-sig').replace("'hint-visibility.js','engine.js'","'hint-visibility.js','audio-events.js','sound-effects.js','engine.js'");p.write_text(s,encoding='utf-8')
p=Path('style.css');p.write_text(p.read_text(encoding='utf-8-sig')+'\n#sound.muted{opacity:.55;text-decoration:line-through}\n',encoding='utf-8')
for p in list(Path('.').glob('*.js'))+[Path('index.html')]:
 s=p.read_text(encoding='utf-8-sig');p.write_text(s.replace('hints33','sfx34'),encoding='utf-8')
