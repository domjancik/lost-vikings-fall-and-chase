from PIL import Image
import numpy as np
for n in range(8):
 a=np.array(Image.open(f'assets/scale67/middle-{n}.png').convert('RGBA'))
 assert a.shape==((192,288,4) if n==7 else (128,192,4))
 assert set(np.unique(a[:,:,3]))=={0,255}
 assert not a[a[:,:,3]==0,:3].any()
 if n==5:assert (a[0,:,3]>0).sum()>=a.shape[1]*.7
 else:
  rows=np.flatnonzero((a[:,:,3]>0).sum(axis=1)>=a.shape[1]*.7)
  offset=(a.shape[0]-rows[-1]-1)*2
  assert offset==(4 if n==0 else 0),(n,'foundation changed',offset)
assert Image.open('assets/scale67/pub-far.png').size==(192,128)
print('8 original-sized native middle planes: binary alpha, clean transparent RGB, unchanged foundations; native192x128 pub far.')
