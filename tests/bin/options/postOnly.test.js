import {
  composeCommand,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Post-Only', () => {
  test('SUCCEEDS: Long flag (--post-only)', async () => {
    const options = `${baseOptions} --post-only`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Negated long flag (--no-post-only)', async () => {
    const options = `${baseOptions} --no-post-only`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });
});
