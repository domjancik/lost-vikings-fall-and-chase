from pathlib import Path
p=Path('parallax-render.js');s=p.read_text(encoding='utf-8').replace('ctx.globalAlpha=i===1?.42:.2','ctx.globalAlpha=1');p.write_text(s,encoding='utf-8')
p=Path('movement.js');s=p.read_text(encoding='utf-8');s="import {SHIELD} from './hero-geometry.js?v=hud25';\n"+s
s=s.replace('h.turn=!!dir&&before*dir<0;if(dir)h.face=dir;', 'h.turn=!!dir&&before*dir<0;if(dir)h.face=dir;\n  h.bashBuffer=Math.max(0,(h.bashBuffer||0)-dt);if(active&&h.id===0&&input.action)h.bashBuffer=.18;\n  if(h.bash>.12){h.face=h.bashFace||h.face;h.vx=h.face*320;}')
s=s.replace('h.x+=o.x-ox;h.y+=o.y-oy;', 'h.x+=o.x-ox;h.y=o.y+SHIELD.upTop-44;')
s=s.replace('{x:o.x-32,y:o.y-8,w:64,support:2}', '{x:o.x-SHIELD.upWidth/2,y:o.y+SHIELD.upTop,w:SHIELD.upWidth,support:2}')
p.write_text(s,encoding='utf-8')
p=Path('projectile-collision.js');s=p.read_text(encoding='utf-8');s="import {SHIELD} from './hero-geometry.js?v=hud25';\n"+s
s=s.replace('{x:-40,y:-12,w:80,h:6}','{x:-SHIELD.upWidth/2,y:SHIELD.upTop-2,w:SHIELD.upWidth,h:SHIELD.width+4}')
p.write_text(s,encoding='utf-8')
for name in ['engine.js','campaign.js']:
 p=Path(name);s=p.read_text(encoding='utf-8');s="import {startBash,bashImpact} from './bash.js?v=hud25';\n"+s
 s=s.replace('if(input.action&&a.id===0&&a.ground&&Math.abs(a.vx)>=170&&s.cooldown===0){a.bash=.2;s.cooldown=.4;}', 'startBash(s,dt);')
 if name=='engine.js':s=s.replace('s.crate=false;\n if(input.sword', '{s.crate=false;bashImpact(s,455,566);}\n if(input.sword')
 else:
  s=s.replace("{g.bell=true;feedback", "{g.bell=true;bashImpact(s,290,566);feedback").replace("{g.brake=true;feedback", "{g.brake=true;bashImpact(s,320,566);feedback").replace("{g.air=Math.min(3,g.air+1);", "{bashImpact(s,520,566);g.air=Math.min(3,g.air+1);")
 p.write_text(s,encoding='utf-8')
p=Path('sprite-render.js');s=p.read_text(encoding='utf-8');s="import {shieldTransform} from './hero-geometry.js?v=hud25';\n"+s
s=s.replace("let pose='idle',frame=Math.floor((h.animTime||0)*3)%4;", "let pose='idle',frame=Math.floor((h.animTime||0)*[2.7,2.2,2.4][h.id]+[0,1.4,2.8][h.id])%4;")
s=s.replace("frame=Math.floor((h.animTime||0)*18)%3", "frame=clamp(Math.floor((.36-h.bash)/.36*6),0,5)")
s=s.replace('canvas.height=88','canvas.height=136').replace('g.translate(46,23)','g.translate(46,58)')
s=s.replace("const leg=running?runLegs[frame]", "const leg=pose==='bash'?runLegs[(frame*2)%8]:running?runLegs[frame]")
s=s.replace("const crouch=pose==='land'?[4,2,0][frame]:0", "const crouch=pose==='bash'?[2,4,7,6,3,0][frame]:pose==='land'?[4,2,0][frame]:0")
s=s.replace("const lean=pose==='bash'?7", "const lean=pose==='bash'?[-3,3,14,16,9,3][frame]")
s=s.replace('// Tunic silhouette, seams, mail and shoulder pads.', "if(pose==='bash'&&frame>=1&&frame<=4)poly('#a34329',[[-12,18],[-44,12],[-36,20],[-46,25],[-12,30]]);\n // Tunic silhouette, seams, mail and shoulder pads.")
a=s.index('  const raised=h.shieldUp');b=s.index('\n }\n g.restore()',a)
s=s[:a]+'''  const shield=shieldTransform(h,pose,frame),cos=Math.cos(shield.angle),sin=Math.sin(shield.angle);
  // Inverse-sample a single fixed-size shield onto the integer sprite grid.
  // Rotation changes orientation, never its physical dimensions or material.
  for(let yy=-36;yy<=36;yy+=2)for(let xx=-36;xx<=36;xx+=2){
   const u=Math.round(cos*xx+sin*yy+shield.width/2),v=Math.round(-sin*xx+cos*yy+shield.height/2);
   if(u<0||u>=shield.width||v<0||v>=shield.height)continue;
   let color=u<2||u>=26||v<2||v>=46?outline:u<5||v<5?'#efce79':u>23?'#79522c':'#b88a45';
   if(u>=11&&u<=16&&v>=3&&v<45)color=u<13?'#f4eccb':'#9eafa0';
   if(Math.abs(u-14)<5&&Math.abs(v-24)<5)color='#d7dfca';
   if(Math.abs(u-14)<3&&Math.abs(v-24)<3)color='#728d88';
   if((u===6||u===22)&&(v===8||v===40))color='#fff1c4';
   rect(color,shield.x+xx,shield.y+yy,2,2);
  }''' +s[b:]
s=s.replace('g.drawImage(sprite,-46,-23)','g.drawImage(sprite,-46,-58)')
p.write_text(s,encoding='utf-8')
p=Path('game.js');s=p.read_text(encoding='utf-8');s="import {drawBashEffects} from './bash.js?v=hud25';\n"+s
s=s.replace("if(paused&&started&&!s.won){", "drawBashEffects(ctx,s,box,text);\n if(paused&&started&&!s.won){")
s=s.replace('feedback:s.feedback?.sequence||0};', 'feedback:s.feedback?.sequence||0,bash:s.heroes[0].bash||0,impact:s.impact?.time};')
s=s.replace('renderAlpha=accumulator/SIM_STEP;', "renderAlpha=accumulator/SIM_STEP;if((!prev.bash&&s.heroes[0].bash>0)||s.impact?.time!==prev.impact)tone(s.impact?.time!==prev.impact?110:180);")
p.write_text(s,encoding='utf-8')
p=Path('movement.test.js');s=p.read_text(encoding='utf-8').replace('e.y,o.y-52','e.y,o.y-80');p.write_text(s,encoding='utf-8')
for name in ['build.mjs','publish-update.mjs']:
 p=Path(name);s=p.read_text(encoding='utf-8').replace("'engine.js',", "'engine.js','hero-geometry.js','bash.js',");p.write_text(s,encoding='utf-8')
for p in Path('.').glob('*'):
 if p.suffix in ['.js','.html','.css']:
  s=p.read_text(encoding='utf-8-sig').replace('hud25','feel26');p.write_text(s,encoding='utf-8')
