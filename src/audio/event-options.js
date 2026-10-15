// Room occlusion is authored by the level. Spatial output must multiply it,
// rather than replacing a quiet behind-wall cue with a full-volume sample.
export function worldSoundOptions(event,camera,basePitch=1){
 const pan=(event.x-camera.x)/camera.width*2-1;
 return {pan,id:event.id,pitch:basePitch*(event.pitch??1),volume:(event.volume??1)*(Math.abs(pan)>1?(event.name.startsWith('warden')?.7:.35):1)};
}
