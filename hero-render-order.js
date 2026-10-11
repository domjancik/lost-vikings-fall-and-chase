// A raised shield is behind its passengers, so their soles remain visible
// through its central walking plane rather than disappearing at the upper rim.
export function heroDrawOrder(heroes){
 return [...heroes.filter(h=>h.support!==2),...heroes.filter(h=>h.support===2)];
}
