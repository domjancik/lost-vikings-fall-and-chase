"""Prepare architecture at its intended human-referenced world size."""
from pathlib import Path
import sys,shutil
import numpy as np
from PIL import Image
sys.path.insert(0,str(next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())/'tools/pixel-art-fixer/python'))
from pixelfixer.reconstruct import two_stage_pack
root=Path('assets/scale50');root.mkdir(parents=True,exist_ok=True)
for chapter in range(7):
 # Repack original sheet directly; do not repeatedly resample runtime sprites.
 sheet=Image.open(f'assets/mid49/source-{chapter//4}.png').convert('RGBA')
 cell=chapter%4;x=cell%2*768;y=cell//2*512
 pixels=np.array(sheet.crop((x,y,x+768,y+512)))
 pixels[:,:,3]=np.where(pixels[:,:,3]>=128,255,0)
 occupied=np.where(pixels[:,:,3]>0)[0]
 shift=-int(occupied.min()) if chapter==5 else 511-int(occupied.max())
 aligned=np.zeros_like(pixels)
 if shift>=0:aligned[shift:]=pixels[:512-shift]
 else:aligned[:512+shift]=pixels[-shift:]
 result=two_stage_pack(aligned,192,128)
 result[:,:,3]=np.where(result[:,:,3]>=128,255,0)
 result[result[:,:,3]==0,:3]=0
 assert set(np.unique(result[:,:,3]))=={0,255}
 assert np.any(result[0 if chapter==5 else -1,:,3])
 Image.fromarray(result).save(root/f'middle-{chapter}.png')
generated=Path.home()/'.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7'
for name,file in [('pub-far-source.png','exec-e23149c2-608d-47c9-8bb8-4dada6d3ce0b.png'),('pub-middle-source.png','exec-19eb3520-002f-44a3-8c74-108a86dfc69b.png')]:
 if not (root/name).exists():shutil.copyfile(generated/file,root/name)
far=np.array(Image.open(root/'pub-far-source.png').convert('RGBA'))
Image.fromarray(two_stage_pack(far,768,512)).convert('RGB').save(root/'pub-far.png')
middle=np.array(Image.open(root/'pub-middle-source.png').convert('RGBA'))
middle[:,:,3]=np.where(middle[:,:,3]>=128,255,0)
ys=np.where(middle[:,:,3]>0)[0];top,bottom=int(ys.min()),int(ys.max())+1
# Trim only empty outer margins; retain the full connected two-storey silhouette.
middle=middle[top:bottom]
height=round(288*middle.shape[0]/middle.shape[1])
result=two_stage_pack(middle,288,height)
result[:,:,3]=np.where(result[:,:,3]>=128,255,0)
result[result[:,:,3]==0,:3]=0
out=Image.new('RGBA',(288,192));out.paste(Image.fromarray(result),(0,192-height))
assert np.any(np.array(out)[-1,:,3]);out.save(root/'middle-7.png')
print('8 human-referenced middle sprites; opaque supports; pub far768x512 source retained.')
