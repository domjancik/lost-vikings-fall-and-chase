import {shoeRackPlan} from './shoe-rack-layout.js?v=shoes124';
const load=name=>{const i=new Image();i.src='assets/shoes124/'+name+'-native.png?v=shoes124';return i;};
const rack=load('rack'),boots=load('boots');
export const shoeRackReady=()=>[rack,boots].every(i=>i.complete&&i.naturalWidth>0);
export function drawShoeRack(c,s){const p=shoeRackPlan(s);c.imageSmoothingEnabled=false;
 if(rack.complete&&rack.naturalWidth)c.drawImage(rack,p.rack.x,p.rack.y,p.rack.w,p.rack.h);
 if(boots.complete&&boots.naturalWidth)for(const item of [...p.stock,...p.loose])c.drawImage(boots,item.x,item.y,item.w,item.h);
 return{kind:'magnetic-equipment-rack',ready:shoeRackReady(),...p};
}
