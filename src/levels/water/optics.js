import {WATER_BASIN} from './campaign.js?v=orbit116';
const grid = v => Math.ceil(v / 2) * 2;
export const waterFlowPhase = (y,time) => ((Math.floor(y/4-time*24)%7)+7)%7;

// World-space strips on the two-unit native grid. Neither destination nor
// source samples cross a bank, viewport edge, surface or dry bell interior.
export function waterRefractionBands(surface,pockets,time,view) {
  const left=grid(Math.max(WATER_BASIN.left,view.x));
  const right=Math.floor(Math.min(WATER_BASIN.right,view.x+view.width)/2)*2;
  const top=grid(Math.max(surface,view.y));
  const bottom=Math.floor(Math.min(WATER_BASIN.bottom,view.y+view.height)/2)*2;
  const bands=[];
  for(let y=top;y<bottom;y+=4){
    const h=Math.min(4,bottom-y),offset=2*Math.round(Math.sin(y*.045-time*2.3)*1.5+Math.sin(y*.017+time*1.1));
    let spans=[[left,right]];
    for(const p of pockets){
      if(y>=p.y+p.h||y+h<=p.y)continue;
      spans=spans.flatMap(([a,b])=>p.x>=b||p.x+p.w<=a?[[a,b]]:
        [[a,Math.max(a,Math.floor(p.x/2)*2)],[Math.min(b,grid(p.x+p.w)),b]]);
    }
    for(const [a,b]of spans){
      const w=b-a-Math.abs(offset);if(w<=0)continue;
      bands.push({x:a+Math.max(0,-offset),sourceX:a+Math.max(0,offset),y,w,h});
    }
  }
  return bands;
}
