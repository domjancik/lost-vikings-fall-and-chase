"""Native anchor checks and unscaled screenshot crops for independent critique."""
from pathlib import Path
from PIL import Image, ImageDraw
import json, math
root=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
for name in ['a','b']:
    atlas=Image.open(root/f'assets/depth94/{name}-native.png').convert('RGBA')
    reg=json.loads((root/f'assets/depth94/{name}-registration.json').read_text())
    assert atlas.size==(256,192)
    assert len(reg['records'])==12
    for rec in reg['records']:
        assert rec['uniformSourcePixelsPerNative']==1448/256
        assert rec['transform'][0]==rec['transform'][4]
        assert rec['nativeBounds'][3]==62
        cell=atlas.crop((rec['column']*64,rec['row']*64,(rec['column']+1)*64,(rec['row']+1)*64))
        assert cell.getbbox()==tuple(rec['nativeBounds'])
        assert set(cell.getchannel('A').tobytes())<={0,255}
    for row in range(3):
        assert atlas.crop((197,row*64+10,251,row*64+62)).getchannel('A').getextrema()==(255,255)
print('24 uniform native cells: registered base62, clean binary alpha; six wall interiors opaque.')
evidence=root/'output/depth94/evidence.json'
if evidence.exists():
    data=json.loads(evidence.read_text())
    for theme in ['cycle','refraction','momentum','clockwork','water','warden']:
        proofs=[p for p in data['proofs'] if p['diagnostic'] and p['label'].startswith(theme+'-')]
        sheet=Image.new('RGB',(1440,math.ceil(len(proofs)/3)*320),(25,28,34));draw=ImageDraw.Draw(sheet)
        for n,p in enumerate(proofs):
            cam=p['camera'];img=Image.open(root/p['file']);scale=img.height/cam['height']
            index=int(p['label'].split('-')[-2]);wall='-wall-' in p['label']
            obj=p['art']['decor']['walls' if wall else 'props'][index]
            x=(obj['x']+(obj['w']/2 if wall else 0)-cam['x'])*scale
            y=(obj['y'] if wall else obj['floorY'])-cam['y'];y*=scale
            left=max(0,min(img.width-480,round(x-240)));top=max(0,min(img.height-296,round(y-210)))
            # Copy original screen pixels: no resize, interpolation or sprite modification.
            sheet.paste(img.crop((left,top,left+480,top+296)),((n%3)*480,(n//3)*320+24))
            draw.text(((n%3)*480+5,(n//3)*320+5),p['label'],fill=(235,230,210))
        sheet.save(root/f'output/depth94/{theme}-contacts.png')
    print('Six unscaled diagnostic contact sheets saved.')
