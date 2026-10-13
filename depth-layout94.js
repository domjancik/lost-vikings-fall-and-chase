const placements=[
 [[220,940,0],[720,940,1],[1830,940,1],[1120,1120,0],[2460,1120,1],[590,500,1],[1090,390,2],[1540,260,1],[2310,260,0]],
 [[90,900,0],[1030,900,1],[1790,900,0],[2530,900,1],[860,390,2],[1270,700,1],[2400,460,0],[2720,460,1]],
 [[150,1120,1],[640,1120,0],[1470,1120,1],[2150,1120,0],[3020,1120,1],[140,720,2],[2500,508,1],[2800,508,2]],
 [[120,800,1],[340,800,0],[1000,650,1],[1350,650,2],[730,1260,0],[1650,1260,1],[2120,1260,2],[2490,920,0],[3160,530,1]],
 [[220,540,1],[460,1000,1],[1210,1000,0],[1450,1000,1],[2050,1000,2],[2180,540,1]],
 [[200,940,1],[720,760,2],[980,940,0],[2070,940,1],[2420,500,0],[2620,500,2],[460,1120,0],[2320,1120,1],[2760,1120,2]]
];
const types=['cycle','refraction','momentum','clockwork','water','warden'];
const depth=(theme,y)=>theme===0?(y===1120?80:64):theme===1?120:theme===2?160:theme===3?140:theme===4?(y===1000?120:20):(y===1120?80:140);
export function depthPlan(s){
 const theme=types.indexOf(s.level.mechanic);if(theme<0)return{theme,props:[],walls:[]};
 const surfaces=[...s.level.floors,...s.level.platforms];
 const props=placements[theme].map(([x,floorY,kind])=>{
  const support=surfaces.find(p=>p.y===floorY&&x-64>=p.x&&x+64<=p.x+p.w);
  if(!support)throw Error(`Decorative fixture lacks support: ${theme}/${x}/${floorY}`);
  return{x,floorY,kind,support};
 });
 const walls=[];
 for(const floor of s.level.floors){const d=depth(theme,floor.y);if(d<48||floor.w<256)continue;
  const count=Math.min(3,Math.ceil(floor.w/1000));
  for(let n=0;n<count;n++){const w=Math.min(240,floor.w-32),x=Math.round((floor.x+(floor.w-w)*(n+.5)/count)/2)*2;
   walls.push({x,y:floor.y+24,w,h:Math.min(64,d-32),support:{...floor,depth:d}});
  }
 }
 return{theme,props,walls};
}
