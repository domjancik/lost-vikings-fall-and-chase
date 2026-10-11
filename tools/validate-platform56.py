from pathlib import Path
import numpy as np
from PIL import Image
im=Image.open(Path('assets/platform56/ladder.png'))
assert im.size==(24,13)
a=np.array(im)
assert set(np.unique(a[:,:,3]))=={0,255}
assert not a[a[:,:,3]==0,:3].any()
assert np.array_equal(a[0,:,3],a[-1,:,3]),'Rail contact seam mismatch'
assert np.abs(a[0,:,:3].astype(int)-a[-1,:,:3].astype(int)).max()<=4,'Visible color seam'
rail=np.all(a[:,:,3]>0,axis=0)
assert rail[:4].any() and rail[-4:].any(),'Both rails must run continuously'
assert np.count_nonzero(a[:,:,3],axis=1).max()==24,'Rung must join both rails'
print('24x13 native ladder: binary alpha, continuous rails, joined rung, matching alpha seam, color delta<=4.')
