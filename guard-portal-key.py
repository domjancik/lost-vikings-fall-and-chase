from pathlib import Path
q=Path('game.js');s=q.read_text(encoding='utf-8').replace('const controls=createControls();','const controls=createControls(),continueKeys=new Set();')
s=s.replace("window.addEventListener('keydown',e=>{if(e.key==='F2')", "window.addEventListener('keydown',e=>{if(continueKeys.has(e.code)){e.preventDefault();return;}if(e.key==='F2')")
s=s.replace("if(canContinue(k,e.repeat,completion?performance.now()/1000-completion.start:0))continueRound();", "if(canContinue(k,e.repeat,completion?performance.now()/1000-completion.start:0)){continueKeys.add(e.code);continueRound();}")
s=s.replace("window.addEventListener('keyup',e=>controls.release('keyboard:'+e.code));", "window.addEventListener('keyup',e=>{continueKeys.delete(e.code);controls.release('keyboard:'+e.code);});")
s=s.replace("window.addEventListener('blur',()=>{controls.clear();", "window.addEventListener('blur',()=>{continueKeys.clear();controls.clear();")
q.write_text(s,encoding='utf-8')
q=Path('browser-portal30-space.js');s=q.read_text(encoding='utf-8').replace("await page.keyboard.press('Space');await wait(250);", "await page.keyboard.down('Space');await wait(250);await page.keyboard.down('Space');await wait(250);await page.keyboard.up('Space');")
q.write_text(s,encoding='utf-8')
