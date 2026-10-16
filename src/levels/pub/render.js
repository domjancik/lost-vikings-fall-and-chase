import {drawAlehallHearth} from './hearth.js?v=pub139';
import {cupFactoryScene,cupFactoryFrame} from './cup-factory.js?v=pub139';
import {createAtlas} from '../../render/sprite-atlas.js';
import {snapPixel as q} from '../../render/pixel-grid.js';
import {alehallSag,alehallBerthSteps} from './campaign.js?v=pub143';
import {ALEHALL_DELIVERY_X,ALEHALL_LOFT} from './layout.js?v=pub143';
const architecture=createAtlas('assets/alehall135/architecture-native.png',4,4);
const props=createAtlas('assets/alehall135/props-native.png',4,4);
const patrons=createAtlas('assets/alehall135/patrons-native.png',4,4);
const globe=createAtlas('assets/alehall135/globe-native.png',2,2);
const coast=new Image();coast.src='assets/alehall135/coast-native.png';
const cup=new Image();cup.src='assets/alehall135/cup-native.png';
const ready=i=>i.complete&&i.naturalWidth>0;
const visible=(x,w,c,v)=>x+w>=c.x&&x<=c.x+v.width;
function sprite(c,atlas,n,x,bottom,cell=64){return atlas.drawGrounded(c,n,{x:q(x-cell),y:bottom-cell*2,w:cell*2,h:cell*2},[{x:-10000,y:bottom,w:20000}]);}
function crop(c,atlas,n,sx,sy,w,h,x,y){if(!ready(atlas.image))return;const cell=atlas.image.width/4;c.drawImage(atlas.image,n%4*cell+sx,Math.floor(n/4)*cell+sy,w,h,q(x),q(y),w*2,h*2);}
function beam(c,x,y,w){for(let n=x;n<x+w;n+=96)crop(c,architecture,5,7,24,48,18,n,y);}
function column(c,x,top,bottom){sprite(c,architecture,4,x,bottom);for(let y=bottom-110;y>top;y-=48)crop(c,architecture,4,26,24,12,24,x-12,y-48);}
function fire(c,time,x,y,scale=1){for(let n=0;n<14;n++){const age=(time*(.8+n%3*.17)+n*.127)%1,xx=q(x+Math.sin(n*2.4+age*3)*12*scale),yy=q(y-age*(18+n%5*4)*scale);c.fillStyle=['#ab522b','#d58a3b','#e7bc6a','#f0dba3'][n%4];c.fillRect(xx,yy,q(4*scale)||2,q((7-age*5)*scale)||2);}for(let n=0;n<8;n++){const age=(time*.17+n*.13)%1;c.fillStyle=`rgba(116,109,94,${(1-age)*.13})`;c.fillRect(q(x+Math.sin(n+age*4)*12),q(y-35-age*120),8,8);}}
function roomWalls(c,camera,view){
 c.save();c.beginPath();c.rect(512,400,1888,360);c.rect(516,656,58,104);c.rect(1192,534,66,38);c.rect(1512,534,66,38);c.clip('evenodd');c.fillStyle='#35291e';c.fillRect(512,400,1888,360);
 for(let x=512;x<2400;x+=96)if(visible(x,96,camera,view))for(let y=400;y<760;y+=112)crop(c,architecture,0,8,4,48,56,x,y);
 c.restore();
 for(const x of [512,928,1344,2380])if(visible(x-32,64,camera,view))column(c,x,406,760);
 // Atlas padding separates rafters, not the roof envelope. One intentional
 // smoke opening sits above the hearth; the remaining roof is continuous.
 c.save();c.beginPath();c.rect(512,352,1888,128);c.rect(1144,352,52,36);c.clip('evenodd');c.fillStyle='#24231e';c.fillRect(512,352,1888,128);c.restore();
 for(let x=512;x<2400;x+=128)if(visible(x,128,camera,view))crop(c,architecture,2,0,0,64,64,x,352);
 beam(c,512,448,1888);for(const x of [1224,1544])sprite(c,architecture,7,x,594);
 sprite(c,architecture,6,544,760);sprite(c,architecture,6,1744,760);sprite(c,architecture,13,1330,640);sprite(c,architecture,14,1010,642);
}
function terrain(c,s,camera,view){const g=s.machine,hole=g.phase==='crack'||g.phase==='fall';
 c.save();if(hole){c.beginPath();c.rect(0,760,1990,490);c.rect(2260,760,140,490);c.clip();}c.fillStyle='#382b20';c.fillRect(0,760,2400,490);
 for(let x=Math.max(0,Math.floor(camera.x/124)*124);x<Math.min(2400,camera.x+view.width+124);x+=124){
  for(let y=788;y<Math.min(1250,camera.y+view.height+64);y+=64){crop(c,architecture,9,14,20,32,32,x,y);crop(c,architecture,9,14,20,32,32,x+64,y);}
  crop(c,architecture,8,2,2,62,14,x,760);
 }
 c.restore();if(hole){c.save();c.beginPath();c.rect(1990,760,270,490);c.clip();c.fillStyle='#141714';c.fillRect(1990,760,270,490);for(let y=780;y<1250;y+=112)for(const x of [1980,2220])crop(c,architecture,3,6,2,56,56,x,y);c.restore();
  for(let n=0;n<9;n++){const x=1990+n*30,t=g.fallTime,fall=g.phase==='fall',y=760+(fall?40*t+625*t*t:alehallSag(s,x+15));c.save();c.translate(q(x+15),q(y));c.rotate(Math.round((fall?(n-4)*t*.33:Math.cos((x-1990)/270*Math.PI)*g.bend*.01)*20)/20);crop(c,architecture,15,16,0,15,12,-15,0);c.restore();}
  if(g.phase==='fall')for(let n=0;n<32;n++){const t=g.fallTime,x=1990+(n*47)%270+(n%2?1:-1)*t*25,y=760+t*(30+n%7*12)+625*t*t;c.fillStyle=n%3?'#796044':'#b29162';c.fillRect(q(x),q(y),n%2?2:4,2);}
 }
}
const globeFrame=s=>cupFactoryFrame(s);
function globeBottom(s){return 734+(s.machine.phase==='fall'?40*s.machine.fallTime+625*s.machine.fallTime**2:alehallSag(s,2120));}
function drawGlobe(c,s){return sprite(c,globe,globeFrame(s),2120,globeBottom(s),48);}
// Cups in flight cross in front of bodies; cups that reached the tabletop
// belong to the room behind them. Keep a serving attempt's departure fixed.
export function alehallCupPoses(s){const o=s.heroes[2],cups=s.machine.cups,mode=cups.mode,age=s.time-cups.at,poses=[];
 for(let n=0;n<3;n++){let x=o.x-16+n*16,y=o.y-36,alpha=1,pass='overlay';
  if(mode==='loading'){const t=Math.max(0,Math.min(1,(age-n*.12)/.45));x=1040+(x-1040)*t;y=704+(y-704)*t-Math.sin(t*Math.PI)*18;}
  else if(mode==='serving'){const t=Math.max(0,Math.min(1,(age-n*.08)/.45)),from=cups.from||o;x=from.x-16+n*16;y=from.y-36;x+=(1374+n*16-x)*t;y+=(722-y)*t-Math.sin(t*Math.PI)*12;if(t===1)pass='world';}
  else if(mode==='served'){x=1374+n*16;y=722;pass='world';}
  else if(mode==='spilled'&&age<.65){const from=cups.from||o;x=from.x-16+n*16+age*(n-1)*24;y=from.y-36+625*age*age;alpha=1-age/.65;}
  else if(mode!=='carried')continue;
  poses.push({x,y,alpha,pass});
 }return poses;
}
function drawCups(c,s,pass){if(!ready(cup))return;for(const pose of alehallCupPoses(s)){if(pose.pass!==pass)continue;c.save();c.globalAlpha=pose.alpha;c.drawImage(cup,q(pose.x-cup.width),q(pose.y-cup.height*2),cup.width*2,cup.height*2);c.restore();}}
function drawFactoryCups(c,s){if(!ready(cup))return;const scene=cupFactoryScene(s);for(const p of [...scene.pile,...scene.flying]){c.save();c.translate(q(p.x),q(p.bottom-p.height/2));c.rotate(p.phase==='throw'?Math.round(p.angle*24)/24:p.angle);c.drawImage(cup,-6,-8,16,16);c.restore();}}
function drawPracticeTarget(c,s){const g=s.machine,sway=q(Math.sin(s.time*7)*g.targetPose*3),lean=g.bashPose||0;c.save();c.translate(164,760);c.rotate(Math.round(-lean*.3*24)/24);sprite(c,props,3,sway,0);c.restore();}
function drawPracticeCups(c,s){if(!ready(cup))return;for(const p of s.shots){if(p.kind!=='hall-cup')continue;c.save();c.translate(q(p.x),q(p.y));c.rotate(Math.round((p.spin||0)*24)/24);c.drawImage(cup,-cup.width,-cup.height,cup.width*2,cup.height*2);c.restore();}}
export function drawAlehallBerth(c){return alehallBerthSteps.map(step=>{
 // These are solid timber loading blocks, not narrow rails with transparent
 // air below them. Their opaque silhouette is the same volume bodies climb.
 c.save();c.beginPath();c.rect(step.x,step.y,step.w,760-step.y);c.clip();c.fillStyle='#44301f';c.fillRect(step.x,step.y,step.w,760-step.y);
 for(let y=step.y+4;y<760;y+=36)for(let x=step.x;x<step.x+step.w;x+=24)crop(c,architecture,5,20,24,Math.min(12,(step.x+step.w-x)/2),18,x,y);
 for(let x=step.x;x<step.x+step.w;x+=24)crop(c,architecture,8,20,2,Math.min(12,(step.x+step.w-x)/2),5,x,step.y);
 c.fillStyle='#9b7449';c.fillRect(step.x,step.y,step.w,2);c.fillStyle='#302419';c.fillRect(step.x+step.w-2,step.y+2,2,758-step.y);c.restore();
 return {...step,bottom:760,opaque:true,kind:'loading-berth'};
});}
export function drawAlehallWorld(c,s,camera,view){const g=s.machine,contacts=[];c.imageSmoothingEnabled=false;c.fillStyle='#47575c';c.fillRect(camera.x,camera.y,view.width,view.height);
 const far={x:q(camera.x*.82-120),y:q(310+camera.y*.35),w:768,h:384};if(ready(coast))c.drawImage(coast,far.x,far.y,far.w,far.h);
 for(let n=0;n<36;n++){const x=q((n*71-s.time*24+20000)%540),y=q(420+(n*39+s.time*180)%340);c.fillStyle='#a0b0ae66';c.fillRect(x,y,2,8);}
 roomWalls(c,camera,view);terrain(c,s,camera,view);
 const berthTreads=drawAlehallBerth(c);
 // Loft deck is attached to posts that continue to the walking floor.
 for(const x of [ALEHALL_LOFT.x+8,ALEHALL_LOFT.x+ALEHALL_LOFT.w-12])column(c,x,ALEHALL_LOFT.y,760);
 for(let x=ALEHALL_LOFT.x;x<ALEHALL_LOFT.x+ALEHALL_LOFT.w;x+=128)crop(c,architecture,10,0,20,Math.min(64,(ALEHALL_LOFT.x+ALEHALL_LOFT.w-x)/2),ALEHALL_LOFT.h/2,x,ALEHALL_LOFT.y);
 sprite(c,architecture,11,1170,760);const hearth=drawAlehallHearth(c,s,camera,view);
 sprite(c,props,1,1040,760);sprite(c,props,10,1020,710);
 for(const [row,x,phase]of [[0,1040,.1],[1,1350,1.7],[1,1460,3.2],[2,1620,2.3],[3,960,4.4]]){
  let frame=row===0?(g.cups.mode==='loading'?Math.min(3,Math.floor((s.time-g.cups.at)*4)):Math.floor((s.time+phase)/3)%4):Math.floor(s.time*(row===3?3:1.2)+phase)%4;
  if(x===1460&&g.defense?.phase==='windup')frame=Math.min(3,Math.floor(Math.max(0,s.time-g.defense.at)/1.2*4));
  else if(x===1460&&g.defense?.phase==='flight')frame=3;
  const p=sprite(c,patrons,row*4+frame,x,760,56);if(p)contacts.push({kind:'patron',row,x,bottom:p.visibleBottom});
 }
 sprite(c,props,1,1390,760);drawCups(c,s,'world');sprite(c,props,2,1290,760);sprite(c,props,11,620,760);
 beam(c,116,704,96);
 // The straw backstop and fenced empty lane keep shots away from inhabitants.
 for(const x of [120,220])column(c,x,650,760);
 // The target face is in front of its fence/backstop, never behind a plank.
 drawPracticeTarget(c,s);
 sprite(c,props,g.wrapPose<.5?6:7,ALEHALL_DELIVERY_X,760);
 if(g.wrapPose>0&&g.wrapPose<1){c.save();c.globalAlpha=1-g.wrapPose;sprite(c,props,14,ALEHALL_DELIVERY_X+q(g.wrapPose*18),760+q(g.wrapPose*20));c.restore();}
 if(ready(props.image)){c.save();c.translate(1708,646);c.scale(Math.max(.06,1-g.door.pose),1);props.draw(c,4,-28,0,128,128);c.restore();}
 for(const item of s.items)if(item.type==='hallKey')sprite(c,props,9,item.x,item.y+44);
 // Back room: quiet storage, a single candle and the impossible find on its stool.
 sprite(c,props,12,1850,730);sprite(c,props,2,2120,globeBottom(s)+26);drawGlobe(c,s);drawFactoryCups(c,s);
 contacts.push({kind:'cart',...sprite(c,props,0,g.cart.x,760),top:g.cart.y});
 return {ready:[architecture.image,props.image,patrons.image,globe.image,coast,cup].every(ready),mechanic:'alehall',contacts,berthTreads,far,hearth,factory:cupFactoryScene(s),phase:g.phase,globe:{frame:globeFrame(s),bottom:globeBottom(s),diameter:40},door:g.door.pose,nativePixel:2};
}
let darkness;
export function drawAlehallOverlay(c,s,camera,view,text=()=>{}){if(s.level.mechanic!=='alehall')return null;const g=s.machine,mode=g.cups.mode;
 drawCups(c,s,'overlay');
 drawPracticeCups(c,s);
 darkness??=document.createElement('canvas');const w=Math.ceil(view.width/2),h=Math.ceil(view.height/2);if(darkness.width!==w||darkness.height!==h){darkness.width=w;darkness.height=h;}const d=darkness.getContext('2d');d.clearRect(0,0,w,h);d.globalCompositeOperation='source-over';d.fillStyle='rgba(8,11,13,.9)';d.fillRect(0,0,w,h);d.globalCompositeOperation='destination-out';
 for(const light of [{x:1850,y:702,r:125,light:.8},{x:2120,y:globeBottom(s)-28,r:310,light:.96}]){const x=(light.x-camera.x)/2,y=(light.y-camera.y)/2,r=light.r/2,a=d.createRadialGradient(x,y,0,x,y,r);a.addColorStop(0,`rgba(0,0,0,${light.light})`);a.addColorStop(1,'rgba(0,0,0,0)');d.fillStyle=a;d.fillRect(x-r,y-r,r*2,r*2);}
 c.save();c.beginPath();c.rect(1774,390,626,860);c.clip();c.drawImage(darkness,camera.x,camera.y,w*2,h*2);c.restore();fire(c,s.time,1850,704,.35);
 if(g.dialogue&&s.time<g.dialogue.until){const words=(g.dialogue.speaker+': '+g.dialogue.text).split(' '),lines=[''];for(const word of words){if(lines.at(-1).length+word.length>39)lines.push(word);else lines[lines.length-1]+=(lines.at(-1)?' ':'')+word;}const x=g.phase==='play'?g.dialogue.x:2120,y=g.phase==='play'?650:Math.min(630,s.heroes[0].y-90);lines.forEach((line,n)=>text(line,x,y+n*17,'#e4d7b7',10,0,100));}
 return {phase:g.phase,cups:mode,darkRoom:true,readbacks:0};
}
