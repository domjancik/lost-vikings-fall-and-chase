import {depthPlan} from './depth-layout94.js?v=depth94';
import {snapPixel as q} from './pixel-grid.js?v=depth94';
const sheets=['a','b'].map(name=>{const i=new Image();i.src='assets/depth94/'+name+'-native.png';return i;});
export const depthReady=()=>sheets.every(i=>i.naturalWidth>0);
function atlas(theme){return{image:sheets[Math.floor(theme/3)],row:theme%3};}
function cell(c,theme,kind,x,y){const {image,row}=atlas(theme);if(!image.naturalWidth)return;c.imageSmoothingEnabled=false;c.drawImage(image,kind*64,row*64,64,64,q(x),q(y),128,128);}
function wallTile(c,theme,x,y){const {image,row}=atlas(theme);if(!image.naturalWidth)return;c.imageSmoothingEnabled=false;c.drawImage(image,197,row*64+10,54,52,q(x),q(y),108,104);}
export function drawDepthMidground(c,s){
 const plan=depthPlan(s);if(plan.theme<0)return plan;
 for(const p of plan.props){
  if(p.kind===2){wallTile(c,plan.theme,p.x-54,p.floorY-104);cell(c,plan.theme,2,p.x-64,p.floorY-144);}
  else cell(c,plan.theme,p.kind,p.x-64,p.floorY-124);
 }
 return{...plan,ready:depthReady()};
}
export function drawDepthWallFaces(c,s){
 const plan=depthPlan(s);if(plan.theme<0)return;
 for(const w of plan.walls){c.save();c.beginPath();c.rect(w.x,w.y,w.w,w.h);c.clip();
  for(let x=w.x;x<w.x+w.w;x+=108)wallTile(c,plan.theme,x,w.y);
  c.restore();
 }
}
