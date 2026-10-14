export function labelLayout(label,camera,scale,cameraY=0){return {x:(label.x-camera)*scale,y:(label.y-cameraY)*scale,fontSize:Math.max(11,label.size*scale)};}
export function drawLabels(canvas,labels,camera,scale,dpr=1,cameraY=0){
 const width=canvas.clientWidth,height=canvas.clientHeight,g=canvas.getContext('2d');
 const w=Math.round(width*dpr),h=Math.round(height*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
 g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,width,height);g.textAlign='center';g.lineJoin='round';
 const visible=[];
 for(const label of labels){const p=labelLayout(label,camera,scale,cameraY);if(p.x<0||p.x>width||p.y<0||p.y>height)continue;
  g.font=`700 ${p.fontSize}px ui-monospace, monospace`;const textWidth=g.measureText(label.t).width;const x=textWidth<width-16?Math.max(textWidth/2+8,Math.min(width-textWidth/2-8,p.x)):width/2;
  g.lineWidth=3;g.strokeStyle='rgba(5,10,16,.95)';g.strokeText(label.t,x,p.y,width-16);g.fillStyle=label.c;g.fillText(label.t,x,p.y,width-16);visible.push({text:label.t,fontSize:p.fontSize});
 }
 canvas.dataset.labels=JSON.stringify(visible);canvas.dataset.minFont=String(visible.length?Math.min(...visible.map(l=>l.fontSize)):11);
}

