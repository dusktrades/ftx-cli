import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../../helpers/index.js';

const baseOptions =
  '--market btc/usd --side buy --type take-profit-limit --size 1';

describe('[COMMAND] Trade: take profit limit', () => {
  test('SUCCEEDS: Take profit limit order', async () => {
    const options = `${baseOptions} --price 1 --trigger-price 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Split take profit limit order', async () => {
    const options = `${baseOptions} --price 1 --trigger-price 1 --split 3`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Scaled take profit limit order', async () => {
    const options = `${baseOptions} --price 1:2 --trigger-price 1 --split 3`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Timed split take profit limit order', async () => {
    const options = `${baseOptions} --price 1 --trigger-price 1 --split 3 --duration 3s`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Timed scaled take profit limit order', async () => {
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
