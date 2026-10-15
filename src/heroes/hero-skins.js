export const skinOptions=[{id:'current',label:'Reworked Vikings'},{id:'imagegen90',label:'Guided Imagegen · corrected movement'},{id:'imagegen88',label:'Guided Imagegen · previous movement'},{id:'native85',label:'Native motion rework · eight-pose gait'},{id:'imagegen81',label:'Imagegen trial · run/walk'},{id:'reworked70',label:'Earlier reworked Vikings'},{id:'previous',label:'Previous Vikings'},{id:'procedural',label:'Original procedural'}];
export const heroSkin=(skin,id)=>skin==='current'?'imagegen90':skin;
export const normalizeSkin=value=>skinOptions.some(s=>s.id===value)?value:'imagegen90';
export function readSkin(storage){try{return normalizeSkin(storage.getItem('last-call-skin'));}catch{return 'imagegen90';}}
export function saveSkin(storage,value){const skin=normalizeSkin(value);try{storage.setItem('last-call-skin',skin);}catch{}return skin;}
