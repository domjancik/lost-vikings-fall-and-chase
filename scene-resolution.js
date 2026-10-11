// One prepared scenery pixel maps to exactly two world units.
// Choose the exact viewport grid, preserving the established framing.
export function sceneResolution(view){
 const wanted=Math.max(view.width*1.18,view.height*1.5);
 const nativeWidth=Math.ceil(wanted/6)*3,nativeHeight=nativeWidth*2/3;
 return {nativeWidth,nativeHeight,width:nativeWidth*2,height:nativeHeight*2};
}
// Positive center weights cannot extrapolate beyond source-cell colors.
// Larger display grids duplicate original samples rather than invent detail.
export function prepareScenePixels(source,sw,sh,dw,dh){
 const out=new Uint8ClampedArray(dw*dh*4);
 for(let y=0;y<dh;y++)for(let x=0;x<dw;x++){
  const lx=x*sw/dw,rx=(x+1)*sw/dw,ty=y*sh/dh,by=(y+1)*sh/dh;
  const x0=Math.min(sw-1,Math.ceil(lx)),x1=Math.min(sw,Math.max(x0+1,Math.ceil(rx)));
  const y0=Math.min(sh-1,Math.ceil(ty)),y1=Math.min(sh,Math.max(y0+1,Math.ceil(by)));
  const cx=(lx+rx-1)/2,cy=(ty+by-1)/2;let weight=0,r=0,g=0,b=0;
  for(let sy=y0;sy<y1;sy++)for(let sx=x0;sx<x1;sx++){
   const w=(Math.max(0,1-Math.abs(sx-cx)/Math.max(1,(rx-lx)/2))*Math.max(0,1-Math.abs(sy-cy)/Math.max(1,(by-ty)/2)))+.0001;
   const i=(sy*sw+sx)*4;weight+=w;r+=source[i]*w;g+=source[i+1]*w;b+=source[i+2]*w;
  }
  const i=(y*dw+x)*4;out[i]=Math.round(r/weight);out[i+1]=Math.round(g/weight);out[i+2]=Math.round(b/weight);out[i+3]=255;
 }
 return out;
}
