import {campaignChoices} from './campaign-picker.js?v=menu95';
import {levelPreview} from './level-preview.js?v=walls101';
export function campaignMenu(host,{campaign,onLevel}){
 const nav=document.createElement('nav'),grid=document.createElement('div');
 nav.className='campaign-choices';nav.setAttribute('aria-label','Campaigns');grid.className='level-grid';
 const buttons=campaignChoices.map(choice=>{
  const button=document.createElement('button');button.type='button';button.dataset.campaignOption=choice.id;button.textContent=choice.name;
  button.onclick=()=>show(choice.id);nav.append(button);return button;
 });
 host.replaceChildren(nav,grid);
 function show(id){
  const choice=campaignChoices.find(c=>c.id===id);host.dataset.campaign=id;
  buttons.forEach(button=>{const selected=button.dataset.campaignOption===id;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});
  grid.setAttribute('aria-label',choice.name+' levels');
  grid.replaceChildren(...choice.levels.map((level,round)=>{
   const button=document.createElement('button');button.type='button';button.className='round-option level-card';button.dataset.round=round;button.dataset.campaign=id;
   button.setAttribute('aria-label',String(round+1)+'. '+level.name);const preview=levelPreview(id,round);
   // Cached frames are copied so both title and in-game pickers can show them.
   const picture=document.createElement('canvas');picture.width=preview.canvas.width;picture.height=preview.canvas.height;picture.setAttribute('aria-hidden','true');
   function copy(){picture.getContext('2d').drawImage(preview.canvas,0,0);if(preview.ready){picture.dataset.ready='true';return;}if(preview.failed){picture.dataset.ready='failed';return;}if(picture.isConnected)setTimeout(copy,120);}
   const caption=document.createElement('span'),number=document.createElement('b'),name=document.createElement('span');
   number.textContent=String(round+1).padStart(2,'0');name.textContent=level.name;caption.append(number,name);button.append(picture,caption);
   button.onclick=()=>onLevel(id,round);setTimeout(copy,0);return button;
  }));
 }
 show(campaign);return{show};
}
