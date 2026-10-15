import fs from 'node:fs';
export const REVIEW_SKIN='imagegen90';
export const REVIEW_SHEETS=['assets/vikings90/erik-native.png','assets/vikings90/baleog-native.png','assets/olaf111/olaf-native.png'];
export function reviewUrl(value){const url=new URL(value);if(url.pathname==='/'||url.pathname.endsWith('/index.html'))url.searchParams.set('skin',REVIEW_SKIN);return url.href;}
const installed=new WeakSet();
export async function reviewNavigate(page,url,...options){
 if(!installed.has(page)){
  installed.add(page);await page.addInitScript(skin=>localStorage.setItem('last-call-skin',skin),REVIEW_SKIN);
  const capture=page.screenshot.bind(page);
  page.screenshot=async options=>{
   const game=page.locator('#game');let evidence={skin:REVIEW_SKIN,sheets:REVIEW_SHEETS,url:page.url(),viewport:page.viewportSize()};
   if(await game.count()){
    await page.waitForFunction(()=>{const c=document.querySelector('#game');return !c?.dataset.heroes||JSON.parse(c.dataset.heroArt||'{}').ready;});
    const heroes=await game.evaluate(c=>JSON.parse(c.dataset.heroes||'[]'));
    if(heroes.length&&heroes.some(h=>h.skin!=='imagegen90'))throw Error('Review screenshot has a mixed/legacy Viking set');
    evidence={...evidence,resolvedHeroes:heroes.map(h=>({id:h.id,skin:h.skin})),ready:true};
   }
   const result=await capture(options);if(options?.path)fs.writeFileSync(options.path+'.review.json',JSON.stringify(evidence,null,2));return result;
  };
 }
 return page.goto(reviewUrl(url),...options);
}
