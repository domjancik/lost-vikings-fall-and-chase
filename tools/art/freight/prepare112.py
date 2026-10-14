"""Single presentation normalization from independently accepted raw sources.

V1 and burnerV2/V3 remain original development sources, never runtime assets.
No texture repainting, palette quantization, automatic grid rescue or stretching.
"""
from PIL import Image
import numpy as np,json
from pathlib import Path
out=Path('assets/freight112')
source=Image.open(out/'fan-raw-v2.png').convert('RGBA')
fan=source.resize((128,64),Image.Resampling.NEAREST)
a=np.array(fan);a[a[:,:,3]<200]=0;a[a[:,:,3]>=200,3]=255
fan=Image.fromarray(a)
housing=fan.crop((0,0,64,64));rotor=fan.crop((64,0,128,64))
housing.save(out/'fan-housing-native.png');rotor.save(out/'fan-rotor-source-native.png')
# The generated hub is whole-part registered to the seat by translation only.
registered=Image.new('RGBA',(64,64));registered.paste(rotor,(0,0));registered.save(out/'fan-rotor-native.png')
def broad_bottom(image):
 a=np.array(image)[:,:,3]>0
 return int(np.flatnonzero(np.count_nonzero(a,axis=1)>=max(2,image.width*.08))[-1])+1
result={'source':'assets/freight112/fan-raw-v2.png','sourceSize':source.size,'worldPixel':2,'fan':{'nativeCell':[64,64],'baseExclusive':broad_bottom(housing),'seat':[32,31],'rotorHubSource':[32,31],'registrationTranslation':[0,0],'apertureRadius':19},'sourceGate':'ACCEPT by freight109_review for fanV2 2026-10-15'}
(out/'fan-registration.json').write_text(json.dumps(result,indent=2))
for name,image in [('fan-housing',housing),('fan-rotor',registered)]:image.resize((256,256),Image.Resampling.NEAREST).save(out/(name+'-native-4x.png'))
print(json.dumps(result))
