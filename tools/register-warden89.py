from pathlib import Path
from PIL import Image
import numpy as np,json
root=Path(__file__).resolve().parents[1];folder=root/'assets/warden89'
# One uniform normalization of approved v2 source. No per-part shape stretching.
im=Image.open(folder/'parts-raw-v2.png').convert('RGBA').resize((512,512),Image.Resampling.NEAREST)
a=np.array(im);a[a[:,:,3]<200]=0;a[a[:,:,3]>=200,3]=255
# Conservative chroma matte cleanup: neither red nor green belongs to this
# brass/teal/cyan source palette. Preserve legitimate amber and cyan clusters.
c=a[:,:,:3].astype(float);bad=((c[:,:,1]>c[:,:,0]*1.7)&(c[:,:,1]>c[:,:,2]*1.8))|((c[:,:,0]>c[:,:,1]*2.5)&(c[:,:,0]>c[:,:,2]*2.5))
a[bad]=0;im=Image.fromarray(a);im.save(folder/'parts-native.png');im.resize((1024,1024),Image.Resampling.NEAREST).save(root/'output/warden89/parts-registered-2x.png')
bg=Image.open(folder/'scene-raw-v1.png').convert('RGB');bg.resize((960,round(960*bg.height/bg.width)),Image.Resampling.NEAREST).save(folder/'scene-native.png')
glass=im.crop((312,144,416,256));mask=np.array(glass);yy,xx=np.mgrid[:112,:104];mask[((xx-86)/18)**2+((yy-62)/36)**2>1]=0;Image.fromarray(mask).save(folder/'broken-lens-native.png')
meta={'nativeSize':[512,512],'worldPixel':2,'source':'parts-raw-v2.png','normalization':'uniform nearest-neighbor only; conservative alpha/chroma matte cleanup; no per-part stretching',
 'parts':{'body':[0,32,320,104],'upper-near':[328,32,40,104],'lower-near':[376,32,36,104],'upper-far':[424,32,40,104],'lower-far':[472,32,40,104],
 **{n:[i*104,144,104,112]for i,n in enumerate(['head-closed','head-opening','head-open','head-broken'])},'foot-near':[416,152,48,48],'foot-far':[464,152,48,48],
 **{'plunger-'+str(i):[i*80,272,80,64]for i in range(4)},'wheel':[416,256,96,96],'clamp':[343,56,14,24],'hub-far':[430,34,24,24],'spoke':[440,298,12,4],
 **{n:[i*168,350,168 if i<2 else 176,112]for i,n in enumerate(['cargo-held','cargo-free','cargo-running'])}},
 'anchors':{'bodyDeck':14,'bodyHips':[[54,70],[108,70],[284,70],[300,70]],'linkPivots':[[22,14],[19,14],[18,14],[18,14]],'linkEndY':88,'footPivot':[20,15],'footSole':39,'headEye':[86,62],'plungerBase':50,'plungerCap':[11,35],'cargoRim':[9,62,159],'cargoWheelBottom':97}}
(folder/'registration.json').write_text(json.dumps(meta,indent=2)+'\n')
(root/'warden-art89.js').write_text('export const WARDEN_ART='+json.dumps(meta)+';\n')
