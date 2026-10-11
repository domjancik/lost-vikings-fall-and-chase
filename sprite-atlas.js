import {snapPixel} from './pixel-grid.js?v=arc46';
export function cellBounds(data,width,height,cols,rows,n){const x0=Math.floor(n%cols*width/cols),y0=Math.floor(Math.floor(n/cols)*height/rows),x1=Math.floor((n%cols+1)*width/cols),y1=Math.floor((Math.floor(n/cols)+1)*height/rows);let left=x1,right=x0-1,top=y1,bottom=y0-1;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(data[(y*width+x)*4+3]>=128){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 return right<left?null:{x:left,y:top,w:right-left+1,h:bottom-top+1};
}
export function createAtlas(src,cols,rows,trim=false){const image=new Image(),cells=[],feet=[];image.onload=()=>{const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0);const data=g.getImageData(0,0,c.width,c.height).data;for(let n=0;n<cols*rows;n++){if(trim)cells[n]=cellBounds(data,c.width,c.height,cols,rows,n);feet[n]=cellFoot(data,c.width,c.height,cols,rows,n);}};image.src=src;return {image,placement(n,rect,surfaces){return groundedPlacement(rect,feet[n],surfaces);},drawGrounded(ctx,n,rect,surfaces){const p=groundedPlacement(rect,feet[n],surfaces);if(p){const cw=image.width/cols,ch=image.height/rows;ctx.drawImage(image,n%cols*cw,Math.floor(n/cols)*ch,cw,ch,p.x,p.y,p.w,p.h);}return p;},draw(ctx,n,x,y,w,h){if(!image.complete||!image.naturalWidth)return;const cw=image.width/cols,ch=image.height/rows,p=trim?cells[n]:{x:n%cols*cw,y:Math.floor(n/cols)*ch,w:cw,h:ch};if(p)ctx.drawImage(image,p.x,p.y,p.w,p.h,snapPixel(x),snapPixel(y),snapPixel(w),snapPixel(h));}};}
export function cellFoot(data,width,height,cols,rows,n){
 const x0=Math.floor(n%cols*width/cols),y0=Math.floor(Math.floor(n/cols)*height/rows),x1=Math.floor((n%cols+1)*width/cols),y1=Math.floor((Math.floor(n/cols)+1)*height/rows);
 const minimum=Math.max(2,Math.ceil((x1-x0)*.08));
 for(let y=y1-1;y>=y0;y--){let count=0;for(let x=x0;x<x1;x++)if(data[(y*width+x)*4+3]>=128)count++;if(count>=minimum)return {bottom:y-y0+1,cellHeight:y1-y0};}
 return null;
}
export function groundedPlacement(rect,foot,surfaces){
 if(!foot)return null;
 const center=rect.x+rect.w/2,surface=surfaces.filter(p=>center>=p.x&&center<=p.x+p.w&&p.y>=rect.y).sort((a,b)=>a.y-b.y)[0];
 if(!surface)return null;
 const y=snapPixel(surface.y-foot.bottom/foot.cellHeight*snapPixel(rect.h));
 return {...rect,x:snapPixel(rect.x),y,w:snapPixel(rect.w),h:snapPixel(rect.h),visibleBottom:y+foot.bottom/foot.cellHeight*snapPixel(rect.h),surface};
}
