import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Split', () => {
  describe('SUCCEEDS: Long flag (--split); valid argument', () => {
    // TODO: Maybe put hard limit of ~1000 to prevent accidental overflows.
    const validArguments = ['1', '10', '100', '0.001k', '0.000001m'];

    for (const argument of validArguments) {
      test(`SUCCEEDS: --split ${argument}`, async () => {
        const options = `${baseOptions} --split ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToSucceed(command);
      });
    }
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --split`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  describe('FAILS: Invalid argument', () => {
    const invalidArguments = ['invalid', '0', '-0', '0k', '0.1', '-1'];

    for (const argument of invalidArguments) {
      test(`FAILS: --split ${argument}`, async () => {
        const options = `${baseOptions} --split ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToError(command);
      });
    }
  });
});
