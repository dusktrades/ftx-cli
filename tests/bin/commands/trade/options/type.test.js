import {
  composeCommand,
  expectChildToMatch,
  expectToPlaceOrders,
  spawnTestChild,
} from '../helpers/index.js';

describe('[OPTION] Type', () => {
  test('SUCCEEDS: Long flag (--type)', async () => {
    const options = '--market btc-perp --side buy --type market --size 1';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Short flag (-t)', async () => {
    const options = '--market btc-perp --side buy -t market --size 1';

    await expectToPlaceOrders(options, 1);
  });

  test('FAILS: Missing required option', async () => {
    const options = '--market btc-perp --side buy --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error: required option '-t, --type <type>' not specified/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Missing argument', async () => {
    const options = '--market btc-perp --side buy --type --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument', async () => {
    const options = '--market btc-perp --side buy --type invalid-type --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-t, --type <type>' argument 'invalid-type' is invalid\. Order type must be one of: m, market, l, limit, sm, stop-market, sl, stop-limit, ts, trailing-stop, tpm, take-profit-market, tpl, take-profit-limit\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});
