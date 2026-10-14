import test from 'node:test';import assert from 'node:assert/strict';
test('front shield face occludes the gripping hand instead of being painted behind it',async()=>{
 const oldImage=globalThis.Image,oldDocument=globalThis.document;
 globalThis.Image=class{constructor(){this.complete=true;this.naturalWidth=512;}set src(v){queueMicrotask(()=>this.onload());}};
 globalThis.document={createElement:()=>({getContext:()=>({drawImage(){},getImageData:()=>({data:new Uint8ClampedArray(14*24*4).fill(255)})})})};
 try{const {whenHeroesReady,drawHeroArt}=await import('../../src/heroes/hero-art.js');await whenHeroesReady();const paint=[];
 const ctx={save(){},restore(){},translate(){},scale(){},drawImage(){paint.push('body');},fillRect(){paint.push('shield');}};
 drawHeroArt(ctx,{id:2,face:1,shieldUp:false,shield:true},0,0,'idle',0);
 assert.ok(paint.includes('body')&&paint.includes('shield'));assert.equal(paint[0],'body');assert.equal(paint.at(-1),'shield');
 }finally{globalThis.Image=oldImage;globalThis.document=oldDocument;}
});
