import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type limit --size 1';

describe('[COMMAND] Trade: limit order', () => {
  test('SUCCEEDS: Limit order', async () => {
    const options = `${baseOptions} --price 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Split limit order', async () => {
    const options = `${baseOptions} --price 1 --split 3`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Scaled limit order', async () => {
    const options = `${baseOptions} --price 1:2 --split 3`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Timed split limit order', async () => {
    const options = `${baseOptions} --price 1 --split 3 --duration 3s`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Timed scaled limit order', async () => {
    const options = `${baseOptions} --price 1:2 --split 3 --duration 3s`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('FAILS: Missing required price option', async () => {
    const command = composeCommand('trade', baseOptions);

    await expectChildProcessToError(command);
  });
});
