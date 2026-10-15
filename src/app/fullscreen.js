export function fullscreenMode(doc,win){
 if(doc.fullscreenElement||doc.webkitFullscreenElement)return 'fullscreen';
 if(win.navigator?.standalone===true||win.matchMedia?.('(display-mode: standalone)').matches||win.matchMedia?.('(display-mode: fullscreen)').matches)return 'standalone';
 return 'browser';
}
// Call from a real user gesture. Unsupported/rejected requests return an explicit
// install path so the UI can explain Home Screen mode instead of silently doing nothing.
export async function toggleGameFullscreen(doc,win){
 const mode=fullscreenMode(doc,win);if(mode==='standalone')return 'standalone';
 const target=mode==='fullscreen'?doc:doc.documentElement;
 const method=mode==='fullscreen'?(doc.exitFullscreen||doc.webkitExitFullscreen):(target.requestFullscreen||target.webkitRequestFullscreen);
 if(!method)return 'install';
 try{await method.call(target);return mode==='fullscreen'?'exited':'entered';}catch{return 'install';}
}
