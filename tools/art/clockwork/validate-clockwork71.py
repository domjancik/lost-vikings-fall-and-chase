from PIL import Image
import numpy as np
a=np.array(Image.open('assets/clockwork71/tower.png').convert('RGBA'));assert a.shape==(192,128,4)
assert set(np.unique(a[:,:,3]))=={0,255};assert not a[a[:,:,3]==0,:3].any()
for n in range(4):
 c=a[n//2*96:n//2*96+96,n%2*64:n%2*64+64];y,x=np.where(c[:,:,3]>0)
 assert y.max()==94 and y.min()>0 and x.min()>0 and x.max()<63,(n,'bounds')
 assert np.count_nonzero(c[94,:,3])>=36,(n,'broad footing')
 assert c[84,32,3]==255,(n,'winding shaft terminal misses metal')
catch=np.array(Image.open('assets/clockwork69/catch.png').convert('RGBA'))
assert catch[67,118,3]>=220,'fixed catch input terminal misses its authored housing'
print('4 native tower poses verified: binary alpha, unclipped art, stable broad footing94 and opaque winding/catch terminals.')
