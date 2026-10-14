from pathlib import Path
p=Path('hint-visibility.js')
p.write_text("""import {itemTypes} from './inventory.js?v=ground32';
export function hintPreference(value){return value==='on';}
export function worldLabels(draw,getHints){const labels=(...args)=>{if(getHints())draw(...args);};labels.status=draw;labels.clue=draw;Object.defineProperty(labels,'enabled',{get:getHints});return labels;}
const neutral={flour:'Bag of flour.',spice:'Jar of dragon spice.',dough:'Prepared dough.',ticket:'Bronze ticket.',lamp:'UV lamp.',red:'Red optical lens.',blue:'Blue optical lens.',key:'Neon key.'};
export function itemDescription(type,hints){const item=itemTypes[type];return hints||item.heal||type==='bomb'?item.description:neutral[type]||item.name;}
""",encoding='utf-8')
p=Path('game.js');s=p.read_text(encoding='utf-8-sig');s="import {hintPreference,worldLabels,itemDescription} from './hint-visibility.js?v=ground32';\n"+s
s=s.replace('function hero(g,h,x,y,scale=1)',"let hintsVisible=false;try{hintsVisible=hintPreference(localStorage.getItem('last-call-hints'));}catch{}\nconst worldText=worldLabels(text,()=>hintsVisible);\nfunction hero(g,h,x,y,scale=1)")
s=s.replace('drawWorld(ctx,s,platforms,text,box);if(s.round<6)drawInventoryWorld(ctx,s,text,box);','drawWorld(ctx,s,platforms,worldText,box);if(s.round<6)drawInventoryWorld(ctx,s,worldText,box);')
s=s.replace("document.querySelector('#hint').classList.add('new-clue');","if(hintsVisible)document.querySelector('#clue').classList.add('new-clue');")
s=s.replace("document.querySelector('#hint').classList.remove('new-clue');","document.querySelector('#clue').classList.remove('new-clue');")
s=s.replace("const hintDialog=document.querySelector('#hint-dialog');document.querySelector('#hint').onclick=", "const hintDialog=document.querySelector('#hint-dialog');document.querySelector('#clue').onclick=")
s=s.replace('type?itemTypes[type].description:', 'type?itemDescription(type,hintsVisible):')
s=s.replace("if(k==='v')toggleZoom();", "if(k==='v')toggleZoom();if(k==='h')toggleHints();")
s+= "\nfunction updateHints(){const button=document.querySelector('#hint');button.textContent=hintsVisible?'HINTS ON':'HINTS OFF';button.setAttribute('aria-pressed',String(hintsVisible));button.setAttribute('aria-label',hintsVisible?'Hide puzzle hints':'Show puzzle hints');document.querySelector('#clue').hidden=!hintsVisible;document.body.classList.toggle('hints-hidden',!hintsVisible);canvas.dataset.hints=String(hintsVisible);if(!hintsVisible)document.querySelector('#clue').classList.remove('new-clue');}\nfunction toggleHints(){hintsVisible=!hintsVisible;updateHints();try{localStorage.setItem('last-call-hints',hintsVisible?'on':'off');}catch{}}\ndocument.querySelector('#hint').onclick=toggleHints;updateHints();\n"
p.write_text(s,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8-sig');s=s.replace('<button id="hint" aria-label="Show puzzle hint">HINT <span>?</span></button>','<button id="clue" hidden aria-label="Read puzzle clue">CLUE ?</button><button id="hint" aria-label="Show puzzle hints" aria-pressed="false" title="Toggle puzzle hints · H">HINTS OFF</button>');s=s.replace('<p>Explore the overhead shelves', '<p class="puzzle-help">Explore the overhead shelves').replace('<p><b>Arcade worlds:</b>','<p class="puzzle-help"><b>Arcade worlds:</b>');p.write_text(s,encoding='utf-8')
p=Path('style.css');p.write_text(p.read_text(encoding='utf-8-sig')+'\n/* Optional puzzle guidance stays out of play until requested. */\n.hints-hidden .puzzle-help{display:none}.game-bottom #clue{position:absolute;bottom:50px;left:50%;transform:translateX(-50%);height:32px;font-size:10px;white-space:nowrap}.game-bottom #clue[hidden]{display:none}.game-bottom #hint{font-size:10px;white-space:nowrap}.game-bottom #hint[aria-pressed="true"]{color:#d5ef83;border-color:#8caa58}\n',encoding='utf-8')
for f in ['build.mjs','publish-update.mjs']:
 p=Path(f);s=p.read_text(encoding='utf-8-sig').replace("'game.js','engine.js'","'game.js','hint-visibility.js','engine.js'");p.write_text(s,encoding='utf-8')
# Explicitly preserve instruments and authored inscriptions; all other annotations are optional hints.
p=Path('world-render.js');s=p.read_text(encoding='utf-8-sig');s=s.replace(" const row=s.round", " const status=text.status||text,clue=text.clue||text;\n const row=s.round")
for a in ["text(s.level.name", "text(label,x,y-8", "text(['LOW','MIDDLE','HIGH'][i]", "text('I · BELL CHAMBER'", "text('II · MIRROR CHAMBER'", "text('III · DEPARTURE'", "text(g.mirror?'EYE SILENCED'", "text(g.brake?'·'", "text('UNDERPASS'", "text(s.round?'CORE'", "text('POWER GATE'", "text(s.power?'EXIT · ALL THREE'", "text(s.power&&!s.turret?'EXIT · ALL THREE'", "text(s.grounded?'ARMOR OPEN!'", "text('HIGH SCORE!'", "text(label,near.x", "text(near.kind==='portal'"]:
 s=s.replace(a,a.replace('text(', 'status('))
s=s.replace("text('COMBO: '","clue('COMBO: '")
s=s.replace("if(g.score<3&&i===v.nextLane)halo", "if(text.enabled!==false&&g.score<3&&i===v.nextLane)halo")
s=s.replace('text(o.title,o.x',"(o.id==='angle-dial'?status:text)(o.title,o.x")
p.write_text(s,encoding='utf-8')
p=Path('inventory-render.js');s=p.read_text(encoding='utf-8-sig');s=s.replace('const g=s.machine,c=s.level.accent,t=animationTime(s.time);','const g=s.machine,c=s.level.accent,t=animationTime(s.time),status=text.status||text,clue=text.clue||text;')
s=s.replace("text(i.locked?'SWORD · CONTAINER':'USE · '+itemTypes[i.type].name.toUpperCase()", "status(i.locked?'CONTAINER':itemTypes[i.type].name.toUpperCase()")
for a in ["text(b.fuse", "text('BOOM'", "text('MIX · '", "text('OVEN · '", "text(name+(on", "text(s.power?'EXIT · ALL THREE'"]:
 s=s.replace(a,a.replace('text(', 'status('))
s=s.replace("text('SUNSET ABOVE · OCEAN BELOW'","clue('SUNSET ABOVE · OCEAN BELOW'")
s=s.replace("text((g.lamp?'UV ON':'INSTALL LAMP')", "status((g.lamp?'UV ON':'UV OFF')")
s=s.replace("text(g.baked?'DING! USE TO COLLECT':Math.round(g.cook/3*100)+'% · EXHAUST →'", "status(g.baked?'DING!':Math.round(g.cook/3*100)+'%'")
p.write_text(s,encoding='utf-8')
for f in ['forge-material.js','plunger.js']:
 p=Path(f);s=p.read_text(encoding='utf-8-sig')
 for a in ["text(p.stage==='cut'", "text('ORE LOADED · '", "text('BOING!'"]:
  s=s.replace(a,a.replace('text(', '(text.status||text)('))
 p.write_text(s,encoding='utf-8')
for p in list(Path('.').glob('*.js'))+[Path('index.html')]:
 s=p.read_text(encoding='utf-8-sig');p.write_text(s.replace('ground32','hints33'),encoding='utf-8')
