import test from 'node:test';
import assert from 'node:assert/strict';
import { pageMethodResponse } from '../worker/page-method-policy.mjs';

const base = process.env.TEST_SITE_URL || 'http://127.0.0.1:5179';
const pages = ['/', '/library', '/rsc', '/.rsc', '/library.rsc'];
const allow = 'GET, HEAD, OPTIONS';

test('page method policy leaves rendering and unrelated/API handlers untouched', () => {
  for (const path of pages) {
    for (const method of ['GET', 'HEAD']) assert.equal(pageMethodResponse(path, method), null);
  }
  for (const path of ['/api/private/reviews', '/api/private/assets', '/api/private/library', '/assets/file.js', '/unknown-page']) {
    for (const method of ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
      assert.equal(pageMethodResponse(path, method), null, `${method} ${path}`);
    }
  }
});

test('ordinary, unknown and progressive action POSTs are rejected without decoding or echoing', async () => {
  for (const path of [...pages, '/library/', '/library?topic=reader-v1']) {
    for (const kind of ['ordinary', 'next-action', 'x-rsc-action', 'progressive']) {
      const form = new FormData();
      form.set(kind === 'progressive' ? '$ACTION_ID_synthetic-missing-action' : 'synthetic', 'synthetic-only-marker');
      const headers = kind.endsWith('action') ? { [kind]: 'synthetic-missing-action' } : {};
      const response = await fetch(base + path, { method: 'POST', headers, body: form, redirect: 'manual' });
      assert.equal(response.status, 405, `${kind} POST ${path}`);
      assert.equal(response.headers.get('allow'), allow);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(await response.text(), 'Method Not Allowed');
    }
  }
});

test('malformed action bodies also stop before the framework parser', async () => {
  const response = await fetch(base + '/', {
    method: 'POST', headers: { 'next-action': 'synthetic-missing-action', 'content-type': 'multipart/form-data; boundary=absent' },
    body: 'synthetic malformed body without form boundaries',
  });
  assert.equal(response.status, 405);
  assert.equal(await response.text(), 'Method Not Allowed');
});

test('read-only page endpoints advertise OPTIONS and reject other write methods', async () => {
  for (const path of pages) {
    const options = await fetch(base + path, { method: 'OPTIONS' });
    assert.equal(options.status, 204, path);
    assert.equal(options.headers.get('allow'), allow);
    assert.equal(await options.text(), '');
    for (const method of ['PUT', 'PATCH', 'DELETE']) {
      const response = await fetch(base + path, { method });
      assert.equal(response.status, 405, `${method} ${path}`);
      assert.equal(response.headers.get('allow'), allow);
      await response.body.cancel();
    }
  }
});

test('public GET and HEAD pages still render and HEAD is bodyless', async () => {
  for (const path of ['/', '/library', '/library?topic=reader-v1']) {
    const get = await fetch(base + path);
    assert.equal(get.status, 200);
    assert.match(await get.text(), /AMReye/);
    const head = await fetch(base + path, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
  }
});

test('retired review API methods and public asset redirects retain their own policy', async () => {
  for (const method of ['GET', 'HEAD', 'POST']) {
    const response = await fetch(base + '/api/private/reviews', { method });
    assert.equal(response.status, 410, method);
    if (method === 'HEAD') assert.equal(await response.text(), '');
    else assert.equal((await response.json()).error, 'The admin review workspace has been removed.');
  }
  const asset = await fetch(base + '/api/private/assets?name=hardware/apex-concept.webp', { redirect: 'manual' });
  assert.equal(asset.status, 308);
  assert.equal(new URL(asset.headers.get('location')).pathname, '/hardware/apex-concept.webp');
  await asset.body?.cancel();
});
