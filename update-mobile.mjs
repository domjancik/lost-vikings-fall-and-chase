import fs from 'node:fs';
let html=fs.readFileSync('index.html','utf8').replace('width=device-width,initial-scale=1','width=device-width,initial-scale=1,viewport-fit=cover');
html=html.replace('<button id="pause"','<button id="fullscreen" aria-label="Enter fullscreen" title="Fullscreen">⛶</button><button id="pause"');
html=html.replace('<div class="mobile-controls">','<div class="mobile-controls" aria-label="Touch controls">').replace('data-key="left"','aria-label="Move left" data-key="left"').replace('data-key="right"','aria-label="Move right" data-key="right"');
fs.writeFileSync('index.html',html);
fs.appendFileSync('style.css',`
/* Immersive game layout, with safe areas for phone notches. */
html,body{width:100%;height:100%;overflow:hidden;overscroll-behavior:none;touch-action:none}
body>header,.intro,footer,.controls>span,.game-top small,.game-bottom b,.hero-card .role,.hero-card .ability,.hero-card .selected{display:none}
main{padding:0;margin:0;max-width:none;width:100%;height:100dvh}
.game-shell{position:fixed;inset:0;border:0;border-radius:0;box-shadow:none;background:#111822}
.viewport{position:absolute;inset:0;aspect-ratio:auto;background:#111822}
#game{width:100%;height:100%;object-fit:fill}
.game-top{position:absolute;z-index:6;top:max(10px,env(safe-area-inset-top));left:max(12px,env(safe-area-inset-left));right:max(12px,env(safe-area-inset-right));height:44px;border:1px solid #70815b66;border-radius:10px;background:#142019da;backdrop-filter:blur(8px);padding:0 12px;pointer-events:auto}
.game-top>div{gap:8px}.game-top button{min-width:40px;min-height:40px}
.game-bottom{position:absolute;z-index:5;top:calc(max(10px,env(safe-area-inset-top)) + 52px);left:max(12px,env(safe-area-inset-left));right:max(12px,env(safe-area-inset-right));background:transparent;padding:0;min-height:32px;gap:10px;pointer-events:none;text-shadow:0 2px 3px #000}
.game-bottom>span{max-width:70%;font-size:11px}.game-bottom button{pointer-events:auto;background:#142019da;border:1px solid #70815b66;border-radius:8px;padding:10px;font-size:9px}
.below{position:fixed;z-index:6;top:calc(max(10px,env(safe-area-inset-top)) + 94px);left:max(12px,env(safe-area-inset-left));pointer-events:none}
.crew{display:flex;gap:6px;margin:0}.hero-card{pointer-events:auto;background:#142019cc;border-radius:8px;padding:5px 9px;gap:5px;min-height:44px;border-color:#70815b66;backdrop-filter:blur(6px)}
.hero-card.active{background:#354829de}.hero-card canvas{width:30px;height:34px;background:transparent}.hero-name{font-size:10px;gap:5px}.hero-name kbd{display:none}.controls{margin-top:6px}.controls button{pointer-events:auto;margin:0;background:#142019cc;padding:7px 10px;border-radius:6px;font-size:10px}
.mobile-controls{position:fixed;z-index:7;display:grid;grid-template-columns:64px 64px 1fr 70px 70px 70px;align-items:end;gap:10px;left:max(16px,env(safe-area-inset-left));right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));margin:0;pointer-events:none;touch-action:none}
.mobile-controls button{pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none;height:64px;padding:0;border-radius:50%;border:1px solid #c2d89680;background:#18251dd9;box-shadow:0 3px 0 #0008;color:#edf5d8;font-size:11px;font-weight:700;backdrop-filter:blur(6px)}
.mobile-controls button[data-key=right]{grid-column:2}.mobile-controls button[data-key=jump]{grid-column:4;background:#3b512fdd}.mobile-controls button:active,.mobile-controls button.held{background:#d5ef83;color:#132014;transform:translateY(2px)}
.start-overlay{z-index:10;padding:max(30px,env(safe-area-inset-left));background:linear-gradient(90deg,#101611ed,#10161192 65%,#10161144)}
.ticket{max-width:520px}.ticket h2{font-size:clamp(38px,7vw,80px)}.ticket p{font-size:14px}.ticket button{min-height:52px;font-size:12px}.ticket small{display:block;font-size:9px}
.toast{z-index:8;bottom:110px;max-width:85%;font-size:12px}.win{z-index:11}dialog{z-index:20;max-height:85dvh;overflow:auto;touch-action:pan-y}
@media(max-width:600px) and (orientation:portrait){.game-top>span{font-size:9px}.game-top>div{gap:0}.game-top #timer{display:none}.game-bottom>span{font-size:10px}.hero-card{padding:5px 7px}.hero-card canvas{width:25px}.mobile-controls{grid-template-columns:52px 52px 1fr 55px 55px 55px;gap:5px;left:10px;right:10px}.mobile-controls button{height:55px;font-size:9px}.ticket p{font-size:12px}.toast{bottom:94px;font-size:11px}}
@media(max-height:500px){.below{top:68px}.game-bottom{top:65px;left:auto;width:46%}.game-bottom>span{font-size:9px}.controls{display:none}.hero-card{min-height:38px}.hero-card canvas{height:28px;width:25px}.mobile-controls{bottom:max(8px,env(safe-area-inset-bottom));grid-template-columns:54px 54px 1fr 55px 55px 55px}.mobile-controls button{height:52px;font-size:9px}.toast{bottom:72px;font-size:10px}.ticket h2{font-size:38px;margin:10px 0}.ticket p{font-size:11px}.ticket button{margin-top:0;min-height:44px}.ticket small{display:none}}
`);
let js=fs.readFileSync('game.js','utf8');
js=js.replace('function draw(){','function draw(){\n const sceneHeight=790;const viewWidth=Math.min(W,sceneHeight*canvas.clientWidth/canvas.clientHeight);if(canvas.width!==Math.round(viewWidth)||canvas.height!==sceneHeight){canvas.width=Math.round(viewWidth);canvas.height=sceneHeight;ctx.imageSmoothingEnabled=false;}const camera=Math.max(0,Math.min(W-viewWidth,s.heroes[s.active].x-viewWidth/2));ctx.clearRect(0,0,canvas.width,sceneHeight);ctx.save();ctx.translate(-camera,0);canvas.dataset.activeHero=String(s.active);');
js=js.replace('ctx.drawImage(art,0,0,W,H)','ctx.drawImage(art,0,0,W,790)');
js=js.replace("text('PAUSED',720,310","text('PAUSED',camera+viewWidth/2,310").replace("text('ESC / Ⅱ TO RESUME',720,345","text('ESC / Ⅱ TO RESUME',camera+viewWidth/2,345");
js=js.replace("text('ESC / Ⅱ TO RESUME',camera+viewWidth/2,345,'#d9ddc8',12);}\n}","text('ESC / Ⅱ TO RESUME',camera+viewWidth/2,345,'#d9ddc8',12);}\n ctx.restore();\n}");
js=js.replace("function play(){started=true;","function play(){document.documentElement.requestFullscreen?.().catch(()=>{});started=true;");
js=js.replace("document.querySelector('#pause').onclick", "document.querySelector('#fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>toast('Fullscreen is managed by your browser. The game still fills the window.'));};\ndocument.querySelector('#pause').onclick");
js=js.replace("keys[el.dataset.key]=true;pulse[el.dataset.key]=true;","keys[el.dataset.key]=true;pulse[el.dataset.key]=true;el.classList.add('held');");
js=js.replace("['pointerup','pointercancel']","['pointerup','pointercancel','lostpointercapture']").replace("()=>keys[el.dataset.key]=false","()=>{keys[el.dataset.key]=false;el.classList.remove('held');}");
fs.writeFileSync('game.js',js);
console.log('Fullscreen and touch overlay updated.');
