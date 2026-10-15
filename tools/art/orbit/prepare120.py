"""One uniform registration from accepted rawv4; never process a processed asset."""
from pathlib import Path
import json
from PIL import Image
root=Path(__file__).resolve().parents[3]
out=root/'assets/orbit120'
source=Image.open(out/'plate-raw-v4.png').convert('RGBA')
alpha=source.getchannel('A'); box=alpha.point(lambda n:255 if n>=220 else 0).getbbox()
crop=source.crop(box)
scale=172/crop.width
size=(round(crop.width*scale),round(crop.height*scale))
assert size==(172,24),size
native=Image.new('RGBA',(192,96))
pixels=crop.resize(size,Image.Resampling.NEAREST)
pixels.putalpha(pixels.getchannel('A').point(lambda n:255 if n>=128 else 0))
native.alpha_composite(pixels,(10,36))
native.save(out/'plate-native.png')
native.resize((768,384),Image.Resampling.NEAREST).save(out/'plate-native-4x.png')
(out/'plate-registration.json').write_text(json.dumps({'source':'assets/orbit120/plate-raw-v4.png','sourceMaterialBox':box,'uniformScale':scale,'roundedNativeBody':size,'nativeCanvas':[192,96],'pivot':[96,48],'paste':[10,36],'alphaBox':native.getchannel('A').getbbox(),'worldBody':[344,48],'method':'original once; uniform nearest normalization; material alpha threshold; translation'},indent=2)+'\n',encoding='utf8')
