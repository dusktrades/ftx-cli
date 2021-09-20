import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Duration', () => {
  describe('SUCCEEDS: Long flag (--duration); valid argument', () => {
    /**
     * We are taking advantage of the fact that duration can be used with the
     * default split of 1 (i.e. no split) to place fake TWAP orders that will
     * fulfil immediately, despite the option argument.
     */
    const validArguments = [
      '1s',
      '1m',
      '1h',
      '1m1s',
      '1h1s',
      '1h1m',
      '1h1m1s',
      '1H1M1S',
      '123456789h123456789m123456789s',
    ];

    for (const argument of validArguments) {
      test(`SUCCEEDS: --duration ${argument}`, async () => {
        const options = `${baseOptions} --duration ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToSucceed(command);
      });
    }
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --duration`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  describe('FAILS: Invalid argument', () => {
    const invalidArguments = [
      'invalid',
      '1',
      '0s',
      '0.5s',
      '-1s',
      '1s1m',
      '1m1h',
      '1s1m1h',
    ];

    for (const argument of invalidArguments) {
      test(`FAILS: --duration ${argument}`, async () => {
        const options = `${baseOptions} --duration ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToError(command);
      });
    }
  });
});
