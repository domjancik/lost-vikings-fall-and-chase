"""Diagnostic marks on real captured gameplay, never production sprite edits."""
from pathlib import Path
from PIL import Image,ImageDraw
import json
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'output/water92/water-route.json').read_text())['result']
out=root/'output/water92';records=[]
for zoom in ['2x','1x','mobile']:
 name='drained' if zoom=='2x' else 'drained-contact-'+zoom;s=data['evidence'][name]
 im=Image.open(root/('output/playwright/water92-'+name+'.png')).convert('RGB')
 cam=s['camera'];box=s['canvasRect'];p=s['art']['pontoon'];cradle=s['art']['cradle']
 def point(x,y):return(box['x']+(x-cam['x'])*box['w']/cam['width'],box['y']+(y-cam['y'])*box['h']/cam['height'])
 a=point(p['x']-20,cradle['seatY']-52);b=point(p['x']+212,cradle['seatY']+42)
 bounds=(max(0,int(a[0])),max(0,int(a[1])),min(im.width,int(b[0])),min(im.height,int(b[1])))
 crop=im.crop(bounds);crop.save(out/('contact-'+zoom+'-actual.png'))
 d=ImageDraw.Draw(crop);seat=point(p['x'],cradle['seatY'])[1]-bounds[1]
 d.line((0,seat,crop.width,seat),fill='#e874aa',width=1)
 d.text((4,3),'Physical seat 800 / visible buoy soles 800',fill='white')
 crop.save(out/('contact-'+zoom+'-marked.png'))
 records.append({'capture':name,'camera':cam,'screenCrop':bounds,'physicalSeat':cradle['seatY'],'visibleBuoySole':p['visibleBottom'],'opaqueUnderOutline':p['opaqueBottom'],'deck':p['deckY']})
 # Same authored native scale, translation only, showing both actual sprite masks.
 if zoom=='2x':
  native=Image.new('RGBA',(128,188),'#24313a')
  native.alpha_composite(Image.open(root/'assets/water92/cradle-native.png'),(0,76))
  native.alpha_composite(Image.open(root/'assets/water92/pontoon-native.png'),(16,0))
  native.resize((512,752),Image.Resampling.NEAREST).save(out/'contact-native-4x.png')
(out/'contact-proof.json').write_text(json.dumps(records,indent=2)+'\n')
print(records)
