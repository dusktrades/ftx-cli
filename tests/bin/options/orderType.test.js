import { CHOICES } from '../../../bin/options/commands/order-type/index.js';

import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

/**
 * Test all order types with the same option set by taking advantage of ignored
 * options.
 */
const baseOptions =
  '--market btc/usd --side buy --size 1 --price 1 --trigger-price 1 --trail-value 1';

describe('[OPTION] Order type', () => {
  describe('SUCCEEDS: Long flag (--type); valid argument', () => {
    for (const choice of CHOICES) {
      test(`SUCCEEDS: --type ${choice}`, async () => {
        const options = `${baseOptions} --type ${choice}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToSucceed(command);
      });
    }
  });

  test('SUCCEEDS: Short flag (-t); valid argument', async () => {
    const options = `${baseOptions} -t market`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('FAILS: Missing option (always required)', async () => {
    const command = composeCommand('trade', baseOptions);

    await expectChildProcessToError(command);
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --type`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  test('FAILS: Invalid argument', async () => {
    const options = `${baseOptions} --type invalid`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });
});
