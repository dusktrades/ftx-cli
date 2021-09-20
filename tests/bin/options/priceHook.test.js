import { CHOICES } from '../../../bin/options/global/price-hook/index.js';

import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Price hook', () => {
  describe('SUCCEEDS: Long flag (--price-hook); valid argument', () => {
    for (const choice of CHOICES) {
      test(`SUCCEEDS: --price-hook ${choice}`, async () => {
        const options = `${baseOptions} --price-hook ${choice}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToSucceed(command);
      });
    }
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --price-hook`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  test('FAILS: Invalid argument', async () => {
    const options = `${baseOptions} --price-hook invalid`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });
});
