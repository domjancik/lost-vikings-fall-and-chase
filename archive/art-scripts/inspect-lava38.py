from PIL import Image
im=Image.open('assets/pixel/depth-near-5.png').convert('RGBA')
for y in [120,150,180,240,250,270,280,300,330,385]:
 runs=[];start=None
 for x in range(720):
  r,g,b,a=im.getpixel((x,y));ok=a>128 and r>200 and g>75 and b<70
  if ok and start is None:start=x
  if start is not None and (not ok or x==719):
   if x-start>3:runs.append((start,x-1))
   start=None
 print(y,runs)
