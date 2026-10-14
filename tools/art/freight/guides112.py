"""Non-shipping geometry and deliberate pixel-density references."""
from PIL import Image,ImageDraw
from pathlib import Path
out=Path('assets/freight112');out.mkdir(exist_ok=True)
im=Image.new('RGBA',(128,64));d=ImageDraw.Draw(im)
d.ellipse((8,6,56,54),fill='#323d45',outline='#849091',width=3)
d.ellipse((14,12,50,48),fill='#102530',outline='#697d82',width=2)
d.rectangle((8,38,14,58),fill='#384950');d.rectangle((50,38,56,58),fill='#384950')
d.rectangle((5,56,58,59),fill='#586872');d.line((9,16,4,16,4,48,9,48),fill='#956248',width=3)
for x,y in [(14,14),(49,14),(14,47),(49,47)]:d.rectangle((x,y,x+2,y+2),fill='#b88459')
cx,cy=96,30
for points in [[(96,30),(94,17),(102,13),(107,18),(102,26)],[(96,30),(109,28),(113,36),(108,41),(100,36)],[(96,30),(98,43),(90,47),(85,42),(90,34)],[(96,30),(83,32),(79,24),(84,19),(92,24)]]:d.polygon(points,fill='#a57350')
d.ellipse((92,26,100,34),fill='#dba775');im.save(out/'fan-guide-native.png');im.resize((1024,512),Image.Resampling.NEAREST).save(out/'fan-guide8x.png')
im=Image.new('RGBA',(192,64));d=ImageDraw.Draw(im)
for off,hot in [(0,False),(96,True)]:
 d.rectangle((off+18,36,off+80,50),fill='#394951');d.ellipse((off+10,40,off+26,56),fill='#99714e');d.ellipse((off+13,43,off+23,53),fill='#ffba63' if hot else '#102530')
 for x in [30,49,70]:d.rectangle((off+x,33,off+x+4,51),fill='#67757b')
 d.rectangle((off+29,50,off+34,57),fill='#384950');d.rectangle((off+66,50,off+71,57),fill='#384950')
 d.rectangle((off+22,56,off+79,59),fill='#5e6c71');d.line((off+77,36,off+87,36,off+87,58),fill='#926547',width=4)
 d.ellipse((off+73,39,off+83,49),fill='#b79e74',outline='#2c3d46');d.line((off+77,43,off+79,46),fill='#263944',width=2)
im.save(out/'burner-guide-native.png');im.resize((1536,512),Image.Resampling.NEAREST).save(out/'burner-guide8x.png')
im=Image.new('RGBA',(96,64));d=ImageDraw.Draw(im)
for off,hot in [(0,'#102530'),(48,'#ffba63')]:
 d.rectangle((off+12,35,off+38,50),fill='#394951')
 d.ellipse((off+2,40,off+14,55),fill='#a77954');d.ellipse((off+4,43,off+12,53),fill=hot)
 for x in [18,34]:d.rectangle((off+x,32,off+x+4,52),fill='#697d82')
 for x in [16,32]:d.rectangle((off+x,51,off+x+4,58),fill='#394951')
 d.rectangle((off+11,56,off+42,59),fill='#697d82');d.line((off+37,36,off+44,36,off+44,57),fill='#a77954',width=3)
 d.ellipse((off+31,40,off+40,49),fill='#b7a279')
im.save(out/'burner-guide3-native.png');im.resize((768,512),Image.Resampling.NEAREST).save(out/'burner-guide3-8x.png')
