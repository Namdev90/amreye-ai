import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8').replaceAll('\r\n', '\n');
const runtime = read('../android/app/src/main/assets/offline-runtime.js');
function section(name) {
  const start = `// BEGIN ${name}\n`, end = `// END ${name}`;
  assert.ok(runtime.includes(start) && runtime.includes(end), `Missing ${name} test boundary`);
  return runtime.split(start)[1].split(end)[0].trim();
}
const embedded = section('CANONICAL SYNTHETIC MODEL');
const exportSource = section('SYNTHETIC EXPORT');
const fragmentContext = vm.createContext({});
vm.runInContext(`${section('OFFLINE FRAGMENT ROUTES')}\nglobalThis.resolve = resolveOfflineFragment;`, fragmentContext);
const resolveFragment = fragmentContext.resolve;
const modelContext = vm.createContext({ structuredClone });
vm.runInContext(`${embedded}\nglobalThis.model = { initialReview, reviewReducer, captureReport, reportCsv };`, modelContext);
const { initialReview, reviewReducer, captureReport, reportCsv } = modelContext.model;
const at = '2026-09-20T12:00:00.000Z';
const act = (state, action) => reviewReducer(state, { at, ...action });
function completed(scenario = 'clean') {
  let state = act(initialReview(), { type: 'scenario', value: scenario });
  state = act(state, { type: 'run' });
  return act(state, { type: 'complete', generation: state.generation });
}
function correct(state, code, mm, reason = 'Synthetic boundary adjustment') {
  state = act(state, { type: 'draft', code, patch: { mm: String(mm), reason } });
  return act(state, { type: 'apply', code });
}

test('every actual offline section and its existing aliases retain section navigation', () => {
  const html = read('../android/app/src/main/assets/index.html');
  const routes = [...html.matchAll(/class="app-section[^\"]*" data-route="([^\"]+)"/g)].map(match => match[1]);
  assert.equal(routes.length, 9);
  for (const route of routes) {
    assert.equal(resolveFragment(`#${route}`).kind, 'section');
    assert.equal(resolveFragment(`#${route}`).route, route);
  }
  for (const [alias, route] of [['home', 'hub'], ['apex', 'research'], ['library', 'research'], ['console', 'demo'], ['analysis-workbench', 'demo'], ['project-story', 'story']]) {
    assert.equal(resolveFragment(`#${alias}`).route, route);
  }
});

test('concept links resolve to library searches while skip and citation anchors remain distinct', () => {
  for (const [fragment, query] of Object.entries({ pathways: 'collaboration', references: 'reference', business: 'business', network: 'surveillance', roadmap: 'validation', 'project-progress': 'development' })) {
    assert.equal(resolveFragment(`#${fragment}`).kind, 'library');
    assert.equal(resolveFragment(`#${fragment}`).query, query);
  }
  assert.equal(resolveFragment('#main-content').kind, 'skip');
  for (const fragment of ['#offline-source-WHO2024', '#unknown-anchor', '#__proto__', '#constructor']) {
    assert.equal(resolveFragment(fragment).kind, 'anchor');
  }
});

test('the actual Android model stays identical to the canonical fictional rules and review model', () => {
  const rules = read('../app/demo-rules.mjs').replaceAll('export ', '');
  const model = read('../app/measurement-model.mjs').split('\n')
    .filter(line => !line.startsWith('import ')).join('\n').replaceAll('export ', '');
  assert.equal(embedded, `${rules}\n${model}`.trim());
});

test('scenario changes invalidate old run callbacks and require fresh measurements', () => {
  let state = act(initialReview(), { type: 'run' });
  const oldGeneration = state.generation;
  state = act(state, { type: 'scenario', value: 'unreadable' });
  assert.equal(act(state, { type: 'complete', generation: oldGeneration }), state);
  assert.equal(state.status, 'idle');
  assert.ok(Object.values(state.records).every(record => record.originalMm === null));
  state = act(state, { type: 'run' });
  assert.equal(act(state, { type: 'complete', generation: oldGeneration }), state);
});

test('drafts block reports and all confirmations; corrections clear the affected approval', () => {
  let state = act(completed('fuzzy'), { type: 'verify', code: 'CIP', value: true });
  state = act(state, { type: 'confirm', code: 'CIP' });
  assert.equal(state.records.CIP.review, 'confirmed');
  state = act(state, { type: 'draft', code: 'CIP', patch: { mm: '22.1', reason: '  ' } });
  assert.equal(act(state, { type: 'apply', code: 'CIP' }), state);
  assert.equal(act(state, { type: 'confirm', code: 'AMC' }), state);
  assert.throws(() => captureReport(state, at), /apply or cancel/i);
  state = act(state, { type: 'draft', code: 'CIP', patch: { reason: 'Synthetic boundary adjustment' } });
  state = act(state, { type: 'apply', code: 'CIP' });
  assert.equal(state.records.CIP.originalMm, 25.4);
  assert.equal(state.records.CIP.correctedMm, 22.1);
  assert.equal(state.records.CIP.review, 'pending');
  assert.equal(state.records.CIP.verified, false);
  assert.equal(state.corrections[0].reason, 'Synthetic boundary adjustment');
});

