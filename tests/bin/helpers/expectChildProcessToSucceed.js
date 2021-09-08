import { expectChildProcessToExitWith } from './expectChildProcessToExitWith.js';

async function expectChildProcessToSucceed(command) {
  return expectChildProcessToExitWith(command, 0);
}

export { expectChildProcessToSucceed };
