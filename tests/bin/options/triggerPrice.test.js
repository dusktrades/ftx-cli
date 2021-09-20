import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Trigger price', () => {
  describe('SUCCEEDS: Long flag (--trigger-price); valid argument', () => {
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
      test(`SUCCEEDS: --trigger-price ${argument}`, async () => {
        const options = `${baseOptions} --trigger-price ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToSucceed(command);
      });
    }
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --trigger-price`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  describe('FAILS: Invalid argument', () => {
    const invalidArguments = ['invalid', '0', '-0', '0k', '-1'];

    for (const argument of invalidArguments) {
      test(`FAILS: --trigger-price ${argument}`, async () => {
        const options = `${baseOptions} --trigger-price ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToError(command);
      });
    }
  });
});
