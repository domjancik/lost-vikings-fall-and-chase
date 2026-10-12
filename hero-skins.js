export const skinOptions=[{id:'current',label:'Reworked Vikings'},{id:'imagegen81',label:'Imagegen trial · run/walk'},{id:'previous',label:'Previous Vikings'},{id:'procedural',label:'Original procedural'}];
export const normalizeSkin=value=>skinOptions.some(s=>s.id===value)?value:'current';
export function readSkin(storage){try{return normalizeSkin(storage.getItem('last-call-skin'));}catch{return 'current';}}
export function saveSkin(storage,value){const skin=normalizeSkin(value);try{storage.setItem('last-call-skin',skin);}catch{}return skin;}
