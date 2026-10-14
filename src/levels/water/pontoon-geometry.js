// Water92 broad structural buoy soles are24nativepixels below its deck.
// Four native rows of dark narrowing under-outline may enter the saddle beam.
// A fixed saddle keeps it above the bell crown and fully raised crank rod.
export const WATER_CRADLE_SEAT=800;
export const WATER_CARRIER_HALF=124;
export const WATER_CRADLE_WIDTH=228;
export const WATER_DOCK_DECK=WATER_CRADLE_SEAT-(88-64)*2;
export const waterPontoonDeck=waterY=>Math.min(waterY-12,WATER_DOCK_DECK);
