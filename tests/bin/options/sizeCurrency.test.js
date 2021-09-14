import { CHOICES } from '../../../bin/options/global/size-currency/index.js';

import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Size currency', () => {
  describe('SUCCEEDS: Long flag (--size-currency); valid argument choice', () => {
    for (const choice of CHOICES) {
      test(`SUCCEEDS: --size-currency ${choice}`, async () => {
        const options = `${baseOptions} --size-currency ${choice}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToSucceed(command);
      });
    }
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --size-currency`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  test('FAILS: Invalid argument', async () => {
    const options = `${baseOptions} --size-currency invalid`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });
});
