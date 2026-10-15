import {snapPixel} from '../../render/pixel-grid.js';
export const SHOE_RACK={x:48,w:256,h:192,sole:89,shelf:49};
export function shoeRackPlan(s){
 const floor=s.level.mechanic==='orbit'?1000:1260,rack={...SHOE_RACK,y:floor-SHOE_RACK.sole*2},shelfY=rack.y+SHOE_RACK.shelf*2;
 const stock=[],loose=[];
 for(const item of s.items){if(item.type!=='magneticShoes')continue;
  const stocked=/^(?:magnetic-shoes-|lode-shoes-)[012]$/.test(item.id),sole=27;
  const art={id:item.id,itemX:item.x,itemY:item.y,x:snapPixel(item.x-32),y:stocked?shelfY-sole*2:snapPixel(item.y+44)-sole*2,w:64,h:64,sole};
  (stocked?stock:loose).push(art);
 }
 return{floor,rack,shelfY,stock,loose};
}
