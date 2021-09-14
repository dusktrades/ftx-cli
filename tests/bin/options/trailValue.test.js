import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Trail value', () => {
  describe('SUCCEEDS: Long flag (--trail-value); valid argument', () => {
    const validArguments = ['1', '10', '100', '1000']
      .flatMap((argument) => [argument, `-${argument}`])
      .flatMap((argument) => [argument, `${argument}k`, `${argument}m`]);

    for (const argument of validArguments) {
      test(`SUCCEEDS: --trail-value ${argument}`, async () => {
        const options = `${baseOptions} --trail-value ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToSucceed(command);
      });
    }
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --trail-value`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  describe('FAILS: Invalid argument', () => {
    const invalidArguments = ['invalid', '0', '-0', '0k'];

    for (const argument of invalidArguments) {
      test(`FAILS: --trail-value ${argument}`, async () => {
        const options = `${baseOptions} --trail-value ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToError(command);
      });
    }
  });
});
