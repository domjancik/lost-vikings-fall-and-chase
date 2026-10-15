import {storyLevels} from '../campaigns/story/story-campaign.js?v=orbit113';
import {cycleLevels} from '../campaigns/machines/cycle-campaign.js?v=lode123';
import {levels} from '../campaigns/arcade/levels.js?v=menu95';
export const campaignChoices=[
 {id:'story',name:'The Return Address',levels:storyLevels},
 {id:'cycle',name:'Machine Rooms',levels:cycleLevels},
 {id:'arcade',name:'Arcade Collection',levels}
];
const machineViews=[[540,780],[1030,690],[800,920],[1000,800],[1300,780],[1380,650],[1820,830],[1060,700],[1000,780],[1160,950]];
export function previewFrame(s){
 const [width,height]=s.campaign==='cycle'&&s.round===5?[1120,630]:s.campaign==='cycle'&&[3,8,9].includes(s.round)?[1080,608]:[720,404];
 const top=s.level.worldTop||0,bottom=s.level.worldBottom||790;
 const [cx,cy]=s.campaign==='cycle'?machineViews[s.round]:[700,s.round===5&&s.campaign==='story'?750:470];
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 return{x:Math.floor(clamp(cx-width/2,0,(s.level.worldWidth||1440)-width)/2)*2,y:Math.floor(clamp(cy-height/2,top,bottom-height)/2)*2,width,height};
}
