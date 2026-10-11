export function interactionFrame(kind,pose){
 const row={lever:0,wafer:1,lift:2,archive:3}[kind];
 if(row===undefined)throw Error('Unknown mechanism animation '+kind);
 return row*8+Math.round(Math.max(0,Math.min(1,pose))*7);
}
