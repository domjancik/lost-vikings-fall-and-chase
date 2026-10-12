// The reviewed compressor underside is28nativepixels below its walking deck.
// A fixed saddle keeps it above the bell crown and fully raised crank rod.
export const WATER_CRADLE_SEAT=800;
export const WATER_CARRIER_HALF=124;
export const WATER_CRADLE_WIDTH=228;
export const WATER_DOCK_DECK=WATER_CRADLE_SEAT-(92-64)*2;
export const waterPontoonDeck=waterY=>Math.min(waterY-12,WATER_DOCK_DECK);
