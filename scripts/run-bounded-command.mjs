import { spawn } from 'node:child_process';

/** Run a child without a shell. A timed-out child can never report success. */
export function runBoundedCommand(command, args, { timeoutMs = 180000, killAfterMs = 5000, ...options } = {}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || !Number.isFinite(killAfterMs) || killAfterMs <= 0) {
    return Promise.reject(new RangeError('Command timeouts must be positive finite milliseconds.'));
  }
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    let timedOut = false;
    let killTimer;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
      killTimer = setTimeout(() => child.kill('SIGKILL'), killAfterMs);
    }, timeoutMs);
    const clearTimers = () => { clearTimeout(timer); clearTimeout(killTimer); };
    child.once('error', error => { clearTimers(); reject(error); });
    child.once('close', code => {
      clearTimers();
      resolve(timedOut ? 124 : code ?? 1);
    });
  });
}
