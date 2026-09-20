import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';

// Runtime tests need the Cloudflare-compatible preview, not a plain Node import.
const root = fileURLToPath(new URL('..', import.meta.url));
let server;
try {
  let base = process.env.TEST_SITE_URL;
  if (!base) {
    server = await preview({
      root,
      preview: { host: '127.0.0.1', port: 0, strictPort: true, open: false },
    });
    base = `http://127.0.0.1:${server.httpServer.address().port}`;
  }
  const response = await fetch(base, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Test preview returned HTTP ${response.status}`);
  await response.body?.cancel();
  const files = (await readdir(new URL('../tests/', import.meta.url)))
    .filter(name => name.endsWith('.test.mjs')).sort().map(name => `tests/${name}`);
  process.exitCode = await new Promise((resolve, reject) => {
    const tests = spawn(process.execPath, ['--test', ...files], {
      cwd: root, stdio: 'inherit', env: { ...process.env, TEST_SITE_URL: base },
    });
    tests.once('error', reject);
    tests.once('exit', code => resolve(code ?? 1));
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await server?.close();
}
