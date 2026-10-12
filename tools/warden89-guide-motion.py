from pathlib import Path
root=Path(__file__).resolve().parents[1]
# Reuse the exact guide renderer; this diagnostic animation is not production art.
s=(root/'tools/warden89-guide-board.py').read_text()
start=s.index(" im=Image.new");end=s.index(" board.alpha_composite")
body=s[start:end].replace(' if row==2:',' if g.get(\'brace\'):')
program=s[:s.index("board=Image.new")]+'def render(g):\n'+body+' return im\n'
scope={'__file__':str(root/'tools/warden89-guide-board.py')};exec(program,scope)
import json
poses=json.loads((root/'output/warden89/guide-motion.json').read_text())
frames=[scope['render'](g).convert('RGB') for g in poses]
frames[0].save(root/'output/warden89/guide-motion.gif',save_all=True,append_images=frames[1:],duration=100,loop=0)
contact=scope['Image'].new('RGB',(640*3,320*4))
for i,k in enumerate([0,12,18,23,29,34,39,43,55,70,76,90]):contact.paste(frames[k],(i%3*640,i//3*320))
contact.save(root/'output/warden89/guide-motion-contact.png')
