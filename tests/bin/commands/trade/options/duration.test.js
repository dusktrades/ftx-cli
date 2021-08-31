import { expectChildToMatch, spawnTestChild } from '../../../helpers/index.js';
import { composeTradeCommand, expectToPlaceOrders } from '../helpers/index.js';

async function expectArgumentToBeInvalid(argument) {
  const options = `--market btc-perp --side buy --type market --size 1 --duration ${argument}`;

  const command = composeTradeCommand(options);

  const expectedChild = {
    stdoutArray: [],
    stderrArray: [
      new RegExp(
        String.raw`error: option '--duration <duration>' argument '${argument}' is invalid\. Duration must be one or more integers greater than zero paired with duration part identifiers \(format: XhYmZs\)\.`
      ),
    ],
    exitCode: 1,
  };

  const child = spawnTestChild(command);

  await expectChildToMatch(child, expectedChild);
}

/**
 * We are taking advantage of the fact that duration can be used with the
 * default split of 1 (i.e. no split) to place fake TWAP orders that will fulfil
 * immediately, despite the option argument.
 */
describe('[OPTION] Duration', () => {
  test('SUCCEEDS: Long flag (--duration)', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --duration 1s';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Full format argument', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --duration 1h1m1s';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Partial format argument', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --duration 1h1m';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Partial, skipped-part format argument', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --duration 1h1s';

    await expectToPlaceOrders(options, 1);
  });

  test('FAILS: Missing argument', async () => {
    const options =
      '--market btc-perp --side buy --type market --size 1 --duration';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (invalid duration)', async () => {
    await expectArgumentToBeInvalid('invalid-duration');
  });

  test('FAILS: Invalid argument (duration part missing identifier)', async () => {
    await expectArgumentToBeInvalid('1');
  });

  test('FAILS: Invalid argument (negative duration part)', async () => {
    await expectArgumentToBeInvalid('-1s');
  });

  test('FAILS: Invalid argument (zero duration part)', async () => {
    await expectArgumentToBeInvalid('0s');
  });

  test('FAILS: Invalid argument (incorrect duration part order)', async () => {
    await expectArgumentToBeInvalid('1s1m1h');
  });
});
