import {build} from './manifest.mjs';

const result = await build();
console.log(`Static game built to dist (${result.files.length} explicit files)`);
