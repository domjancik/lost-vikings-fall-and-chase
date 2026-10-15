const ZOOM_LEVELS=[1,1.5,2];
export function storedZoom(value){const zoom=Number(value);return ZOOM_LEVELS.includes(zoom)?zoom:2;}
export function nextZoom(zoom){return ZOOM_LEVELS[(ZOOM_LEVELS.indexOf(zoom)+1)%ZOOM_LEVELS.length];}
// Use a centered source crop, with one scale factor for both axes.
export function coverRect(sourceWidth,sourceHeight,width,height){
 const scale=Math.max(width/sourceWidth,height/sourceHeight);
 const sw=width/scale,sh=height/scale;
 return {sx:(sourceWidth-sw)/2,sy:(sourceHeight-sh)/2,sw,sh};
}
export function viewportSize(width,height,zoom=1){const worldHeight=Math.round(790/zoom);return {width:Math.round(worldHeight*width/height),height:worldHeight};}
export function drawBackground(ctx,image,x,y,width,height){
 const r=coverRect(image.naturalWidth,image.naturalHeight,width,height);
 ctx.drawImage(image,r.sx,r.sy,r.sw,r.sh,x,y,width,height);
 return r;
}