test('ambiguous boundaries require inspection and profile changes clear every approval', () => {
  let state = completed('overlap');
  assert.equal(act(state, { type: 'confirm', code: 'CIP' }), state);
  state = correct(state, 'CIP', 22.1);
  for (const code of Object.keys(state.records)) {
    state = act(state, { type: 'verify', code, value: true });
    state = act(state, { type: 'confirm', code });
  }
  assert.ok(Object.values(state.records).every(record => record.review === 'confirmed'));
  state = act(state, { type: 'profile', value: 'B' });
  assert.ok(Object.values(state.records).every(record => record.review === 'pending' && !record.verified));
  assert.equal(state.records.CIP.correctedMm, 22.1);
  assert.equal(state.corrections.length, 1);
});

test('unreadable reports contain no measurements or categories and cannot imply clinical verification', () => {
  const report = captureReport(completed('unreadable'), at);
  assert.equal(report.timestamp, at);
  assert.match(report.type, /SYNTHETIC.*NOT FOR CLINICAL USE/);
  assert.match(report.outcome, /recapture required/i);
  assert.match(report.signature, /No authenticated clinical signature/);
  assert.ok(report.results.every(row => row.mm === null && row.interpretation === null && row.review === 'not applicable'));
  assert.equal(report.comparison.pairedCount, 0);
  assert.equal(report.comparison.categoryAgreement, null);
  assert.equal(report.comparison.meanAbsoluteDifference, null);
});

test('reports remain frozen snapshots when later measurements change', () => {
  let state = correct(completed(), 'CIP', 22.1, '=SUM(1,2)');
  const report = captureReport(state, at), json = JSON.stringify(report);
  assert.ok(Object.isFrozen(report) && Object.isFrozen(report.results[0]));
  assert.match(report.outcome, /Incomplete/);
  state = correct(state, 'CIP', 21, 'Later correction');
  assert.equal(state.records.CIP.correctedMm, 21);
  assert.equal(JSON.stringify(report), json);
  assert.equal(report.results[0].correctedMm, 22.1);
  assert.equal(report.correctionEvents[0].reason, '=SUM(1,2)');
});

function exportHarness(bridge) {
  const nativeCalls = [], downloads = [], blobs = [], revoked = [], timers = [];
  const window = bridge === false ? {} : { AndroidBridge: bridge ?? { saveSyntheticReport: (...args) => nativeCalls.push(args) } };
  const context = vm.createContext({
    window, Blob,
    document: { createElement: tag => {
      assert.equal(tag, 'a');
      const link = { click: () => downloads.push({ href: link.href, download: link.download }) };
      return link;
    } },
    URL: { createObjectURL: blob => { blobs.push(blob); return 'blob:synthetic-test'; }, revokeObjectURL: url => revoked.push(url) },
    setTimeout: callback => timers.push(callback)
  });
  vm.runInContext(`${exportSource}\nglobalThis.save = saveSyntheticReport;`, context);
  return { save: context.save, nativeCalls, downloads, blobs, revoked, timers };
}

test('native export receives the exact report text and does not also start a browser download', () => {
  const harness = exportHarness();
  const report = captureReport(completed(), at);
  for (const [format, text] of [['json', JSON.stringify(report)], ['csv', reportCsv(report)]]) {
    harness.save(format, text, `synthetic.${format}`);
    assert.deepEqual(harness.nativeCalls.at(-1), [format, text]);
  }
  assert.equal(harness.blobs.length, 0);
  assert.equal(harness.downloads.length, 0);
  assert.throws(() => harness.save('html', '<p>unexpected</p>', 'report.html'), /JSON or CSV/);
  assert.equal(harness.nativeCalls.length, 2);
});

test('ordinary browsers export the exact content with the expected MIME type and release its object URL', async () => {
  for (const [format, mime] of [['json', 'application/json'], ['csv', 'text/csv;charset=utf-8']]) {
    const harness = exportHarness(false), text = format === 'json' ? '{"type":"SYNTHETIC"}' : 'type\nSYNTHETIC';
    harness.save(format, text, `synthetic.${format}`);
    assert.equal(harness.blobs[0].type, mime);
    assert.equal(await harness.blobs[0].text(), text);
    assert.deepEqual(harness.downloads, [{ href: 'blob:synthetic-test', download: `synthetic.${format}` }]);
    harness.timers.forEach(callback => callback());
    assert.deepEqual(harness.revoked, ['blob:synthetic-test']);
  }
});
