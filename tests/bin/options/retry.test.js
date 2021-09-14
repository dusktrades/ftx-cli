import {
  composeCommand,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Retry', () => {
  test('SUCCEEDS: Long flag (--retry)', async () => {
    const options = `${baseOptions} --retry`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Negated long flag (--no-retry)', async () => {
    const options = `${baseOptions} --no-retry`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });
});
