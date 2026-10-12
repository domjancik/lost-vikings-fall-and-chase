from pathlib import Path
from PIL import Image
import numpy as np
r=Path('assets/vikings70')
for name,cols,idle,climb in [('erik',4,[8],range(12,16)),('baleog',4,[8],range(12,16)),('olaf',8,[16,24],range(20,24))]:
    a=np.array(Image.open(r/(name+'.png')))
    cells=[a[n//cols*64:n//cols*64+64,n%cols*64:n%cols*64+64] for n in range(cols*4)]
    assert set(np.unique(a[:,:,3]))=={0,255}
    for n,c in enumerate(cells):
        y,x=np.where(c[:,:,3]>0)
        assert x.min()>0 and x.max()<63 and y.min()>0 and y.max()<63,(name,n,'clipped',y.max())
        if n not in climb and not(name=='olaf' and n>=28):assert y.max()==62,(name,n,'sole')
    for start in idle:
        for n in range(start+1,start+4):
            assert np.array_equal(cells[start][:,:,3],cells[n][:,:,3]),(name,'idle silhouette drift')
            assert np.array_equal(cells[start][:40],cells[n][:40]),(name,'idle head drift')
            assert np.array_equal(cells[start][48:],cells[n][48:]),(name,'idle feet drift')
    if name=='olaf':
        for start in [0,8]:
            for n in range(start+1,start+8):assert np.array_equal(cells[start][:48],cells[n][:48]),('held grip moved',n)
        for n in range(28,32):
            c=cells[n];skin=(c[:,:,3]>0)&(c[:,:,0]>150)&(c[:,:,1]>80)&(c[:,:,1]<200)&(c[:,:,2]<170)
            assert np.where(skin)[0].min()==26,('floating palm root drift',n)
    if name=='erik':
        tops=[np.where(c[:,:,3]>0)[0].min() for c in cells[:4]]
        assert max(tops)-min(tops)<=1,('Erik walking head excursion',tops)
print('Native binary alpha, unclipped poses, grounded soles, stable idle silhouette/head/feet and fixed Olaf walking grips.')
