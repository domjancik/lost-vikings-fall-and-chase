// Reviewed transparent cavities in the generated96px bells. Shared by physics
// and art so an invisible air volume cannot extend through opaque side walls.
export function waterBellPocket(x,floor,mobile=false){
 return {x:x-96+(mobile?34:35)*2,y:floor-(mobile?180:184)+44*2,w:56,h:72};
}
