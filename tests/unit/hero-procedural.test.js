import test from 'node:test';import assert from 'node:assert/strict';
test('procedural skin draws all heroes and action poses without loading image sheets',async()=>{
 const oldImage=globalThis.Image,oldDocument=globalThis.document,paint=[];
 globalThis.Image=class{constructor(){throw Error('Procedural skin must not require sprite images');}};
 const context=()=>new Proxy({}, {get:(o,k)=>k in o?o[k]:(...args)=>{if(k==='fillRect')assert.ok(args.every(Number.isFinite));if(k==='drawImage')paint.push(args);}});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:context})};
 try{const {drawHeroArt,setHeroSkin}=await import('../../src/heroes/hero-art.js');setHeroSkin('procedural');
 for(const id of [0,1,2])for(const pose of ['idle','run','climb','rise','fall','land','hurt',...(id===0?['bash']:id===1?['sword','bow']:['overhead','float','shield-raise','shield-lower'])]){
  drawHeroArt(context(),{id,face:-1,shield:true,shieldUp:pose==='overhead'||pose==='float'},20,30,pose,0);
 }
 assert.equal(paint.length,28);assert.ok(paint.every(args=>args[0].width===112));
 setHeroSkin('current');
 }finally{globalThis.Image=oldImage;globalThis.document=oldDocument;}
});
