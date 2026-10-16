export function labelLayout(label,camera,scale,cameraY=0){return {x:(label.x-camera)*scale,y:(label.y-cameraY)*scale,fontSize:Math.max(11,label.size*scale)};}
export function speechLabelLayout(label,camera,scale,view,measure,cameraY=0){
 const p=labelLayout(label,camera,scale,cameraY),padding=Math.max(8,Math.round(8*scale));
 const maxWidth=Math.min(view.width-16,Math.max(180,(label.maxWidth||270)*scale)),inner=maxWidth-padding*2;
 const rows=[];let row='';
 for(const word of label.t.split(/\s+/)){
  const next=row?row+' '+word:word;
  if(measure(next,p.fontSize)<=inner){row=next;continue;}
  if(row)rows.push(row);row='';
  for(const letter of word){if(row&&measure(row+letter,p.fontSize)>inner){rows.push(row);row='';}row+=letter;}
 }
 if(row)rows.push(row);
 const lineHeight=Math.ceil(p.fontSize*1.4),w=Math.ceil(Math.max(...rows.map(t=>measure(t,p.fontSize)),0)+padding*2),h=rows.length*lineHeight+padding*2;
 const x=Math.round(Math.max(8,Math.min(view.width-w-8,p.x-w/2))),gap=Math.max(8,Math.round(10*scale)),top=Math.max(8,(label.insetTop??42)*scale);
 let y=p.y-gap-h;
 if(y<top&&p.y+gap+h<view.height-8)y=p.y+gap;
 y=Math.round(Math.max(top,Math.min(view.height-h-8,y)));
 const lines=rows.map((t,n)=>({text:t,x:x+padding,y:y+padding+p.fontSize+n*lineHeight,width:measure(t,p.fontSize)}));
 return{x,y,w,h,padding,lineHeight,fontSize:p.fontSize,lines,anchor:{x:p.x,y:p.y},tail:{x:Math.max(x+padding,Math.min(x+w-padding,p.x)),y:p.y<y?y:y+h}};
}
export function drawLabels(canvas,labels,camera,scale,dpr=1,cameraY=0){
 const width=canvas.clientWidth,height=canvas.clientHeight,g=canvas.getContext('2d');
 const w=Math.round(width*dpr),h=Math.round(height*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
 g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,width,height);g.textAlign='center';g.lineJoin='round';
 const visible=[];
 for(const label of [...labels].sort((a,b)=>(a.priority||0)-(b.priority||0))){const p=labelLayout(label,camera,scale,cameraY);if(p.x<0||p.x>width||p.y<0||p.y>height)continue;
  if(label.kind==='speech'){
   g.font=`700 ${p.fontSize}px ui-monospace, monospace`;
   const panel=speechLabelLayout(label,camera,scale,{width,height},t=>g.measureText(t).width,cameraY);
   g.save();g.textAlign='left';g.strokeStyle='#b49a73';g.lineWidth=Math.max(1,Math.round(scale));g.beginPath();g.moveTo(panel.tail.x,panel.tail.y);g.lineTo(panel.anchor.x,panel.anchor.y);g.stroke();
   g.fillStyle='#141713ee';g.fillRect(panel.x,panel.y,panel.w,panel.h);g.strokeRect(panel.x,panel.y,panel.w,panel.h);
   g.lineWidth=2;g.strokeStyle='rgba(5,10,16,.95)';g.fillStyle=label.c;
   for(const line of panel.lines){g.strokeText(line.text,line.x,line.y);g.fillText(line.text,line.x,line.y);}g.restore();
   visible.push({text:label.t,priority:label.priority||0,kind:'speech',...panel});continue;
  }
  g.font=`700 ${p.fontSize}px ui-monospace, monospace`;const textWidth=g.measureText(label.t).width;const x=textWidth<width-16?Math.max(textWidth/2+8,Math.min(width-textWidth/2-8,p.x)):width/2;
  g.save();g.translate(x,p.y);g.rotate(label.angle||0);g.lineWidth=3;g.strokeStyle='rgba(5,10,16,.95)';g.strokeText(label.t,0,0,width-16);g.fillStyle=label.c;g.fillText(label.t,0,0,width-16);g.restore();visible.push({text:label.t,fontSize:p.fontSize,priority:label.priority||0});
 }
 canvas.dataset.labels=JSON.stringify(visible);canvas.dataset.minFont=String(visible.length?Math.min(...visible.map(l=>l.fontSize)):11);
}

