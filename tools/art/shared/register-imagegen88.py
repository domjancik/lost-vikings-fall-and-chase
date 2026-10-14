"""Export source guide's equipment contract without DOM or frame fitting."""
from pathlib import Path
import json,math
root=next(p for p in Path(__file__).resolve().parents if (p/'package.json').is_file())
d=json.loads((root/'assets/vikings86-native/olaf-frames.json').read_text())
p=d['geometryProjection'];cells=[]
for f in d['frames']:
 e=next(e for e in f['equipment'] if e['type']=='shield')
 cells.append(dict(x=(e['center'][0]-32)*p*2,y=(62+(e['center'][1]-62)*p-40)*2,
  rx=e['projectionSize'][0],ry=e['projectionSize'][1],roll=e['rollDegrees']*math.pi/180,
  mode='back' if f['action']=='climb' else 'overhead' if e['raiseFraction']==1 else 'front'))
(root/'src/heroes/imagegen88-registration.js').write_text('''import {heroAnimationCell} from './hero-frames.js?v=imagegen88';
// Exact reviewed86 guide equipment; generated88 art must preserve these anchors.
const shieldCells='''+json.dumps(cells,separators=(',',':'))+''';
export function imagegen88ShieldPose(h,pose,frame=0){
 if(h.id!==2)return null;
 const {cell}=heroAnimationCell({...h,skin:'imagegen88'},pose,frame);
 const q=shieldCells[cell],face=h.face||1;
 return {...q,x:q.x*face,roll:q.roll*face,cell};
}
''')
