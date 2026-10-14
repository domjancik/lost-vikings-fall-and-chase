"""Actual-pixel contact and retained full-kit regression, not a quality verdict."""
from pathlib import Path
from PIL import Image
import json,numpy as np
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
OUT=ROOT/'assets/olaf111'
im=Image.open(OUT/'olaf-native.png').convert('RGBA')
old=Image.open(ROOT/'assets/vikings90/olaf-native.png').convert('RGBA')
meta=json.loads((OUT/'registration.json').read_text())
assert im.size==old.size==(640,640)
assert set(np.unique(np.array(im)[:,:,3])).issubset({0,255}), 'Opaque alpha fringe'
def crop(sheet,n):return sheet.crop((n%8*80,n//8*80,n%8*80+80,n//8*80+80))
retained=list(range(8))+list(range(26,34))+list(range(14,18))+list(range(52,56))
for n in retained:
 assert crop(im,n).tobytes()==crop(old,n).tobytes(),f'Approved gait/climb changed: {n}'
for r in meta['records']:
 c=crop(im,r['cell']);assert c.getbbox()==tuple(r['registeredBounds'])
 if r['grounded']:
  assert c.getbbox()[3]==70, f"Foot floats/penetrates in cell{r['cell']}"
 if 'reverseOf'in r:
  assert c.tobytes()==crop(im,r['reverseOf']).tobytes(),'Shield lowering differs from raise geometry'
for n in list(range(8,12)):
 b=crop(im,n).getbbox();assert 34<=b[3]-b[1]<=37, f'Idle character scale drift{n}'
for n in list(range(34,38)):
 b=crop(im,n).getbbox();assert 42<=b[3]-b[1]<=46, f'Raised idle scale drift{n}'
for n in list(range(34,38))+[44]:
 c=crop(im,n);a=np.array(c)[:,:,3];top=c.getbbox()[1]
 rows=[]
 for y in range(top,top+8):
  xs=np.flatnonzero(a[y]);
  if len(xs)>=18:rows.append((y,int(xs.min()),int(xs.max()+1)))
 assert rows,f'Raised disc missing{n}'
 middle=(rows[0][0]+rows[-1][0]+1)/2
 assert abs(middle-30)<=1,f'Raised rider plane shifted{n}: {middle}'
 width=max(x[2]-x[1]for x in rows)
 assert 22<=width<=26,f'Raised equipment resized{n}: {width}'
assert len({r['cell']for r in meta['records']})==36
assert len({crop(im,n).tobytes()for n in range(8,12)})>=3,'Breathing collapsed to fixed hold'
print('36 coherent wholeactor cells;24 approved gait/climb cells unchanged; binary alpha/contact/reversal pass')
