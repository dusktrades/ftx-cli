import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--side buy --type market --size 1';

// Argument parser accepts anything: API decides whether market is valid.
describe('[OPTION] Market', () => {
  test('SUCCEEDS: Long flag (--market); valid argument', async () => {
    const options = `${baseOptions} --market btc/usd`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Short flag (-m); valid argument', async () => {
    const options = `${baseOptions} -m btc/usd`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('FAILS: Missing option (always required)', async () => {
    const command = composeCommand('trade', baseOptions);

    await expectChildProcessToError(command);
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --market`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  test('FAILS: Invalid argument', async () => {
    const options = `${baseOptions} --market invalid-market`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });
});
