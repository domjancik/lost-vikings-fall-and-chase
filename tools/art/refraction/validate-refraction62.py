from PIL import Image
from pathlib import Path
import sys
root=Path('assets/refraction62');im=Image.open(sys.argv[1] if len(sys.argv)>1 else root/'machines.png').convert('RGBA')
assert im.size==(256,192)
for n in range(12):
    a=im.crop((n%4*64,n//4*64,n%4*64+64,n//4*64+64))
    assert set(a.getchannel('A').tobytes())<=set([0,255])
    # A handful of neighboring-cell speckles is not a grounded foundation.
    assert sum(a.getpixel((x,63))[3]>0 for x in range(64))>=24, f'cell{n} has detached pixels below true base'
    assert sum(a.getpixel((x,62))[3]>0 for x in range(64))>=24, f'cell{n} has no broad structural contact'
    seen=set();points={(x,y) for y in range(64) for x in range(64) if a.getpixel((x,y))[3]}
    pending=[next(iter(points))]
    while pending:
        p=pending.pop()
        if p in seen:continue
        seen.add(p)
        for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
            other=(p[0]+dx,p[1]+dy)
            if other in points and other not in seen:pending.append(other)
    assert seen==points,f'cell{n} has detached extraction fragments'
print('12 native cells: binary alpha, connected silhouettes, broad registered base.')
