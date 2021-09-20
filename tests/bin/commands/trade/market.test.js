import {
  composeCommand,
  expectChildProcessToSucceed,
} from '../../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[COMMAND] Trade: market order', () => {
  test('SUCCEEDS: Market order', async () => {
    const command = composeCommand('trade', baseOptions);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Split market order', async () => {
    const options = `${baseOptions} --split 3`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: TWAP order', async () => {
    const options = `${baseOptions} --split 3 --duration 3s`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Ignores price option', async () => {
    const options = `${baseOptions} --price 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });
});
