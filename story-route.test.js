import {test} from 'node:test';import {createState} from './engine.js';import {playStoryRoute} from './story-route.js';
for(const hz of [60,120])for(let round=0;round<8;round++)test('Story chapter '+(round+1)+' clears with normal controls at '+hz+' Hz',()=>{playStoryRoute(createState(round,'story'),hz);});
