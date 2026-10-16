// Fixed world planes are rasterized once at the game's native 2-world-unit
// pixel grid. Only the camera's source rectangle is copied on subsequent frames.
export function nativeSceneCrop(camera,view,width,height){
 const x=Math.max(0,Math.floor(camera.x/2)*2),y=Math.max(0,Math.floor(camera.y/2)*2);
 const right=Math.min(width,Math.ceil((camera.x+view.width)/2)*2),bottom=Math.min(height,Math.ceil((camera.y+view.height)/2)*2);
 if(right<=x||bottom<=y)return null;
 return {sx:x/2,sy:y/2,sw:(right-x)/2,sh:(bottom-y)/2,x,y,w:right-x,h:bottom-y};
}
export function createNativeSceneCache({width,height,limit=4,createCanvas=()=>document.createElement('canvas')}){
 const entries=new Map();let builds=0;
 return {get size(){return entries.size;},get builds(){return builds;},draw(ctx,key,camera,view,ready,paint){
  if(!ready)return paint(ctx);
  let entry=entries.get(key);
  if(!entry){
   const image=createCanvas();image.width=Math.ceil(width/2);image.height=Math.ceil(height/2);
   const c=image.getContext('2d');c.imageSmoothingEnabled=false;c.setTransform(.5,0,0,.5,0,0);
   entry={image,info:paint(c)};entries.set(key,entry);builds++;
   if(entries.size>limit)entries.delete(entries.keys().next().value);
  }else{entries.delete(key);entries.set(key,entry);}
  const p=nativeSceneCrop(camera,view,width,height);
  if(p)ctx.drawImage(entry.image,p.sx,p.sy,p.sw,p.sh,p.x,p.y,p.w,p.h);
  return entry.info;
 }};
}
