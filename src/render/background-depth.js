import {farSceneY} from './vertical-parallax.js?v=vertical65';
// Complete object silhouettes replace approximate geometric background masks.
export const depthScenes=[
 {name:'pub back wall',height:480,farHeight:405,groundY:312,openings:4,farSource:'assets/pixel/depth-far-0.png',nearSource:'assets/pixel/depth-near-0.png'},
 {name:'orbital station and planet',height:405,groundY:324,openings:6,farSource:'assets/pixel/depth-far-1.png',nearSource:'assets/pixel/depth-near-1.png'},
 {name:'distant pinball citadel',height:405,groundY:316,openings:1,farSource:'assets/pixel/depth-far-2.png',nearSource:'assets/pixel/depth-near-2.png'},
 {name:'moon and haunted castle',height:405,groundY:335,openings:3,farSource:'assets/pixel/depth-far-3.png',nearSource:'assets/pixel/depth-near-3.png'},
 {name:'sunset harbor and skyline',height:405,groundY:280,openings:1,farSource:'assets/pixel/depth-far-4.png',nearSource:'assets/pixel/depth-near-4.png'},
 {name:'volcanic castle and dragons',height:405,groundY:405,openings:4,farSource:'assets/pixel/depth-far-5.png',nearSource:'assets/pixel/depth-near-5.png'},
 {name:'Big Ben and London',height:360,groundY:348,openings:4,farSource:'assets/pixel/depth-far-6.png',nearSource:'assets/pixel/depth-near-6.png'},
 {name:'moonlit museum skyline',height:360,groundY:314,openings:1,farSource:'assets/pixel/depth-far-7.png',nearSource:'assets/pixel/depth-near-7.png'},
 {name:'neon casino skyline',height:360,groundY:359,openings:1,farSource:'assets/pixel/depth-far-8.png',nearSource:'assets/pixel/depth-near-8.png'},
 {name:'sky observatory',height:720,groundY:720,openings:1,farSource:'assets/pixel/depth-far-9.png',nearSource:'assets/pixel/depth-near-9.png'},
 {name:'abyssal organ',height:720,groundY:720,openings:1,farSource:'assets/pixel/depth-far-10.png',nearSource:'assets/pixel/depth-near-10.png'}
];
export function depthLayout(round,camera,view){const scene=depthScenes[round],width=Math.max(1440,Math.ceil(view.width/1440)*1440),scale=width/720,center=view.width>1440?(view.width-width)/2:0;
 const height=round>=9?1440:790,vertical=farSceneY(camera.y,view.height,height,round>=9?-650:0,790);
 return {far:{layer:0,name:scene.name,speed:.12,verticalSpeed:vertical.verticalSpeed,x:Math.round((center-Math.max(0,camera.x)*.12)/2)*2,y:vertical.y-camera.y,width,height},near:{layer:1,name:'original interior',speed:.72,verticalSpeed:1,x:Math.round((center-Math.max(0,camera.x)*.72)/2)*2,y:610-scene.groundY*scale-camera.y,width,height:scene.height*scale,ground:610}};
}
