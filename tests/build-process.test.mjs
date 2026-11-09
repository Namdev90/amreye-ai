import test from 'node:test';
import assert from 'node:assert/strict';
import { runBoundedCommand } from '../scripts/run-bounded-command.mjs';

test('bounded commands preserve success and nonzero exit codes', async () => {
  for (const code of [0, 7]) {
    assert.equal(await runBoundedCommand(process.execPath, ['-e', `process.exit(${code})`]), code);
  }
});

test('a timeout stays a failure even when the child handles termination with exit zero', async () => {
  const script = "process.on('SIGTERM',()=>process.exit(0)); setInterval(()=>{},1000)";
  const code = await runBoundedCommand(process.execPath, ['-e', script], { timeoutMs: 300, killAfterMs: 300 });
  assert.equal(code, 124);
});

test('a child that ignores termination is forcibly stopped', async () => {
  const script = "process.on('SIGTERM',()=>{}); setInterval(()=>{},1000)";
  const code = await runBoundedCommand(process.execPath, ['-e', script], { timeoutMs: 300, killAfterMs: 300 });
  assert.equal(code, 124);
});

test('startup errors and invalid timeout settings reject promptly', async () => {
  await assert.rejects(runBoundedCommand('amreye-command-that-does-not-exist', []), { code: 'ENOENT' });
  await assert.rejects(runBoundedCommand(process.execPath, [], { timeoutMs: 0 }), RangeError);
});
