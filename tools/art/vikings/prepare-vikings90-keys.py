"""Keep exact single-pose/native coloring inputs and prompts reproducible."""
from pathlib import Path
from PIL import Image
import json,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file());OUT=ROOT/'assets/vikings90'
for hero in ('erik','baleog','olaf'):
 data=json.loads((OUT/f'{hero}-guide.json').read_text());sheet=Image.open(OUT/f'{hero}-guide-native.png')
 for i,f in enumerate(data['frames']):
  key=f"{hero}-{f['action']}-{f['phase']}";guide=sheet.crop((i%8*64,i//8*64,i%8*64+64,i//8*64+64))
  guide.resize((384,384),Image.Resampling.NEAREST).save(OUT/f'{key}-guide.png')
  version='v5'if '--v5'in sys.argv else'v4'
  source=OUT/f'{key}-prompt-{version}.txt'
  if source.exists():continue
  rear='climb'in f['action'];height=38 if hero=='baleog'else 36
  identity={'erik':'Erik, lean athletic red-bearded Viking; leather tunic, slate trousers and boots. His long copper-red beard flows in front views ONLY.',
   'baleog':'Baleog, broad armored blond Viking; blue-grey iron chest armor and shoulder plates, slate trousers, leather boots, long blond beard in front views ONLY.',
   'olaf':'Olaf, very chubby broad Viking with round belly, long blond beard in front views ONLY, green tunic, brown trousers/boots and the same ROUND wooden shield.'}[hero]
  if rear:
   identity={'erik':'Erik: leather tunic, slate trousers and leather boots; rear steel helmet and bare nape.',
    'baleog':'Baleog: blue-gray iron armor with ONE connected backplate and exactly TWO shoulder plates, slate trousers and leather boots; rear steel helmet and bare nape.',
    'olaf':'Olaf: chubby broad body, green tunic, brown trousers and boots; rear steel helmet, bare nape and large round shield strapped on back.'}[hero]
  facing='REAR ladder-facing: same leather/armor/skin on each limb in every reach. NO front face, NO chin beard or orange/yellow hair on upper back. Copy opposite reaching hands/knees exactly; steel helmet backside and bare nape.'if rear else'FRONT three-quarter right-facing: near shoulder/hip are LEFT, far are RIGHT. Copy every guided limb, foot, hand overlap and all their positions exactly. Near trouser leg is lighter slate, far trouser leg is darker slate as in guide; do not switch these anatomical identities.'
  shield=' Preserve the physical disc diameter, projection, palms and rider plane EXACTLY from guide; front hand must be BEHIND shield, never in front.'if hero=='olaf'else''
  material='brown'if hero=='olaf'else'slate'
  facing+=f' Anatomical leg materials remain fixed: screenLEFT leg is DARK {material}, screenRIGHT LIGHT {material} in rear view; front view uses lighter near and darker far {material}. Raising a limb does not recolor it.'
  if hero=='olaf':shield+=' Trousers including highlights are warm BROWN, never slate/gray. Front belly is exposed tan skin consistently; do not replace it with green cloth in other phases. Rear shield diameter is24 native pixels, never shrink to fit torso.'
  prompt=f'''Edit the FIRST image by coloring its exact pixel sprite. Image2 is character identity/material only. Keep every pixel cluster position, native pixel size, silhouette and anatomy of image1. No replacement generic pose. First image is64×64 native, enlarged6×, person{height}native pixels including horns. Only add Imagegen sculpted pixel material volumes WITHIN those exact native clusters. Output exact first image canvas/placement enlarged uniformly; no crop, zoom, extra margin or gradient painting. {identity} {facing}{shield}
Exactly two arms/hands, two legs/boots; full authored knee/ankle route and counterswing. Consistent steel, cloth/leather, skin, trousers and boots: no arbitrary hue swaps when a limb raises or crosses. Helmet has horns. {'Rear view has NO face or chin beard.'if rear else'Long-ish beard; Olaf eyes covered by helmet.'} Same material character as image2 and Inside the Clockwork, at deliberate native density: no tiny painted texture. Binary transparency outside actor, no floor, shadow, halo or backdrop.'''
  source.write_text(prompt+'\n')
print('Retained48 exact key guides/prompts; no generation/publication inferred.')
