"""Author native material pixels from81 meshes; imagegen is a style reference only.

No generated image is resampled, detected, quantized or spliced into these sprites.
Geometry, contacts and secondary motion come from the accepted native guide rig.
"""
from pathlib import Path
import copy, importlib.util, json
from PIL import Image, ImageDraw, ImageChops

ROOT = next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
OUT = ROOT/'assets'/'vikings81-materials'
OUT.mkdir(parents=True,exist_ok=True)
spec = importlib.util.spec_from_file_location('native81', Path(__file__).with_name('guide-vikings81.py'))
M = importlib.util.module_from_spec(spec)
spec.loader.exec_module(M)
G = M.configure()

# Broad material planes follow the earthy imagegen studies. Every color is an
# explicitly authored native palette entry, not sampled from a painted source.
PALETTES = {
 'erik': dict(cloth='#a34732',clothDark='#632b2b',hair='#b76c2e',pants='#526776',farPants='#303c4d'),
 'baleog': dict(cloth='#3e6776',clothDark='#263d50',hair='#c39848',pants='#657681',farPants='#354455'),
 'olaf': dict(cloth='#797743',clothDark='#424832',hair='#bd873c',pants='#876440',farPants='#493c30')
}
FIXED = {'#172630':'#17222c','#97adae':'#71818a','#cbd4c3':'#c0c5b6',
 '#d5d9bf':'#c0c5b6','#e3ad7d':'#d5a36e','#c89e72':'#d1a06b',
 '#dfb281':'#d9aa73','#997757':'#987452','#956f58':'#956d50',
 '#bb9656':'#926332','#dbc183':'#c69a58','#a9b8ac':'#a9b2ac','#687f80':'#64757e'}

def rgb(color):
    return tuple(int(color.lstrip('#')[i:i+2],16) for i in (0,2,4))

def tones(color):
    # Three discrete shades only; no gradients, noise or fractional alpha.
    c=rgb(color)
    return (tuple(max(0,round(v*.69)) for v in c),
            tuple(min(255,round(v*.91+a)) for v,a in zip(c,(39,30,19))))

original_poly = G.poly
def material_poly(d, points, fill):
    color = FIXED.get(fill,fill)
    vertices = [G.xy(p) for p in points]
    d.polygon(vertices,fill=color)
    if color == '#17222c' or len(vertices)<3:
        return
    area=abs(sum(x1*y2-x2*y1 for (x1,y1),(x2,y2) in zip(vertices,vertices[1:]+vertices[:1])))/2
    if area < 12:
        return
    xs,ys=zip(*vertices);left,right,top,bottom=min(xs),max(xs),min(ys),max(ys)
    w,h=right-left,bottom-top
    if w<2 or h<2:return
    dark,light=tones(color)
    mask=Image.new('L',(64,64));ImageDraw.Draw(mask).polygon(vertices,fill=255)
    layer=Image.new('RGBA',(64,64));paint=ImageDraw.Draw(layer)
    paint.polygon([(left,top),(left+max(1,round(w*.35)),top),
                   (left+max(1,round(w*.35)),top+max(1,round(h*.35))),
                   (left,top+max(1,round(h*.62)))],fill=light+(255,))
    paint.polygon([(right,top+max(1,round(h*.42))),(right,bottom),
                   (left+max(1,round(w*.45)),bottom),
                   (right-max(1,round(w*.2)),bottom-max(1,round(h*.25)))],fill=dark+(255,))
    layer.putalpha(ImageChops.multiply(layer.getchannel('A'),mask))
    d._image.alpha_composite(layer)

G.poly = material_poly
original_shield=G.shield_image
def material_shield(equipment):
    # Recolor the procedural native plate's authored material slots only.
    im=original_shield(equipment)
    pixels=im.load()
    slots={rgb(old):rgb(new) for old,new in FIXED.items()}
    for y in range(64):
        for x in range(64):
            r,g,b,a=pixels[x,y]
            if a and (r,g,b) in slots:pixels[x,y]=slots[(r,g,b)]+(a,)
    return im
G.shield_image=material_shield

def main():
    G.OUT=OUT
    for hero in ('erik','baleog','olaf'):
        G.HEROES[hero].update(PALETTES[hero])
        source=ROOT/'assets'/'vikings81'/(hero+'-guide.json')
        meta=json.loads(source.read_text())
        frames=[copy.deepcopy(f) for f in meta['frames']]
        images=[G.render(f) for f in frames]
        atlas=G.sheet(frames,images)
        atlas.save(OUT/(hero+'.png'))
        atlas.resize((atlas.width*4,atlas.height*4),Image.Resampling.NEAREST).save(OUT/(hero+'-4x.png'))
        (OUT/(hero+'.json')).write_text(json.dumps({**meta,'artSource':'native81 mesh material pass',
            'styleReferences':['assets/vikings80/olaf-style-correction-raw.png',
                               'assets/vikings80/erik-imagegen-raw.png',
                               'assets/vikings80/baleog-imagegen-raw.png'],
            'frames':frames},indent=2)+'\n')
        for action in ('walk','idle','climb','bash','sword','bow','overhead-walk','float'):
            G.animation(hero,frames,images,action)
        alpha=set(atlas.getchannel('A').getdata())
        assert alpha <= {0,255}, 'non-binary native alpha'
        print(hero,atlas.size,len(frames),'native authored material frames; binary alpha')

if __name__=='__main__':main()
