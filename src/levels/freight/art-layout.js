// Contacts measured from accepted native sources; one native pixel=2world units.
export const FREIGHT_ART={machines:{3:60,4:61,5:61,6:61,7:61,12:53,13:53,14:53},
 inspector:{pivot:24,soles:[48,48,48,48,44,44,44,46]},
 cart:{deck:[32,56,128],sole:96,wheels:[[47,85],[145,85]],hub:[96,72]},
 background:{native:[768,512],world:[1536,1024],middleFoundation:374}};
export function inspectorArtFrame(e){return e.hp<=0?7:e.phase==='aim'?5:e.phase==='fire'?6:e.phase==='recover'?4:Math.floor(e.walk/13)%4;}
