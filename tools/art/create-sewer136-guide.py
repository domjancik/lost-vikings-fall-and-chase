from pathlib import Path
from PIL import Image, ImageDraw
import math

root=Path('assets/sewer136'); root.mkdir(exist_ok=True)
sheet=Image.new('RGBA',(256,256))
roots=[(25,24),(32,25),(39,24),(25,29),(32,31),(39,29)]
feet=[(13,44),(31,44),(51,44),(10,44),(28,44),(48,44)]
for frame in range(16):
    tile=Image.new('RGBA',(64,64)); d=ImageDraw.Draw(tile)
    extension=min(1,frame/7) if frame<8 else 1
    extension=extension*extension*(3-2*extension)
    def leg(n):
        rx,ry=roots[n]; tx,ty=feet[n]
        if frame>=8:
            phase=(frame-8)/8*math.tau+(math.pi if n in (1,3,5) else 0)
            tx+=round(math.cos(phase)*4);ty-=round(max(0,math.sin(phase))*5)
        fx=round(rx+(tx-rx)*extension);fy=round(32+(ty-32)*extension)
        knee=(round(rx+(fx-rx)*.58+(3 if n%3==2 else -3)),round(30+6*extension))
        color='#66543b' if n<3 else '#a28a5c'
        d.line([(rx,ry),knee,(fx,fy)],fill=color,width=2)
        d.rectangle((knee[0]-1,knee[1]-1,knee[0]+1,knee[1]+1),fill='#cbb478')
        d.line([(fx-1,fy-1),(fx+1,fy-1)],fill='#e0c387',width=1)
    for n in range(3):leg(n)
    d.ellipse((22,12,41,31),fill='#292f2e',outline='#c7bd89',width=1)
    d.arc((23,13,40,30),195,285,fill='#8d9b89',width=1)
    d.rectangle((26,31,38,33),fill='#61553b')
    d.line([(27,25),(30,27),(31,24)],fill='#bd9c5b',width=1)
    d.line([(37,25),(35,27),(34,24)],fill='#bd9c5b',width=1)
    d.rectangle((31,25,34,27),fill='#e5ddba')
    for n in range(3,6):leg(n)
    sheet.alpha_composite(tile,((frame%4)*64,(frame//4)*64))
sheet.save(root/'globe-guide-native.png')
sheet.resize((1024,1024),Image.Resampling.NEAREST).save(root/'globe-guide.png')
