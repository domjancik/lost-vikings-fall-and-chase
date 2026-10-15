import test from 'node:test';
import assert from 'node:assert/strict';
import {validateVisualGates} from '../../tools/release/visual-gates.mjs';

test('richness review requires an accepted aesthetic verdict and latest-character evidence',()=>{
 const gate={publicationAllowed:true,reviewVersion:2,sourceGate:{verdict:'accepted'},runtimeGate:{verdict:'accepted'}};
 assert.throws(()=>validateVisualGates(gate));
 assert.throws(()=>validateVisualGates({...gate,aestheticGate:{verdict:'rejected'},captureSkin:'imagegen90'}));
 assert.throws(()=>validateVisualGates({...gate,aestheticGate:{verdict:'accepted'},captureSkin:'current'}));
 assert.doesNotThrow(()=>validateVisualGates({...gate,aestheticGate:{verdict:'accepted'},captureSkin:'imagegen90'}));
});

test('publication requires accepted source and runtime reviews', () => {
  for (const verdict of ['accept', 'accepted']) {
    assert.doesNotThrow(() => validateVisualGates({publicationAllowed: true,
      sourceGate: {verdict}, runtimeGate: {verdict}}));
  }
  for (const verdict of [undefined, 'pending', 'rejected']) {
    assert.throws(() => validateVisualGates({publicationAllowed: true,
      sourceGate: {verdict}, runtimeGate: {verdict: 'accepted'}}));
    assert.throws(() => validateVisualGates({publicationAllowed: true,
      sourceGate: {verdict: 'accepted'}, runtimeGate: {verdict}}));
  }
  assert.throws(() => validateVisualGates({publicationAllowed: true}));
  assert.throws(() => validateVisualGates({publicationAllowed: false,
    sourceGate: {verdict: 'accepted'}, runtimeGate: {verdict: 'accepted'}}));
});

test('cooperation review must pass when present', () => {
  const gate = {publicationAllowed: true, sourceGate: {verdict: 'accepted'},
    runtimeGate: {verdict: 'accepted'}};
  assert.doesNotThrow(() => validateVisualGates({...gate, cooperationGate: {verdict: 'accept'}}));
  assert.throws(() => validateVisualGates({...gate, cooperationGate: {verdict: 'pending'}}));
});

test('legacy character records require both reviews for every Viking', () => {
  const accepted = {sourceGate: 'accepted: native poses', processedRuntimeGate: 'accepted: in-game'};
  const gate = {publicationAllowed: true, erik: {...accepted}, baleog: {...accepted}, olaf: {...accepted}};
  assert.doesNotThrow(() => validateVisualGates(gate));
  assert.throws(() => validateVisualGates({...gate, erik: {...accepted, processedRuntimeGate: 'pending'}}));
  assert.throws(() => validateVisualGates({...gate, olaf: undefined}));
});
