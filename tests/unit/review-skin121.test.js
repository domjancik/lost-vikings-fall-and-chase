import test from 'node:test';import assert from 'node:assert/strict';
import {reviewUrl,REVIEW_SHEETS} from '../browser/review-skin.mjs';
test('general capture navigation explicitly selects the complete latest sheet set',()=>{
 const url=new URL(reviewUrl('https://game.example/?campaign=cycle&skin=current&release=121'));
 assert.equal(url.searchParams.get('skin'),'imagegen90');assert.equal(url.searchParams.get('campaign'),'cycle');
 assert.ok(REVIEW_SHEETS[2].includes('olaf111'));
 assert.equal(reviewUrl('https://game.example/viking-gallery90.html'),'https://game.example/viking-gallery90.html');
});
