from pathlib import Path
import json, math, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageSequence, ImageEnhance

root=Path(__file__).resolve().parents[2]/'output'/'overview-60'
W,H=1920,1080
fps=60
ink='#10151b'; panel='#202933'; gold='#edbb75'; white='#f3ead7'; muted='#b4c0c8'; blue='#8cdad9'
def font(name,size): return ImageFont.truetype(f'C:/Windows/Fonts/{name}.ttf',size)
regular=lambda n:font('segoeui',n)
bold=lambda n:font('seguisb',n)
serif=lambda n:font('georgiab',n)
TOTAL=0
sources=[]
def image(p):
    i=Image.open(p).convert('RGBA'); return i
streams={}
def close_streams():
    for proc,_,_ in streams.values():
        proc.stdout.close();proc.wait()
    streams.clear()
def frame(i,n):
    p=root/'frames'/i
    if n==0 or i not in streams:
        if i in streams:
            old_proc,_,_=streams.pop(i);old_proc.stdout.close();old_proc.wait()
        meta=json.loads((p/'capture.json').read_text(encoding='utf8')); w,h=meta['size']
        proc=subprocess.Popen(['ffmpeg','-v','error','-threads','1','-i',str(p/'capture.mkv'),'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE,stderr=subprocess.DEVNULL)
        streams[i]=(proc,w,h)
    proc,w,h=streams[i];data=proc.stdout.read(w*h*3)
    if len(data)!=w*h*3:raise RuntimeError(f'Incomplete capture {i}/{n}')
    im=Image.frombytes('RGB',(w,h),data)
    return im.crop((0,0,1440,650)) if i in ('01','02','03') else im
def old(i,n):return frame(i,n)
def fit(im,box,cover=False):
    x,y,w,h=box
    if cover:return ImageOps.fit(im,(w,h),Image.Resampling.NEAREST)
    s=min(w/im.width,h/im.height); return im.resize((round(im.width*s),round(im.height*s)),Image.Resampling.NEAREST)
def place(out,im,box,cover=False):
    x,y,w,h=box; im=fit(im,box,cover); out.paste(im,(x+(w-im.width)//2,y+(h-im.height)//2),im if im.mode=='RGBA' else None)
def board(ch,title,caption):
    o=Image.new('RGB',(W,H),ink); d=ImageDraw.Draw(o)
    d.text((66,30),ch.upper(),font=bold(23),fill=gold)
    d.text((65,62),title,font=serif(49),fill=white)
    d.line((68,132,1852,132),fill='#574b3a',width=2)
    d.text((68,1023),caption,font=regular(26),fill=muted)
    return o
def label(o,x,y,s,color=gold): ImageDraw.Draw(o).text((x,y),s,font=bold(24),fill=color)
def card(n,last=False):
    o=fit(old('13' if last else '12',n),(0,0,W,H),True).convert('RGB'); o=ImageEnhance.Brightness(o).enhance(.43 if not last else .30)
    d=ImageDraw.Draw(o);d.rectangle((0,0,1120,H),fill='#11171e');d.line((82,245,1012,245),fill=gold,width=3)
    d.text((82,264),'A FAN PROJECT INSPIRED BY THE LOST VIKINGS' if last else 'DEVELOPMENT OVERVIEW',font=bold(24),fill=gold)
    d.text((77,343),'Still in the making.' if last else 'Lost Vikings',font=serif(86 if last else 120),fill=white)
    if not last:d.text((82,492),'The Fall & The Chase',font=serif(61),fill=white)
    d.text((86,625),'github.com/domjancik/lost-vikings-fall-and-chase' if last else 'Three Vikings. One escape plan at a time.',font=regular(32),fill=white)
    return o

def gameplay(ch,title,caption,clip,n):
    o=board(ch,title,caption); im=clip(n)
    place(o,im,(68,148,1784,851));return o
def pict(ch,title,caption,p,n=0):
    return gameplay(ch,title,caption,lambda _:image(p),n)
def pair(ch,title,caption,a,b,labels,n):
    o=board(ch,title,caption)
    for j,(clip,text) in enumerate(zip([a,b],labels)):
        x=68+j*907;label(o,x,204,text);place(o,clip(n),(x,256,877,640));
    return o

def ui(n):
    o=board('03 / INTERFACE','More room to play','Touch controls move toward the edges; cutscenes keep only the top bar and dialogue.')
    cards=[('Early fullscreen',image('output/playwright/fullscreen-portrait.png')),('Compact game HUD',image('output/playwright/hud25-390.png')),('Current touch layout',fit(image('output/development-overview/frames/24/000.png'),(0,0,430,780))),('Cutscene HUD',image('assets/hud155/touch/floor-break-portrait.png'))]
    for i,(name,im) in enumerate(cards):
        x=70+i*450;label(o,x,152,name);ImageDraw.Draw(o).rectangle((x,200,x+420,976),fill='#1b222b');place(o,im,(x,208,420,756))
        if n//75==i:ImageDraw.Draw(o).rectangle((x,200,x+420,976),outline=gold,width=3)
    return o

guide=image('assets/vikings90/erik-walk-3-guide.png')
raw=image('assets/vikings90/erik-walk-3-raw-v5.png')
sheet=image('assets/vikings90/erik-native.png')
native=sheet.crop((3*80,0,4*80,80))
def tight(im):
    bounds=im.getchannel('A').point(lambda a:255 if a>=128 else 0).getbbox();return im.crop(bounds) if bounds else im
def workflow(n):
    o=board('04 / CHARACTER ART','From motion guide to native pixels','Guide the silhouette first. Align the finished pose on the native sprite sheet before it ships.')
    for j,(name,im) in enumerate([('01  Pose guide',guide),('02  Generated source',raw),('03  Registered native cell',native)]):
        x=70+j*605;d=ImageDraw.Draw(o);d.rounded_rectangle((x,221,x+568,883),radius=12,fill=panel);label(o,x+25,246,name,white)
        d.rectangle((x+38,308,x+530,827),fill='#17212b');place(o,tight(im),(x+112,381,344,348));
        if n//100==j:d.rounded_rectangle((x,221,x+568,883),radius=12,outline=gold,width=3)
    return o

def gif(path):
    seq=Image.open(path);return [(i.convert('RGBA').copy(),i.info.get('duration',100)) for i in ImageSequence.Iterator(seq)]
gifs=[gif(f'assets/vikings90/{hero}-{stage}-{movement}.gif') for hero,stage,movement in [('erik','guide','walk'),('erik','registered','walk'),('baleog','guide','walk'),('baleog','registered','walk')]]
def loops(n):
    o=board('04 / CHARACTER ART','The motion survives the art pass','Erik’s run and Baleog’s walk: the production guides and registered frames, looping side by side.')
    for i,(name,seq) in enumerate(zip(['Erik · guide','Erik · finished','Baleog · guide','Baleog · finished'],gifs)):
        x=70+i*450;label(o,x,215,name);ImageDraw.Draw(o).rectangle((x,282,x+420,875),fill=panel);t=(n*1000/fps)%sum(ms for _,ms in seq);im=seq[-1][0]
        for candidate,ms in seq:
            if t<ms:im=candidate;break
            t-=ms
        place(o,im,(x+12,301,396,552))
    return o

def raw_scene(n,side):
    return Image.frombytes('RGBA',(375,250),Path(f'output/scene67-{side}-{n}.rgba').read_bytes())
ca,cb=raw_scene(6,'before'),raw_scene(6,'after'); delta=np.max(np.abs(np.array(ca).astype('i2')-np.array(cb).astype('i2'))[:,:,:3],axis=2)
best=max(((np.maximum(delta[y:y+30,x:x+52]-12,0).sum(),x,y) for y in range(6,213,4) for x in range(6,319,4)))
crop=(best[1],best[2],best[1]+52,best[2]+30)
def grid(n):
    o=board('05 / PIXEL PIPELINE','Keep hard edges hard','Similar tones can still blend. Large color jumps stay sharp instead of becoming a halo.')
    for j,(im,text) in enumerate([(ca,'Before · weighted average'),(cb,'After · contrast-aware sampling')]):
        x=68+j*907;label(o,x,163,text);d=ImageDraw.Draw(o)
        place(o,im.crop(crop),(x,211,877,570));
        d.rectangle((x,836,x+877,931),fill=panel)
        swatches=('#172d48','#585f61','#cbb382') if j==0 else ('#172d48','#172d48','#cbb382')
        for k,col in enumerate(swatches):d.rectangle((x+20+k*47,861,x+62+k*47,903),fill=col)
        d.text((x+178,866),'Mixes across the boundary' if j==0 else 'Rejects high-contrast neighbors',font=bold(24),fill=white)
    return o

clips=[]
def add(seconds,fn,description): clips.append((round(seconds*fps),fn,description))
def still(ch,t,c,p,sec=3):
    prepared=pict(ch,t,c,p);add(sec,lambda _:prepared,p)
def live(ch,t,c,key,sec=3):
    add(sec,lambda n:gameplay(ch,t,c,lambda q:frame(key,q),n),f'60 fps capture {key}')
def chapter(number,title,desc):
    def make(_):
        o=Image.new('RGB',(W,H),ink);d=ImageDraw.Draw(o);d.line((78,290,1842,290),fill=gold,width=2);d.text((75,331),number,font=bold(26),fill=gold);d.text((73,390),title,font=serif(93),fill=white);d.text((77,555),desc,font=regular(40),fill=muted);return o
    frame_=make(0);add(1.5,lambda _:frame_,title)

add(2.5,card,'Opening')
live('THE FALL & THE CHASE','The floor gives way','The crew gathers around a creation globe in the tavern storeroom.','27',1.9)
live('THE FALL & THE CHASE','The find runs away','It lands first, unfolds six legs, and vanishes into the sewer.','28',3.8)
chapter('ACT I','Visual progress','The same game, across successive versions.')
live('ACT I / EARLY BUILD','The Neon Stag','The early arcade pub: simple ledges and the original three-hero setup.','01',1.5)
live('ACT I / FIRST GIT SNAPSHOT','The Neon Stag','Matched view: sprite terrain and layered scenery take shape.','02',2)
live('ACT I / REVISION 56','The Neon Stag','Matched view: quieter terrain, clearer platforms and props.','03',2)
live('ACT I / REVISION 62','The Refraction Gate','The machine worlds begin to feature light as a puzzle element.','04',2)
live('ACT I / REVISION 69','Inside the Clockwork','A gear-driven machine unfolds across a vertically layered room.','05',2.5)
live('ACT I / REVISION 89','The Fourfold Warden','The first guardian: a bronze frame, four legs and a service carriage.','07',2.5)
live('ACT I / REVISION 98','The Storm Loom','The later archives turn machinery into whole architectural spaces.','09',2.5)
add(3,lambda n:pair('ACT I / MATCHED CAMERA','The Warden, then and now','Same arena, same camera. The redesigned guardian gains exposed joints and heavier metalwork.',lambda q:frame('07',q),lambda q:frame('08',q),['Revision 89','Current build'],n),'Matched Warden camera 800,170')
add(3,lambda n:pair('ACT I / MATCHED CAMERA','Inside the Clockwork','Same tower, same camera. Extra device detail and the revised Viking sprites come into view.',lambda q:frame('05',q),lambda q:frame('06',q),['Revision 69','Current build'],n),'Matched Clockwork camera 0,100')
live('ACT I / CURRENT BUILD','Ember Freight','The climb reveals a night skyline above the machinery.','12',2.5)
live('ACT I / CURRENT BUILD','The Familiar Hearth','The campaign now opens in a Norse tavern before descending into the machine worlds.','11',2.5)
for shot in json.loads((root/'tour.json').read_text(encoding='utf8')):
    live('ACT I / LEVEL TOUR',shot['name'].title(),shot['group'],shot['id'],.8)

chapter('ACT II','Mechanics in motion','Platforming and puzzles built around the crew’s different abilities.')
still('ACT II / COOPERATION','Olaf makes a platform','His raised shield gets Erik to the tavern loft.','assets/pub143/accepted-desktop/shield-boarded-2x.png',2.5)
live('ACT II / COOPERATION','Inside the Clockwork','Erik drives the gear while the split view keeps the carriage and crew visible.','26')
live('ACT II / TRAVERSAL','The Drowned Regulator','Erik swims below the surface while the water refracts the background.','21')
still('ACT II / MOMENTUM','The Momentum Works','A guide lever redirects the rolling flywheel through the machine works.','output/playwright/momentum72-guide-moving.png',2.5)
add(3,lambda n:pair('ACT II / TRAVERSAL','Scrap Orbit','Magnetic boots let Baleog take a firing position on the underside.',lambda _:image('assets/orbit122/route/captures/magnetic-ceiling-2x.png'),lambda q:frame('13',q),['Magnetic traversal','Orbital machinery'],n),'Magnetic traversal and animated Scrap Orbit')
live('ACT II / COMBAT','The Fourfold Warden','The guardian tracks its target, fires and sends shockwaves across the floor.','22')

chapter('ACT III','Under the hood','Light, interface, animation and the pixel grid.')
live('ACT III / LIGHT','The Last Lamplighter','Walking turns the lantern beam, moving the shadows through the flickering haze.','23',5)
add(3,lambda n:pair('ACT III / OPTICS','Pressure waves and water flow','Shockwaves distort the scene; sewer currents carry the crew into a pipe.',lambda _:image('assets/warden104/evidence/wave-1.95-2x.png'),lambda _:image('assets/sewer150/route/pipe-depth-2-2x.png'),['Warden · shockwave','Sewer · outlet current'],n),'Effect review captures')
add(5,ui,'Historical HUD through current controls and cutscene layout')
still('ACT III / VISUAL BRAINSTORM','Explore the possibilities','Describe a cooperative problem, generate alternatives, then prototype and review the chosen mechanism.','assets/freight109/concepts-raw.png',3)
add(3,lambda n:pair('ACT III / VISUAL BRAINSTORM','Inside the Clockwork','The visual sketch works through the half-wheel assembly and Erik driving the machinery.',lambda _:image('assets/clockwork69/brainstorm.png'),lambda q:frame('26',q),['ImageGen puzzle sketch','Implemented wheel and carriage'],n),'Clockwork visual brainstorm to implementation')
add(3,lambda n:pair('ACT III / VISUAL BRAINSTORM','The Fourfold Warden','The concept establishes the shared sequence: brace a leg, expose the eye, release the carriage.',lambda _:image('assets/warden86/concept-raw.png'),lambda q:frame('22',q),['ImageGen cooperation concept','Implemented guardian'],n),'Warden visual brainstorm to implementation')
add(2.5,lambda n:pair('ACT III / VISUAL BRAINSTORM','Ember Freight','One of the explored worlds becomes a moving depot above a burning city.',lambda _:image('assets/freight109/concepts-raw.png').crop((0,0,1536,281)),lambda q:frame('12',q),['Selected world concept','In-game environment'],n),'Freight visual brainstorm to implementation')
add(5,workflow,'Erik: pose guide, selected image generation, registered native cell')
add(5,loops,'Original animation loops, at their authored timing')
live('ACT III / ANIMATION','Back in the game','The finished Erik sprite, running and jumping in the tavern.','25')
add(5,grid,f'Actual scenery comparison at identical scale; source crop {crop}')
add(3,lambda n:card(n,True),'End credit')

TOTAL=sum(frames for frames,_,_ in clips)
duration=TOTAL/fps
rate=48000; t=np.arange(round(duration*rate))/rate; signal=np.zeros(t.shape)
chords=[(110,130.81,164.81),(87.31,130.81,174.61),(98,146.83,196),(82.41,123.47,164.81)]
for n,start in enumerate(np.arange(0,duration,.63)):
    offset=int(start*rate);nn=min(round(2.1*rate),len(t)-offset);a=np.arange(nn)/rate
    f=chords[(n//8)%4][[0,2,1,2,0,1,2,1][n%8]]*(2 if n%8 in (3,6) else 1)
    env=(1-np.exp(-110*a))*np.exp(-3.7*a)
    signal[offset:offset+nn]+=(np.sin(2*np.pi*f*a)+.28*np.sin(4*np.pi*f*a)+.1*np.sin(6*np.pi*f*a))*env*.13
signal*=np.minimum(1,t/.5)*np.clip((duration-t)/2,0,1)
audio=root/'overview-score.wav'
with wave.open(str(audio),'wb') as wf:
    wf.setnchannels(1);wf.setsampwidth(2);wf.setframerate(rate);wf.writeframes((np.clip(signal,-1,1)*32767).astype('<i2').tobytes())

target=root/'Lost Vikings - Development Overview 60fps - Archive Fixed.mp4'
proc=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1920x1080','-r',str(fps),'-i','-','-i',str(audio),'-c:v','libx264','-preset','veryfast','-crf','18','-threads','6','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','-shortest',str(target)],stdin=subprocess.PIPE)
cursor=0;listings=[]
for count,maker,desc in clips:
    listings.append({'start':cursor/fps,'duration':count/fps,'source':desc});cursor+=count
    for n in range(count):
        im=maker(n).convert('RGB');proc.stdin.write(im.tobytes())
    close_streams()
    print(f'Encoded {cursor/fps:.1f}s: {desc}',flush=True)
proc.stdin.close();assert proc.wait()==0
(root/'shot-list.json').write_text(json.dumps({'duration':duration,'video':target.name,'shots':listings,'notes':['Moving gameplay was rendered at 60 Hz with manual browser frame stepping and encoded at 60 fps, without interpolation. Warden, Clockwork and sewer demonstrations use staged production-engine states.','Historical gameplay stills are not re-enactments.','Pixel before/after uses the same source, sample window and output scale.']},indent=2),encoding='utf8')

