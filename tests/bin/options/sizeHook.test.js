import { DYNAMIC_HOOK_CHOICES } from '../../../bin/options/global/size-hook/index.js';

import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Size hook', () => {
  describe('SUCCEEDS: Long flag (--size-hook); valid static hook argument', () => {
    const validArguments = [
      '0.1',
      '1',
      '1.0',
      '1.1',
      '123.123456789',
      '123456789.123456789',
      '123456789123456789.123456789123456789',

      // Weird formatting that probably won't be used (parsing by-product).
      '00.1',
      '1.',
      '.1',
      '0b11111111',
      '0xff',
    ].flatMap((argument) => [argument, `${argument}k`, `${argument}m`]);

    for (const argument of validArguments) {
      test(`SUCCEEDS: --size-hook ${argument}`, async () => {
        const options = `${baseOptions} --size-hook ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToSucceed(command);
      });
    }
  });

  describe('SUCCEEDS: Long flag (--size-hook); valid dynamic hook argument', () => {
    for (const choice of DYNAMIC_HOOK_CHOICES) {
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

  describe('FAILS: Invalid argument', () => {
    const invalidArguments = [
      'invalid',
      ...[
        '0invalid',
        'invalid0',
        '0',
        '00',
        '0.',
        '.0',
        '0.0',
        '--0',
        '-0',
        '-00',
        '-0.0',
        '-1',
        '-123456789123456789.123456789123456789',
      ].flatMap((argument) => [argument, `${argument}k`, `${argument}m`]),
    ];

    for (const argument of invalidArguments) {
      test(`FAILS: --size-hook ${argument}`, async () => {
        const options = `${baseOptions} --size-hook ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToError(command);
      });
    }
  });
});
