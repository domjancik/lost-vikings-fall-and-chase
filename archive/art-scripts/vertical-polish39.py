from pathlib import Path
p=Path('audio-events.js');s=p.read_text(encoding='utf-8-sig').replace('g={...s.machine,ingredients:','g={...s.machine,draftMask:s.machine.drafts?.reduce((n,on,i)=>n+(on?1<<i:0),0),ingredients:');s=s.replace("lane:'lever'}","lane:'lever',screen:'chain',chime:'bell',aligned:'unlock',reed:'chain',resonance:'bell',bass:'chain',draftMask:'lift'}");p.write_text(s,encoding='utf-8')
p=Path('background-depth.js');s=p.read_text(encoding='utf-8-sig').replace('Math.round(-camera.y*.08/2)*2','Math.round((-camera.y*.08-(round>=9?80:0))/2)*2');p.write_text(s,encoding='utf-8')
