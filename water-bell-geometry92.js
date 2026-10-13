// Reviewed transparent interior rectangles of Water92 bells.
export function waterBellPocket(x,floor,mobile=false){
 return {x:x-96+(mobile?37:36)*2,y:floor-(mobile?180:184)+44*2,w:mobile?44:52,h:72};
}
