from pathlib import Path
from PIL import Image
import json
root=Path('assets/gate61');im=Image.open(root/'source.png').convert('RGBA')
# Accepted coarse native art is uniformly sampled once, never pixel-grid detected.
a=im.resize((64,64),Image.Resampling.NEAREST)
a.putalpha(a.getchannel('A').point(lambda v:255 if v>=128 else 0))
rows=[y for y in range(64) if sum(a.getpixel((x,y))[3]>=128 for x in range(64))>=6]
shift=63-rows[-1]
out=Image.new('RGBA',(64,64));out.paste(a,(0,shift));out.save(root/'gate.png')
(root/'registration.json').write_text(json.dumps({'sourceSize':im.size,'nativeSize':[64,64],'worldSize':[128,128],'sourcePixelWorldSize':2,'soleShiftNative':shift,'baseBottomNative':64,'method':'single uniform nearest-neighbor sample of accepted coarse source; base translation only'},indent=2))
print('Gate64 native; base registered at64; shift',shift)
