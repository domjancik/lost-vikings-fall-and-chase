// One prepared scenery pixel maps to exactly two world units.
// Choose the exact viewport grid, preserving the established framing.
export function sceneResolution(view){
 const wanted=Math.max(view.width*1.18,view.height*1.5);
 const nativeWidth=Math.ceil(wanted/6)*3,nativeHeight=nativeWidth*2/3;
 return {nativeWidth,nativeHeight,width:nativeWidth*2,height:nativeHeight*2};
}
// Blend within the center pixel's color cluster, never across a strong edge.
// Positive spatial/range weights avoid ringing; enlargement still duplicates.
export function prepareScenePixels(source,sw,sh,dw,dh,{contrastLimit=48,preserveAlpha=false}={}){
 const out=new Uint8ClampedArray(dw*dh*4);
 for(let y=0;y<dh;y++)for(let x=0;x<dw;x++){
  const lx=x*sw/dw,rx=(x+1)*sw/dw,ty=y*sh/dh,by=(y+1)*sh/dh;
  const x0=Math.min(sw-1,Math.ceil(lx)),x1=Math.min(sw,Math.max(x0+1,Math.ceil(rx)));
  const y0=Math.min(sh-1,Math.ceil(ty)),y1=Math.min(sh,Math.max(y0+1,Math.ceil(by)));
  const cx=(lx+rx-1)/2,cy=(ty+by-1)/2;
  const centerX=Math.max(x0,Math.min(x1-1,Math.round(cx))),centerY=Math.max(y0,Math.min(y1-1,Math.round(cy)));
  const center=(centerY*sw+centerX)*4,cr=source[center],cg=source[center+1],cb=source[center+2];
  if(preserveAlpha&&source[center+3]===0)continue;
  let weight=0,r=0,g=0,b=0;
  for(let sy=y0;sy<y1;sy++)for(let sx=x0;sx<x1;sx++){
   const i=(sy*sw+sx)*4,delta=Math.max(Math.abs(source[i]-cr),Math.abs(source[i+1]-cg),Math.abs(source[i+2]-cb));
   if(preserveAlpha&&Math.abs(source[i+3]-source[center+3])>contrastLimit)continue;
   if(delta>contrastLimit)continue;
   const similarity=contrastLimit>0?Math.max(0,1-(delta/contrastLimit)**2)**2:1;
   const spatial=(Math.max(0,1-Math.abs(sx-cx)/Math.max(1,(rx-lx)/2))*Math.max(0,1-Math.abs(sy-cy)/Math.max(1,(by-ty)/2)))+.0001;
   const w=spatial*similarity;weight+=w;r+=source[i]*w;g+=source[i+1]*w;b+=source[i+2]*w;
  }
  const i=(y*dw+x)*4;out[i]=Math.round(r/weight);out[i+1]=Math.round(g/weight);out[i+2]=Math.round(b/weight);out[i+3]=preserveAlpha?source[center+3]:255;
 }
 return out;
}
