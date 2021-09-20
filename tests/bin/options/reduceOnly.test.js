import {
  composeCommand,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

describe('[OPTION] Reduce-Only', () => {
  test('SUCCEEDS: Long flag (--reduce-only)', async () => {
    const options = `${baseOptions} --reduce-only`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Negated long flag (--no-reduce-only)', async () => {
    const options = `${baseOptions} --no-reduce-only`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });
});
