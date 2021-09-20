import { CHOICES } from '../../../bin/options/global/size-hook/index.js';

import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Size hook', () => {
  describe('SUCCEEDS: Long flag (--size-hook); valid argument', () => {
    for (const choice of CHOICES) {
      test(`SUCCEEDS: --size-hook ${choice}`, async () => {
        const options = `${baseOptions} --size-hook ${choice}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToSucceed(command);
      });
    }
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --size-hook`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  test('FAILS: Invalid argument', async () => {
    const options = `${baseOptions} --size-hook invalid`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });
});
