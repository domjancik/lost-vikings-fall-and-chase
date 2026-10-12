"""Measure raw trial atlases; retain original art without pixel-grid processing.

One scale per hero, translation per cell. This is an explicitly requested
experimental skin, not native-source visual approval.
"""
from pathlib import Path
from PIL import Image
import numpy as np
import json
import statistics

sources = [('assets/vikings81/erik-beard-correction-raw.png',4,2,78),
           ('assets/vikings80/baleog-imagegen-raw.png',8,5,82),
           ('assets/vikings81/olaf-imagegen-raw.png',4,2,78)]
heroes=[]
for hero,(path,cols,rows,height) in enumerate(sources):
    image=Image.open(path).convert('RGBA')
    width,fullheight=image.size
    cells=[]
    for frame in range(8):
        x0=round(frame%cols*width/cols); x1=round((frame%cols+1)*width/cols)
        y0=round(frame//cols*fullheight/rows); y1=round((frame//cols+1)*fullheight/rows)
        alpha=np.array(image)[y0:y1,x0:x1,3]>220
        ys=np.flatnonzero(alpha.sum(axis=1)>=max(3,alpha.shape[1]*.012))
        xs=np.flatnonzero(alpha.sum(axis=0)>=max(3,alpha.shape[0]*.012))
        if not len(ys) or not len(xs): raise ValueError(f'Missing hero{hero} frame{frame}')
        cells.append(dict(sx=x0,sy=y0,sw=x1-x0,sh=y1-y0,top=int(ys[0]),sole=int(ys[-1])+1,center=(int(xs[0])+int(xs[-1])+1)/2))
    ratio=height/statistics.median(c['sole']-c['top'] for c in cells)
    # Whole atlas has one scale; grounded feet are translated to the physical
    # floor, while Erik's two generated flight phases retain guide clearance.
    for frame,c in enumerate(cells):
        c['dx']=round(-c.pop('center')*ratio/2)*2
        c['dy']=round((44-c.pop('sole')*ratio-(4 if hero==0 and frame in (3,7) else 0))/2)*2
        c['dw']=c['sw']*ratio;c['dh']=c['sh']*ratio
        c.pop('top')
    heroes.append(dict(path=path,cells=cells))
Path('imagegen81-registration.js').write_text('/* Raw imagegen trial: uniform per-hero scale, translation-only frame registration. */\nexport const imagegen81='+json.dumps(heroes,indent=2)+';\n')
print('Registered24 raw gait cells; no source image modified.')
