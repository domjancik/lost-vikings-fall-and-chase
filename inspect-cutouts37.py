from PIL import Image,ImageDraw
out=Image.new('RGB',(1440,960),'#12171c')
for i in range(9):
 im=Image.open(f'output/playwright/cutouts37-overview-{i}.png');im.thumbnail((480,300));x=(i%3)*480;y=(i//3)*320;out.paste(im,(x,y+20));ImageDraw.Draw(out).text((x+8,y+3),f'Level {i+1}',fill='white')
out.save('output/playwright/cutouts37-contact.png')
