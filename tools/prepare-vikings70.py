from pathlib import Path
from PIL import Image
import numpy as np,json
from scipy import ndimage
r=Path('assets/vikings70');records={}
for name,height,cols,rows,idle in [('erik',36,4,4,8),('baleog',38,4,4,8),('olaf',36,8,4,16)]:
    source=name+'-walk-source.png' if name=='olaf' else name+'-source.png'
    src=Image.open(r/source).convert('RGBA');grip=Image.open(r/'olaf-grip-source.png').convert('RGBA') if name=='olaf' else None;rear=Image.open(r/'olaf-source.png').convert('RGBA') if name=='olaf' else None;cells=[];bounds=[]
    for n in range(cols*rows):
        sheet=rear if rear and 20<=n<=23 else grip if grip and (n in range(16,20) or n>=24) else src
        a=np.array(sheet.crop((round(n%cols*sheet.width/cols),round(n//cols*sheet.height/rows),round((n%cols+1)*sheet.width/cols),round((n//cols+1)*sheet.height/rows))))
        labels,count=ndimage.label(a[:,:,3]>=160,structure=np.ones((3,3)));sizes=np.bincount(labels.ravel());sizes[0]=0;a[labels!=sizes.argmax()]=0
        y,x=np.where(a[:,:,3]>=160);bounds.append((x.min(),y.min(),x.max()+1,y.max()+1));cells.append(a)
    scale=height/np.median([bounds[n][3]-bounds[n][1] for n in range(idle,idle+4)])
    out=Image.new('RGBA',(cols*64,rows*64));packed=[];meta=[]
    for n,a in enumerate(cells):
        im=Image.fromarray(a).resize((round(a.shape[1]*scale),round(a.shape[0]*scale)),Image.Resampling.NEAREST);a=np.array(im);a[:,:,3]=np.where(a[:,:,3]>=160,255,0);a[a[:,:,3]==0,:3]=0
        y,x=np.where(a[:,:,3]>0);bottom=y.max();top=y.min()
        # Helmet is a stable authored landmark even when feet or arms move.
        yy=np.indices(a.shape[:2])[0];steel=(a[:,:,3]>0)&(a[:,:,1]>45)&(a[:,:,1]<190)&(np.abs(a[:,:,0].astype(int)-a[:,:,1])<20)&(np.abs(a[:,:,2].astype(int)-a[:,:,1])<20)&(yy<top+(bottom-top)*.5)
        labels,count=ndimage.label(steel,structure=np.ones((3,3)));sizes=np.bincount(labels.ravel());sizes[0]=0
        candidates=[k for k in range(1,count+1) if sizes[k]>=4];assert candidates,(name,n,'helmet component')
        helmet=min(candidates,key=lambda k:np.where(labels==k)[0].mean());steel=labels==helmet
        sy,sx=np.where(steel);assert len(sx),(name,n,'helmet landmark')
        cx=round((sx.min()+sx.max())/2);cy=round((sy.min()+sy.max())/2)
        climb=n>=12 if name!='olaf' else 20<=n<=23
        floating=name=='olaf' and n>=28
        dx=32-cx;dy=((26 if name=='olaf' else 28) if climb else 30)-cy if climb or floating else 62-bottom
        if floating:
            palms=(a[:,:,3]>0)&(a[:,:,0]>150)&(a[:,:,1]>80)&(a[:,:,1]<200)&(a[:,:,2]<170)&(yy<top+(bottom-top)*.5)
            py,px=np.where(palms);assert len(py),(name,n,'floating palms')
            dy=26-py.min()
        canvas=Image.new('RGBA',(64,64));canvas.paste(Image.fromarray(a),(dx,dy));packed.append(canvas);meta.append({'cell':n,'offset':[dx,dy],'climb':climb,'helmetSourceNative':[cx,cy]})
    if name=='erik':
        # Keep the authored head and core at one root; retain generated limb transfers.
        root=np.array(packed[0])
        for n in range(8):
            gait=np.array(packed[n]);gait[:39]=root[:39];gait[39:49,27:37]=root[39:49,27:37]
            packed[n]=Image.fromarray(gait)
    if name=='olaf':
        # Authored gripping upper body is fixed; generated stride legs transfer below its belt.
        for start,upper in [(0,16),(8,24)]:
            torso=np.array(packed[upper])
            for n in range(start,start+8):
                gait=np.array(packed[n]);gait[:48]=torso[:48]
                packed[n]=Image.fromarray(gait)
    # Keep head, body outline and boots absolutely stable while breathing.
    for start in ([8] if name!='olaf' else [16,24]):
        base=np.array(packed[start]);mask=(base[:,:,3]>0)
        for n in range(start,start+4):
            variant=np.array(packed[n]);result=base.copy()
            for y in range(41,46):
                for x in range(27,38):
                    if mask[y,x] and variant[y,x,3]>0:result[y,x,:3]=variant[y,x,:3]
            packed[n]=Image.fromarray(result)
    for n,c in enumerate(packed):out.paste(c,(n%cols*64,n//cols*64))
    out.save(r/(name+'.png'));out.resize((out.width*2,out.height*2),Image.Resampling.NEAREST).save(r/(name+'-native-review.png'))
    records[name]={'scale':float(scale),'nativeHeight':height,'cell':[64,64],'cols':cols,'origin':[32,40],'sole':62,'source':source,'componentSources':{'idleFloatGrip':'olaf-grip-source.png','rearClimb':'olaf-source.png','strideLegs':'olaf-walk-source.png'} if name=='olaf' else None,'frames':meta}
(r/'registration.json').write_text(json.dumps(records,indent=2,default=lambda o:int(o))+'\n')
print('One uniform source scale per Viking, stable idle silhouette and helmet-rooted rear climb packed.')
