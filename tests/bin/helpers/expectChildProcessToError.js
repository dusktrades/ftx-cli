import { expectChildProcessToExitWith } from './expectChildProcessToExitWith.js';

async function expectChildProcessToError(command) {
  return expectChildProcessToExitWith(command, 1);
}

export { expectChildProcessToError };
