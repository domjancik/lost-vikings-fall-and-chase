from PIL import Image
import numpy as np
im=np.array(Image.open('assets/pixel/story-near.png').convert('RGBA'))
for box in [(418,350,440,465),(357,350,376,465)]:
 x0,y0,x1,y1=box;a=im[y0:y1,x0:x1]; holes=np.argwhere(a[:,:,3]==0);print(box,'transparent pixels',len(holes),'examples',[(int(x+x0),int(y+y0)) for y,x in holes[:20]])
