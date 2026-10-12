export const skinOptions=[{id:'current',label:'Reworked Vikings'},{id:'previous',label:'Previous Vikings'}];
export const normalizeSkin=value=>skinOptions.some(s=>s.id===value)?value:'current';
export function readSkin(storage){try{return normalizeSkin(storage.getItem('last-call-skin'));}catch{return 'current';}}
export function saveSkin(storage,value){const skin=normalizeSkin(value);try{storage.setItem('last-call-skin',skin);}catch{}return skin;}
