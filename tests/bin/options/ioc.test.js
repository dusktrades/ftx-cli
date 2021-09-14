import {
  composeCommand,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] IOC', () => {
  test('SUCCEEDS: Long flag (--ioc)', async () => {
    const options = `${baseOptions} --ioc`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Negated long flag (--no-ioc)', async () => {
    const options = `${baseOptions} --no-ioc`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });
});
