"""Normalize accepted native-density cart once; preserve generated material pixels."""
from pathlib import Path
from PIL import Image
import numpy as np
import json
folder=Path('assets/warden105')
source=Image.open(folder/'cart-raw-v4.png').convert('RGBA')
image=source.resize((192,128),Image.Resampling.NEAREST)
a=np.array(image);a[a[:,:,3]<200]=0;a[a[:,:,3]>=200,3]=255
image=Image.fromarray(a);image.save(folder/'cart-native.png')
image.resize((384,256),Image.Resampling.NEAREST).save(folder/'cart-native-2x.png')
alpha=a[:,:,3]
deck=next(y for y in range(60,80) if np.count_nonzero(alpha[y]>=200)>150)
bottom=int(np.flatnonzero(np.count_nonzero(alpha>=200,axis=1)>4)[-1])+1
if deck!=71 or bottom!=107:raise ValueError('Source contact changed: review registration again')
registration=dict(nativeSize=[192,128],worldPixel=2,source='cart-raw-v4.png',normalization='one uniform nearest presentation normalization; alpha200 removes low-alpha generation matte; no quantizer, palette/grid detection, stretching or material painting',deck=[19,deck,150],wheelBottomExclusive=bottom,wheelSupportWorldOffset=70,wheelRegistration='whole wheel parts translated up1nativepixel to dock their visible soles; axle housing overlap reviewed in gameplay',ports=dict(wheel=[98,62],clampLeft=[20,26],clampRight=[167,26]))
(folder/'registration.json').write_text(json.dumps(registration,indent=2),encoding='utf-8')
