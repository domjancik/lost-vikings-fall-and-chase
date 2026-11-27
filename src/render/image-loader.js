// Preserve image identity across retries so atlas users and render caches see
// the recovered source. A transient fetch failure must not hide art for a run.
const states=new WeakMap(),pending=new Set();
const retryDelays=[250,750,1500,3000];

globalThis.addEventListener?.('online',()=>{
 for(const state of pending){state.attempt=0;state.request();}
});

export function loadImage(src){
 const image=new Image();
 let resolve;
 const state={ready:false,attempt:0,timer:null,promise:new Promise(done=>{resolve=done;}),request(){
  clearTimeout(state.timer);
  state.attempt++;
  if(state.attempt===1){image.src=src;return;}
  const url=new URL(image.src);
  url.searchParams.set('__asset_retry',String(state.attempt));
  image.src=url.href;
 }};
 states.set(image,state);pending.add(state);
 image.addEventListener('load',()=>{
  if(!image.complete||!image.naturalWidth)return;
  state.ready=true;clearTimeout(state.timer);pending.delete(state);resolve(image);
 });
 image.addEventListener('error',()=>{
  state.ready=false;
  const delay=retryDelays[state.attempt-1];
  if(delay!==undefined)state.timer=setTimeout(state.request,delay);
 });
 state.request();
 return image;
}

export function imageReady(image){
 if(!image)return false;
 const state=states.get(image);
 if(state)return state.ready&&image.complete&&image.naturalWidth>0;
 return 'naturalWidth' in image?image.complete&&image.naturalWidth>0:image.width>0&&image.height>0;
}

export function whenImageReady(image){return states.get(image).promise;}
