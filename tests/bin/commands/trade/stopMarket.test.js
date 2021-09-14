import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type stop-market --size 1';

describe('[COMMAND] Trade: stop market order', () => {
  test('SUCCEEDS: Stop market order', async () => {
    const options = `${baseOptions} --trigger-price 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Split stop market order', async () => {
    const options = `${baseOptions} --trigger-price 1 --split 3`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Timed split stop market order', async () => {
    const options = `${baseOptions} --trigger-price 1 --split 3 --duration 3s`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Ignores price option', async () => {
    const options = `${baseOptions} --trigger-price 1 --price 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('FAILS: Missing required trigger price option', async () => {
    const command = composeCommand('trade', baseOptions);

    await expectChildProcessToError(command);
  });
});
