import {
  composeCommand,
  expectChildToMatch,
  expectToPlaceOrders,
  spawnTestChild,
} from '../helpers/index.js';

describe('[OPTION] Market', () => {
  test('SUCCEEDS: Long flag (--market)', async () => {
    const options = '--market btc-perp --side buy --type market --size 1';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Short flag (-m)', async () => {
    const options = '-m btc-perp --side buy --type market --size 1';

    await expectToPlaceOrders(options, 1);
  });

  test('FAILS: Missing required option', async () => {
    const options = '--side buy --type market --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: required option '-m, --market <market>' not specified/,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Missing argument', async () => {
    const options = '--market --side buy --type market --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Market not found', async () => {
    const options = '--market invalid-market --side buy --type market --size 1';
    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [/.{24} {2}INFO {3}Processing order\(s\)/],
      stderrArray: [
        /.{24} {2}ERROR {4}Failed order: No such market: INVALID-MARKET/,
        /.{24} {2}ERROR {2}One or more orders failed to be placed/,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});
