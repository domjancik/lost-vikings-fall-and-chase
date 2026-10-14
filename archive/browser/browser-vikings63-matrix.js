async page=>{
 await page.setViewportSize({width:1100,height:1100});await page.goto('http://127.0.0.1:3008/hero-art-preview.html');await page.waitForFunction(()=>window.heroPreviewReady);
 await page.evaluate(async()=>{
  const {drawHeroArt}=await import('./hero-art.js?v=vikings63');const c=document.createElement('canvas');c.id='matrix';c.width=960;c.height=880;
  document.querySelector('#preview').style.display='none';document.querySelector('main').append(c);const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  const rows=['idle','run','climb','rise','fall','hurt','ability','equipment'];
  rows.forEach((row,r)=>{g.fillStyle='#d9c9a9';g.font='14px monospace';g.fillText(row.toUpperCase(),12,r*110+18);
   for(let id=0;id<3;id++){const pose=row==='ability'?['bash','sword','overhead'][id]:row==='equipment'?['bash','bow','float'][id]:row;
    const f=row==='equipment'?2:row==='ability'?3:row==='run'?2:1;
    drawHeroArt(g,{id,face:r%2?-1:1,shield:true,shieldUp:id===2&&(pose==='float'||pose==='overhead')},160+id*320,r*110+58,pose,f,1);
   }
  });
 });
 await page.locator('#matrix').screenshot({path:'output/playwright/vikings63-native-matrix.png'});return {matrix:true};
}
