// Debug chapter selection starts with that chapter's canonical archive state.
// Normal continuation conserves the actual carrier through the checkpoint.
export function archiveCheckpoint(s){const h=s.heroes.find(h=>h.inventory.includes('archive'));return {round:s.round+1,carrier:h?.id??(s.machine.archiveMounted&&s.won?2:null),brass:s.round===6&&s.won};}
export function applyArchiveCheckpoint(s,checkpoint){if(s.campaign!=='story'||s.round<5||checkpoint?.round!==s.round)return;for(const h of s.heroes)h.inventory=h.inventory.map(v=>v==='archive'?null:v);if(checkpoint.carrier!==null)s.heroes[checkpoint.carrier].inventory[0]='archive';s.archiveCheckpoint=checkpoint;}
