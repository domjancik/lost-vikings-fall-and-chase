import {campaignOrder} from '../campaigns/machines/cycle-order.js?v=campaign137';

// Campaigns group stable level IDs; the simulation family owns their mechanics.
export const campaignFamily=campaign=>campaign==='fall'?'cycle':campaign;
export const campaignRoundKey=campaign=>campaign==='fall'?'last-call-fall137-round':campaign==='cycle'?'last-call-cycle52-round':campaign==='story'?'last-call-story46-round':'last-call-round';
export function resumeRound(storage,campaign,count){
 const order=campaignOrder(campaign,count);
 try{
  let saved=storage.getItem(campaignRoundKey(campaign));
  // Older releases stored every machine level together. Migrate only a valid
  // member, and never overwrite a dedicated Fall & Chase save.
  if(saved===null&&campaign==='fall')saved=storage.getItem(campaignRoundKey('cycle'));
  if(saved!==null&&saved.trim()!==''&&order.includes(Number(saved)))return Number(saved);
 }catch{}
 return order[0];
}
