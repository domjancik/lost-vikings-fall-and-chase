import {itemTypes} from './inventory.js?v=arc46';
export function hintPreference(value){return value==='on';}
export function worldLabels(draw,getHints){const labels=(...args)=>{if(getHints())draw(...args);};labels.status=draw;labels.clue=draw;Object.defineProperty(labels,'enabled',{get:getHints});return labels;}
const neutral={flour:'Bag of flour.',spice:'Jar of dragon spice.',dough:'Prepared dough.',ticket:'Bronze ticket.',lamp:'UV lamp.',red:'Red optical lens.',blue:'Blue optical lens.',key:'Neon key.'};
export function itemDescription(type,hints){const item=itemTypes[type];return hints||item.heal||type==='bomb'?item.description:neutral[type]||item.name;}
