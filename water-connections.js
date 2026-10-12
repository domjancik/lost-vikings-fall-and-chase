export function waterCompressorHose(outlet,crown){
 // Route around the cradle, then approach the bell from beneath its roof.
 // Each bend remains valid even when the two devices change relative height.
 const outside=crown.x+160,under=Math.max(outlet.y+40,crown.y+32);
 return [[outlet.x,outlet.y],[outside,outlet.y],[outside,under],[crown.x,under],[crown.x,crown.y]];
}
