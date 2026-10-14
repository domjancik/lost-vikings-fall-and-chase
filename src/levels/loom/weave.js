export const THREAD={shadow:'#66513e',base:'#b49b62',light:'#ead7a0'};
export function weaveReveal(progress){
 // Work only inside the actual selvage, never across transparent atlas padding.
 const passes=Math.max(0,Math.min(1,progress))*18;
 const complete=Math.min(18,Math.floor(passes+1e-9)),direction=complete%2?-1:1;
 const width=complete===18?0:Math.floor((passes-complete)*36+1e-9);
 const x=direction===1?6:42-width,y=80-(complete+1)*4;
 return{completeRows:complete*4,bandHeight:complete===18?0:4,x,y,width,direction,
  needleX:direction===1?6+width:42-width,needleY:80-passes*4};
}
