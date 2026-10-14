"""Author a native woven material around the retained storm embroidery motif.

No resize, pixel detection or painting downsample. Each final pixel is a stitch
on the original48x80 textile canvas (96x160world units).
"""
from pathlib import Path
from PIL import Image
import json

root=Path(__file__).resolve().parents[3]
out=root/'assets/loom106'
out.mkdir(parents=True,exist_ok=True)
original=Image.open(root/'assets/level96/cloth-native.png').convert('RGBA')
assert original.size==(48,80)
result=Image.new('RGBA',(48,80))
palettes={
 'sky':[(31,53,73),(42,69,87),(27,47,66),(48,76,94)],
 'cloud':[(93,120,128),(116,143,143),(81,107,119),(124,149,145)],
 'linen':[(180,155,98),(234,215,160),(131,108,65),(209,186,127)]}
for y in range(8,80):
 for x in range(6,42):
  r,g,b,a=original.getpixel((x,y))
  if not a:continue
  material='linen' if r>150 or x in (6,7,40,41) else 'cloud' if r>60 else 'sky'
  # Twill: adjacent2pixel warp/weft clusters pass over/under on alternate rows.
  stitch=((x+y//2)%4)
  color=palettes[material][stitch]
  if y in (8,9,78,79):color=palettes['linen'][(x//2+y)%4]
  result.putpixel((x,y),(*color,255))
result.save(out/'cloth-native.png')
result.resize((384,640),Image.Resampling.NEAREST).save(out/'cloth-native-8x.png')
(out/'art-contract.json').write_text(json.dumps({
 'source':'assets/level96/cloth-native.png','author':'tools/art/loom/prepare-loom106.py',
 'nativeSize':[48,80],'worldSize':[96,160],'worldUnitsPerNativePixel':2,
 'opaqueBounds':list(result.getbbox()),'processing':'none: directly authored native RGBA pixels',
 'paletteRoles':palettes,'thread':{'shadow':'#66513e','base':'#b49b62','light':'#ead7a0'},
 'reveal':'18 alternating crosswise passes,4native rows each; bottom-up'
},indent=2)+'\n',encoding='utf8')
