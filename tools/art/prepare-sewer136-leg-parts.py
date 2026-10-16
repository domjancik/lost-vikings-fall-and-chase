"""Prepare one source at the authored64x32 native grid. No grid detection."""
from pathlib import Path
import json
from PIL import Image
p=Path(__file__).resolve().parents[2]/'assets'/'sewer136'
im=Image.open(p/'leg-parts-v2-source.png').convert('RGBA').resize((64,32),Image.Resampling.NEAREST)
# Discard only translucent imagegen background wisps; opaque material colors and
# density remain untouched. Do not blur/average/quantize opaque edge pixels.
data=list(im.getdata());im.putdata([(r,g,b,255) if a>=128 else (0,0,0,0) for r,g,b,a in data]);im.save(p/'leg-parts-native.png');im.resize((768,384),Image.Resampling.NEAREST).save(p/'leg-parts-native-review.png')
registration={'nativePixelWorldUnits':2,'nativeSheet':[64,32],'cell':[16,16],'source':'leg-parts-v2-source.png','sampling':'one nearest-neighbor normalization; alpha<128 removed, remaining material alpha255','parts':[{'name':'upper','pivot':[4,7],'end':[12,7],'nativeLength':8},{'name':'shin','pivot':[4,7],'end':[13,7],'nativeLength':9},{'name':'foot','pivot':[5,7],'soleExclusive':11},{'name':'pin','pivot':[8,8]}],'rows':['near','far'],'body':{'source':'assets/alehall135/globe-native.png','cropInEach48pxCell':[14,12,20,22],'pivot':[10,10],'worldDiameter':40},'gait':{'legs':6,'tripods':[[0,2,4],[1,3,5]],'strideWorld':24,'footSoleWorld':760}}
(p/'leg-registration.json').write_text(json.dumps(registration,indent=2)+'\n')
