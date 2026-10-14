export const ORBIT_ART={
 pixel:2,plate:{native:[192,96],pivot:[96,48],body:[10,36,182,60],flat:[18,36,174],raster:256},
 parts:{cell:[64,64],hookStem:[32,3],hookGrip:[32,44],hookTip:56,panelBase:60,rope:[31,32],ropeSpan:[14,50]},
 gear:{native:[256,256],pivot:[128,128],pitch:114,teeth:16},
 background:{native:[768,512],world:[1536,1024],foundation:450}
};
const q=n=>Math.round(n/2)*2;
export function plateArtPlacement(p){return{x:q(p.x-256),y:q(p.y-256),w:512,h:512,pivot:[q(p.x),q(p.y)]};}
export function hookArtPlacement(k){return{x:q(k.x-64),y:q(k.y-88),w:128,h:128,stemX:q(k.x),stemY:q(k.y-82),tipY:q(k.y+24)};}
export function orbitPlaneOffsets(camera){return{far:{x:q(camera.x*.82),y:q(100+camera.y*.6),factorX:.82,factorY:.6},middle:{x:q(camera.x*.26),y:q(156+camera.y*.025),factorX:.26,factorY:.025}};}
export function orbitGearPlan(time){const d=ORBIT_ART.gear.pitch*4,a=time*.06;return[{x:768,y:360,angle:a},{x:768+d,y:360,angle:-a+Math.PI/16},{x:768+d,y:360+d,angle:a}];}
export function orbitSupportPlan(level){
 const result=[],surfaces=[...level.floors,...level.platforms];
 for(const floor of surfaces.filter(f=>f.y<1180))for(const x of [floor.x+24,floor.x+floor.w-24]){
  const below=surfaces.filter(f=>f.y>floor.y&&x>=f.x&&x<=f.x+f.w).sort((a,b)=>a.y-b.y)[0];
  if(below)result.push({kind:'pier',x,top:floor.y+48,bottom:below.y});
 }return result;
}
export const ORBIT_ROOMS=[{x:0,y:780,w:520,h:220,floorY:1000},{x:1690,y:440,w:250,h:210,floorY:650},{x:3340,y:100,w:220,h:200,floorY:300}];
export function orbitConnectionRoutes(hook,rope,first={x:1360,y:626}){return[
 [[1742,588],[1940,588],[1940,120],[2080,120]],
 [[first.x,first.y+36],[first.x,first.y+108],[first.x+70,first.y+108],[first.x+70,first.y-8],[first.x+18,first.y-8]],
 [[3180,rope.y-36],[3180,154],[3340,154],[3340,202]],
 [[q(hook.x),120],[q(hook.x),hookArtPlacement(hook).stemY]]
];}
