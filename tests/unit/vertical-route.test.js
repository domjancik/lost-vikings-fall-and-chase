import {test} from 'node:test';import {createState} from '../../src/core/engine.js';import {playVerticalRoute} from '../routes/vertical-route.js';
for(const hz of [60,120])for(const round of [9,10])test('vertical round '+round+' completes using normal controls, both shield riders and all crew alive at '+hz+' Hz',()=>playVerticalRoute(createState(round),hz));
