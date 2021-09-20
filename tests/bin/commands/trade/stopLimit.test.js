import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type stop-limit --size 1';

describe('[COMMAND] Trade: stop limit order', () => {
  test('SUCCEEDS: Stop limit order', async () => {
    const options = `${baseOptions} --price 1 --trigger-price 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Split stop limit order', async () => {
    const options = `${baseOptions} --price 1 --trigger-price 1 --split 3`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Scaled stop limit order', async () => {
    const options = `${baseOptions} --price 1:2 --trigger-price 1 --split 3`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Timed split stop limit order', async () => {
    const options = `${baseOptions} --price 1 --trigger-price 1 --split 3 --duration 3s`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Timed scaled stop limit order', async () => {
    const options = `${baseOptions} --price 1:2 --trigger-price 1 --split 3 --duration 3s`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('FAILS: Missing required price option', async () => {
    const options = `${baseOptions} --trigger-price 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  test('FAILS: Missing required trigger price option', async () => {
    const options = `${baseOptions} --price 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });
});
