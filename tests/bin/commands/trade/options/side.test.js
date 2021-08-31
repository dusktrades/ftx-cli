import { expectChildToMatch, spawnTestChild } from '../../../helpers/index.js';
import { composeTradeCommand, expectToPlaceOrders } from '../helpers/index.js';

describe('[OPTION] Side', () => {
  test('SUCCEEDS: Long flag (--side)', async () => {
    const options = '--market btc-perp --side buy --type market --size 1';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Argument choices', async () => {
    const choices = ['buy', 'b', 'sell', 's'];

    const expectations = choices.map((choice) => {
      const options = `--market btc-perp --side ${choice} --type market --size 1`;

      return expectToPlaceOrders(options, 1);
    });

    await Promise.all(expectations);
  });

  test('FAILS: Missing required option', async () => {
    const options = '--market btc-perp --type market --size 1';
    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error: required option '--side <side>' not specified/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Missing argument', async () => {
    const options = '--market btc-perp --side --type market --size 1';
    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument', async () => {
    const options =
      '--market btc-perp --side invalid-side --type market --size 1';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '--side <side>' argument 'invalid-side' is invalid\. Side must be one of: b, buy, s, sell\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});
