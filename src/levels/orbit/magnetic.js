import {motionProfiles} from '../../core/movement.js?v=orbit113';
const TAU=Math.PI*2;
const caps=new Map();
function capTable(rx,ry){
 const key=rx+':'+ry;if(caps.has(key))return caps.get(key);const rows=[{a:-Math.PI/2,u:0}],count=128,da=Math.PI/count,speed=a=>Math.hypot(rx*Math.sin(a),ry*Math.cos(a));let u=0;
 for(let n=1;n<=count;n++){const a=-Math.PI/2+(n-1)*da,b=a+da;u+=da*(speed(a)+4*speed((a+b)/2)+speed(b))/6;rows.push({a:b,u});}
 const table={rows,length:u};caps.set(key,table);return table;
}
function capAngle(table,u){const rows=table.rows;let lo=0,hi=rows.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(rows[mid].u<u)lo=mid;else hi=mid;}const a=rows[lo],b=rows[hi];return a.a+(b.a-a.a)*(u-a.u)/(b.u-a.u);}
function capArc(table,a){const rows=table.rows,index=Math.max(0,Math.min(rows.length-2,Math.floor((a+Math.PI/2)/Math.PI*(rows.length-1)))),p=rows[index],q=rows[index+1];return p.u+(q.u-p.u)*(a-p.a)/(q.a-p.a);}
export const railLength=p=>{const rx=p.capRx??p.h/2;return 2*(p.w-2*rx)+2*capTable(rx,p.h/2).length;};
export function railContact(p,u){
 const rx=p.capRx??p.h/2,ry=p.h/2,l=p.w-2*rx,cap=capTable(rx,ry),half=cap.length,total=railLength(p);u=((u%total)+total)%total;let x,y,tx,ty;
 if(u<l){x=-l/2+u;y=-ry;tx=1;ty=0;}
 else if(u<l+half){const a=capAngle(cap,u-l);x=l/2+Math.cos(a)*rx;y=Math.sin(a)*ry;tx=-Math.sin(a)*rx;ty=Math.cos(a)*ry;}
 else if(u<2*l+half){x=l/2-(u-l-half);y=ry;tx=-1;ty=0;}
 else{const a=capAngle(cap,u-2*l-half)+Math.PI;x=-l/2+Math.cos(a)*rx;y=Math.sin(a)*ry;tx=-Math.sin(a)*rx;ty=Math.cos(a)*ry;}
 const length=Math.hypot(tx,ty);tx/=length;ty/=length;
 const c=Math.cos(p.angle),s=Math.sin(p.angle),tX=tx*c-ty*s,tY=tx*s+ty*c;
 return{x:p.x+x*c-y*s,y:p.y+x*s+y*c,tx:tX,ty:tY,nx:tY,ny:-tX};
}
export function nearestRail(p,x,y){
 const c=Math.cos(p.angle),s=Math.sin(p.angle),lx=(x-p.x)*c+(y-p.y)*s,ly=-(x-p.x)*s+(y-p.y)*c,rx=p.capRx??p.h/2,ry=p.h/2,l=p.w-2*rx,cap=capTable(rx,ry),half=cap.length;let u;
 if(lx>=-l/2&&lx<=l/2)u=ly<=0?lx+l/2:l+half+l/2-lx;
 else if(lx>l/2){let a=Math.atan2(ly/ry,(lx-l/2)/rx);a=Math.max(-Math.PI/2,Math.min(Math.PI/2,a));u=l+capArc(cap,a);}
 else{let a=Math.atan2(ly/ry,(lx+l/2)/rx);if(a<Math.PI/2)a+=TAU;u=2*l+half+capArc(cap,a-Math.PI);}
 const q=railContact(p,u);return{u,distance:Math.hypot(q.x-x,q.y-y),...q};
}
export function magneticPoint(h,p,dt=0){
 const q=railContact(p,h.magnet.u);let angle=Math.atan2(q.ty,q.tx);const old=h.rotation??angle;while(angle-old>Math.PI)angle-=TAU;while(angle-old<-Math.PI)angle+=TAU;
 if(h.magnet.attaching){const delta=angle-old;if(dt>0)angle=old+Math.sign(delta)*Math.min(Math.abs(delta),6*dt);else angle=old;if(Math.abs(delta)<.02)h.magnet.attaching=false;}
 const nx=Math.sin(angle),ny=-Math.cos(angle);h.rotation=angle;h.magnetSole={x:q.x,y:q.y};h.magnetNormal={x:nx,y:ny};h.x=q.x+nx*22;h.y=q.y+ny*22-22;h.ground=true;h.support='orbit-'+p.id;h.vy=0;
}
export function detachMagnet(h,p,jump=false){
 const q=railContact(p,h.magnet.u);h.magnet=null;h.detachTime=.35;h.ground=false;h.support=null;h.vx=q.tx*(h.magV||0)+(p.vx||0)+(jump?q.nx*570:0);h.vy=q.ty*(h.magV||0)+(p.vy||0)+(jump?q.ny*570:0);h.magV=0;
}
export function recoverFreeRotation(h,dt){
 if(h.magnet)return;const angle=h.rotation||0,target=Math.round(angle/TAU)*TAU,remaining=target-angle,next=angle+Math.sign(remaining)*Math.min(Math.abs(remaining),6*dt);
 if(Math.abs(next-target)<1e-6){h.rotation=0;h.magnetSole=null;h.magnetNormal=null;return;}
 h.rotation=next;const nx=Math.sin(next),ny=-Math.cos(next);h.magnetSole={x:h.x-nx*22,y:h.y+22-ny*22};h.magnetNormal={x:nx,y:ny};
}
export function magneticMotion(s,input,dt){
 const attached=[];
 for(const h of s.heroes){h.detachTime=Math.max(0,(h.detachTime||0)-dt);if(h.boots&&!h.inventory.includes('magneticShoes'))h.boots=false;const p=s.machine.plates.find(p=>p.id===h.magnet?.plateId);
  if(h.magnet&&(!h.boots||!h.inventory.includes('magneticShoes')||h.dead)){if(p)detachMagnet(h,p);else h.magnet=null;}
  if(h.magnet&&h.id===s.active&&input.jump&&h.id===0){detachMagnet(h,p,true);continue;}
  if(!h.magnet&&h.boots&&h.inventory.includes('magneticShoes')&&!h.detachTime&&!h.dead){for(const plate of s.machine.plates){const q=nearestRail(plate,h.x,h.y+44);if(q.distance<6&&h.vy>=-20){h.magnet={plateId:plate.id,u:q.u,attaching:true};h.magV=0;break;}}}
  if(h.magnet){const plate=s.machine.plates.find(p=>p.id===h.magnet.plateId),profile=motionProfiles[h.id],dir=h.id===s.active?Number(!!input.right)-Number(!!input.left):0;
   const old=h.magV||0,target=dir*profile.speed,change=(dir?profile.accel:profile.brake)*dt;h.magV=old+Math.sign(target-old)*Math.min(Math.abs(target-old),change);const travel=(old+h.magV)*.5*dt;h.magnet.u+=travel;h.walk=(h.walk||0)+Math.abs(travel)/9;if(dir)h.face=dir;h.moveX=0;attached.push(h);magneticPoint(h,plate,dt);
  }
 }
 return attached;
}
export function localHeroPoint(h,x,y){const a=h.rotation||0,c=Math.cos(a),s=Math.sin(a),sole=h.magnetSole||{x:h.x,y:h.y+44};return{x:sole.x+x*c-y*s,y:sole.y+x*s+y*c};}
