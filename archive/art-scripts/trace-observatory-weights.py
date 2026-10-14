from PIL import Image
import numpy as np
p='C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7/exec-f1f0010c-2de2-4f71-9675-2b16eda3b9f4.png'
s=np.array(Image.open(p).convert('RGBA'));out=np.array(Image.open('assets/pixel/story-near.png').convert('RGBA'));h,w=s.shape[:2];rows,cols=out.shape[:2]
ix=(np.arange(w)*cols)//w;iy=(np.arange(h)*rows)//h
fx=(np.arange(w)+.5-ix*(w/cols))/(w/cols);fy=(np.arange(h)+.5-iy*(h/rows))/(h/rows)
wx=1-2*np.abs(fx-.5);wy=1-2*np.abs(fy-.5);weights=wy[:,None]*wx[None,:]+1e-4
print('source',w,h,'output',cols,rows,'weight range',weights.min(),weights.max(),'negative weights',int((weights<0).sum()))
examples=[]
for y in range(350,445):
 for x in range(415,441):
  cell=s[np.ix_(np.flatnonzero(iy==y),np.flatnonzero(ix==x))][:,:,:3].astype(int)
  rgb=out[y,x,:3].astype(int);lo=cell.min(axis=(0,1));hi=cell.max(axis=(0,1));delta=np.maximum(lo-rgb,rgb-hi).max()
  if delta>30:examples.append({'x':x,'y':y,'rgb':rgb.tolist(),'source_min':lo.tolist(),'source_max':hi.tolist(),'delta':int(delta),'weights':weights[np.ix_(np.flatnonzero(iy==y),np.flatnonzero(ix==x))].round(4).tolist()})
print('out-of-source-range column pixels',len(examples));print(examples[:6])
