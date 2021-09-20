import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type trailing-stop --size 1';

describe('[COMMAND] Trade: trailing stop order', () => {
  test('SUCCEEDS: Trailing stop order', async () => {
    const options = `${baseOptions} --trail-value 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Split trailing stop order', async () => {
    const options = `${baseOptions} --trail-value 1 --split 3`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Timed split trailing stop order', async () => {
    const options = `${baseOptions} --trail-value 1 --split 3 --duration 3s`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Ignores price option', async () => {
    const options = `${baseOptions} --trail-value 1 --price 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('FAILS: Missing required trail value option', async () => {
    const command = composeCommand('trade', baseOptions);

    await expectChildProcessToError(command);
  });
});
