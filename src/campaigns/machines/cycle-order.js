// Stable IDs are save/debug/API identities. This list alone controls presentation
// and progression, so inserting a chapter never changes an existing level ID.
const fallOrder=[11,10,4,2,3,7,5,8,9,0];
export function campaignOrder(campaign,count){
 const natural=Array.from({length:count},(_,i)=>i);
 return campaign==='fall'?fallOrder.filter(id=>id<count):campaign==='cycle'?natural.filter(id=>!fallOrder.includes(id)):natural;
}
export function campaignPosition(campaign,round,count){return campaignOrder(campaign,count).indexOf(round);}
export function campaignNext(campaign,round,count,wrap=true){
 const order=campaignOrder(campaign,count),index=order.indexOf(round);
 return order[index+1]??(wrap?order[0]:null);
}
export function campaignPrevious(campaign,round,count){
 const order=campaignOrder(campaign,count);return order[order.indexOf(round)-1]??null;
}
