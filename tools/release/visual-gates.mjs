const accepted = value => typeof value === 'string' && /^(?:accept|accepted)(?::|$)/.test(value);

// Support the two existing review schemas without rewriting historical receipts.
export function validateVisualGates(gate, file = 'visual-gates.json') {
  const fail = reason => { throw Error(`Visual review incomplete: ${file}: ${reason}`); };
  if (gate?.publicationAllowed !== true) fail('publication is not approved');
  if ('sourceGate' in gate || 'runtimeGate' in gate) {
    if (!accepted(gate.sourceGate?.verdict)) fail('source review must be accepted');
    if (!accepted(gate.runtimeGate?.verdict)) fail('runtime review must be accepted');
  } else {
    for (const name of ['erik', 'baleog', 'olaf']) {
      if (!accepted(gate[name]?.sourceGate)) fail(`${name} source review must be accepted`);
      if (!accepted(gate[name]?.processedRuntimeGate)) fail(`${name} runtime review must be accepted`);
    }
  }
  if ('cooperationGate' in gate && !accepted(gate.cooperationGate?.verdict)) {
    fail('cooperation review must be accepted');
  }
}
