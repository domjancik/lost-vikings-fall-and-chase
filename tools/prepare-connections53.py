"""Pack authored connectors; register shared edge ports across animation frames."""
from pathlib import Path
import sys,shutil,json
import numpy as np
from PIL import Image
sys.path.insert(0,str(Path(__file__).parent/'pixel-art-fixer/python'))
from pixelfixer.reconstruct import two_stage_pack
root=Path('assets/connections53');root.mkdir(parents=True,exist_ok=True)
source=Path.home()/'.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7/exec-29d00739-be81-4e4b-938b-a78826f90576.png'
shutil.copyfile(source,root/'source.png');im=Image.open(source).convert('RGBA');cells=[]
for n in range(32):
 x0=round(n%8*im.width/8);x1=round((n%8+1)*im.width/8);y0=round(n//8*im.height/4);y1=round((n//8+1)*im.height/4)
 a=two_stage_pack(np.array(im.crop((x0,y0,x1,y1))),16,16);a[:,:,3]=np.where(a[:,:,3]>=128,255,0);a[a[:,:,3]==0,:3]=0;cells.append(a)
ports=[['W','E'],['N','S'],['W','S'],['N','E'],['W','E','S'],['N','S','W','E'],['W','E'],['W','E']]*2
ports += [['W','E']]*4 + [['N','S']]*4
ports += [['W','E'],['N','S'],['W','S'],['N','E'],['W','E','S'],['N','S','W','E'],['W','E'],['W','E']]
# Use the original straight's actual port pixels, rotated as one authored collar.
# This fixes cell-edge registration, not scene resolution or sprite silhouette.
def collar(material):
 ref=cells[material];strip=ref[:,:2].copy();occupied=np.where(strip[:,:,3]>0)[0]
 shift=8-round((int(occupied.min())+int(occupied.max()))/2)
 out=np.zeros_like(strip)
 for y in range(16):
  if 0<=y+shift<16:out[y+shift]=strip[y]
 assert out[8,:,3].any()
 return out
for n,a in enumerate(cells):
 ref=collar(0 if n<8 else 24 if n>=24 else 8)
 for port in ports[n]:
  if port=='W':a[:,:2]=ref
  elif port=='E':a[:,-2:]=ref[:,::-1]
  elif port=='N':a[:2,:]=np.rot90(ref,-1)
  else:a[-2:,:]=np.rot90(ref,1)
atlas=Image.new('RGBA',(128,64))
for n,a in enumerate(cells):atlas.paste(Image.fromarray(a),(n%8*16,n//8*16))
atlas.save(root/'connections.png')
metadata={'nativeCell':16,'worldCell':32,'ports':ports,'sourceSize':im.size,'alpha':'binary','animation':{'horizontal':[16,17,18,19],'vertical':[20,21,22,23]},'portCenter':8}
(root/'ports.json').write_text(json.dumps(metadata,indent=2)+'\n')
# Every advertised port is opaque at its exact attachment midpoint.
for n,a in enumerate(cells):
 for port in ports[n]:
  y,x={'W':(8,0),'E':(8,15),'N':(0,8),'S':(15,8)}[port];assert a[y,x,3]==255,(n,port)
for group in [[16,17,18,19],[20,21,22,23]]:
 assert len({cells[n].tobytes() for n in group})==4
 for n in group[1:]:
  a,b=cells[group[0]],cells[n]
  if group[0]==16:assert np.array_equal(a[:,:2],b[:,:2]) and np.array_equal(a[:,-2:],b[:,-2:])
  else:assert np.array_equal(a[:2],b[:2]) and np.array_equal(a[-2:],b[-2:])
# Every partial crop still meets its elbow's port mask, for either axis and
# every cable frame; a short final repeat must not introduce a moving gap.
edge=cells[10][:,0,3]>0
for n in range(16,20):
 for width in range(1,16):assert np.any((cells[n][:,width-1,3]>0)&edge),(n,width)
edge=cells[10][-1,:,3]>0
for n in range(20,24):
 for height in range(1,16):assert np.any((cells[n][height-1,:,3]>0)&edge),(n,height)
print('32 authored tiles; registered shared ports; stable animated attachments; binary alpha.')
