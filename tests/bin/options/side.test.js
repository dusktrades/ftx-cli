import { CHOICES } from '../../../bin/options/commands/side/index.js';

import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --type market --size 1';

describe('[OPTION] Side', () => {
  describe('SUCCEEDS: Long flag (--side); valid argument', () => {
    for (const choice of CHOICES) {
      test(`SUCCEEDS: --side ${choice}`, async () => {
        const options = `${baseOptions} --side ${choice}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToSucceed(command);
      });
    }
  });

  test('FAILS: Missing option (always required)', async () => {
    const command = composeCommand('trade', baseOptions);

    await expectChildProcessToError(command);
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --side`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  test('FAILS: Invalid argument', async () => {
    const options = `${baseOptions} --side invalid`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });
});
