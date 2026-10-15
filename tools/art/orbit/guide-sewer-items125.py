from PIL import Image,ImageDraw
from pathlib import Path
p=Path('assets/sewer125');im=Image.new('RGBA',(96,32));d=ImageDraw.Draw(im)
# Guide geometry: explicit 20px lamp, 15px can,13px lens. Not final art.
B='#b98636';D='#3b2b20';L='#f2d187';G='#8da5ad';N='#18212a'
d.rectangle((12,10,19,11),fill=B);d.rectangle((10,12,21,13),fill=B);d.rectangle((10,15,21,25),fill=D);d.rectangle((12,16,19,23),fill=G);d.rectangle((15,21,16,24),fill=N);d.rectangle((10,26,21,28),fill=B);d.rectangle((12,29,19,29),fill=D);d.line((12,10,12,7,19,7,19,10),fill=B,width=1);d.rectangle((13,12,14,13),fill=N);d.rectangle((17,12,18,13),fill=N)
d.rectangle((43,20,53,28),fill=B);d.rectangle((45,29,51,29),fill=D);d.rectangle((46,17,50,19),fill=B);d.line((43,22,38,17,39,15,46,20),fill=B,width=2);d.line((53,20,57,20,57,26,53,26),fill=B,width=1);d.rectangle((45,21,47,26),fill=L)
d.ellipse((74,17,86,29),fill=B);d.ellipse((76,19,84,27),fill=G);d.line((77,22,80,19),fill=L,width=1)
im.save(p/'items-guide-native.png');im.resize((1536,512),Image.Resampling.NEAREST).save(p/'items-guide-16x.png')
