from pathlib import Path
p=Path('background-depth.js');s=p.read_text(encoding='utf-8-sig');a=s.index('restoreFoliage:');b=s.index('restore:',a);s=s[:a]+s[b:];s=s.replace("restore:[rect(130,182,45,42),rect(146,51,30,65)]", "restore:[rect(130,182,45,42),rect(146,51,30,65),[[224,75],[232,75],[220,140],[214,200],[212,224],[205,224],[209,180],[215,130]],[[259,125],[265,125],[249,180],[240,224],[233,224],[244,177]],[[310,115],[317,115],[302,190],[301,224],[293,224],[300,160]],[[601,120],[607,120],[615,224],[607,224]]]")
p.write_text(s,encoding='utf-8')
p=Path('parallax-render.js');s=p.read_text(encoding='utf-8-sig');a=s.index(' for(const points of [...(scene.restoreFoliage');b=s.index(' ctx.putImageData',a);s=s[:a]+s[b:];p.write_text(s,encoding='utf-8')
