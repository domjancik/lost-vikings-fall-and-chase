const hands=[[64,57],[59,63],[47,66],[35,62],[37,52],[46,42],[53,37],[62,42]];
export function swimMotion(frame){
 const n=((frame%8)+8)%8,a=n*Math.PI/4,bob=Math.round(Math.sin(a)*.65);
 const limb=(near)=>{const p=hands[(n+(near?0:4))%8],hand=[p[0],p[1]+bob],shoulder=[46,(near?54:52)+bob],elbow=joint(shoulder,hand,10,1);return{shoulder,elbow,hand};};
 const leg=(near)=>{const hip=[36,(near?59:56)+bob],foot=[22,(near?60:57)+Math.round(Math.sin(a)*(near?4:-4))+bob];return{hip,knee:joint(hip,foot,9,-1),foot};};
 return{near:limb(true),far:limb(false),bob,
  nearLeg:leg(true),farLeg:leg(false)};
}
// Equal-length two-bone chains. Float joints retain exact anatomy; only the
// native painter rounds their raster positions, never limb length or anchors.
function joint(a,b,length,bend){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy),rise=Math.sqrt(Math.max(0,length*length-d*d/4));return[(a[0]+b[0])/2-dy/d*rise*bend,(a[1]+b[1])/2+dx/d*rise*bend];}
