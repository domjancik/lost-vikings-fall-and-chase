from pathlib import Path
p=Path('background-effects.js');s=p.read_text(encoding='utf-8');s=s.replace("const rows={fire:0,steam:1,magic:2,lava:3};","const rows={fire:0,steam:1,magic:2,lava:3};\n// Stable row crops keep every frame's source anchored to its wick or pipe.\nconst frameCrops=[[8,2,48,60],[5,2,54,61],[5,1,54,63],[14,0,36,64]];")
s=s.replace('const sw=atlas.naturalWidth/8,sh=atlas.naturalHeight/4;ctx.drawImage(atlas,p.frame*sw,rows[e.kind]*sh,sw,sh,snapPixel(x),snapPixel(y),p.width,p.height);',"const sw=atlas.naturalWidth/8,sh=atlas.naturalHeight/4,c=frameCrops[rows[e.kind]],sx=sw/64,sy=sh/64;ctx.drawImage(atlas,p.frame*sw+c[0]*sx,(rows[e.kind]*64+c[1])*sy,c[2]*sx,c[3]*sy,snapPixel(x),snapPixel(y),p.width,p.height);")
p.write_text(s,encoding='utf-8')
