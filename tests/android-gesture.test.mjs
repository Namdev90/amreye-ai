import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const runtime = fs.readFileSync(new URL('../android/app/src/main/assets/offline-runtime.js', import.meta.url), 'utf8');
const start = runtime.indexOf('  function initPullToRefresh()');
const end = runtime.indexOf('  // --- 8.', start);
assert.ok(start >= 0 && end > start, 'Missing pull-to-refresh function');
const source = runtime.slice(start, end);

function gestureHarness() {
  const handlers = new Map();
  const indicator = { style: {}, classList: { add() {}, remove() {} } };
  const observations = { refreshes: 0, prompts: 0 };
  const window = { scrollY: 0, addEventListener: (name, handler) => handlers.set(name, handler) };
  const context = {
    window,
    document: { getElementById: () => indicator },
    navigator: { onLine: true },
    location: { hostname: 'appassets.androidplatform.net' },
    showToast: () => observations.refreshes++,
    confirm: () => { observations.prompts++; return false; },
    setTimeout: callback => callback(),
  };
  vm.runInNewContext(`${source}\ninitPullToRefresh();`, context);
  return {
    observations, indicator, window,
    emit: (name, y = 0) => handlers.get(name)({ touches: [{ clientY: y }] }),
  };
}

test('a stationary tap does not reuse the previous gesture position', () => {
  const h = gestureHarness();
  h.emit('touchstart', 200);
  h.emit('touchmove', 250);
  h.emit('touchend');
  h.emit('touchstart', 100);
  h.emit('touchend');
  assert.deepEqual(h.observations, { refreshes: 0, prompts: 0 });
});

test('only a fresh pull beyond the threshold refreshes', () => {
  const h = gestureHarness();
  for (const distance of [0, -90, 70, 71]) {
    h.emit('touchstart', 200);
    h.emit('touchmove', 200 + distance);
    h.emit('touchend');
    assert.equal(h.observations.refreshes, distance > 70 ? 1 : 0);
  }
  h.emit('touchstart', 100);
  h.emit('touchend');
  assert.deepEqual(h.observations, { refreshes: 1, prompts: 1 });
});

test('canceling a pull hides the indicator and prevents a later end from refreshing', () => {
  const h = gestureHarness();
  h.emit('touchstart', 100);
  h.emit('touchmove', 200);
  assert.notEqual(h.indicator.style.top, '-60px');
  h.emit('touchcancel');
  assert.equal(h.indicator.style.top, '-60px');
  h.emit('touchend');
  h.emit('touchstart', 20);
  h.emit('touchend');
  assert.deepEqual(h.observations, { refreshes: 0, prompts: 0 });
});

test('a gesture away from the top cannot inherit an unfinished pull', () => {
  const h = gestureHarness();
  h.emit('touchstart', 100);
  h.emit('touchmove', 200);
  h.window.scrollY = 50;
  h.emit('touchstart', 100);
  h.emit('touchmove', 220);
  h.emit('touchend');
  assert.deepEqual(h.observations, { refreshes: 0, prompts: 0 });
});

test('native report export explicitly truncates an existing destination', () => {
  // Source contract only: provider behavior still requires Android instrumentation.
  const activity = fs.readFileSync(new URL('../android/app/src/main/java/ai/amreye/app/MainActivity.java', import.meta.url), 'utf8');
  assert.match(activity, /openOutputStream\(destination,\s*"wt"\)/);
  assert.doesNotMatch(activity, /openOutputStream\(destination,\s*"w"\)/);
});
