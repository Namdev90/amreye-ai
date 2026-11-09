import { fileURLToPath } from 'node:url';
import { runBoundedCommand } from './run-bounded-command.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const cli = fileURLToPath(new URL('../node_modules/vinext/dist/cli.js', import.meta.url));
try {
  process.exitCode = await runBoundedCommand(process.execPath, [cli, 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, WRANGLER_WRITE_LOGS: 'false', WRANGLER_LOG_PATH: '.wrangler/logs' },
  });
  if (process.exitCode === 124) console.error('Build timed out after three minutes.');
} catch (error) {
  console.error(`Build could not start: ${error.message}`);
  process.exitCode = 1;
}
